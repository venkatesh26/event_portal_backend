const eventService = require('../services/events');
const countryService = require('../services/countries');
const stateService = require('../services/states');
const cityService = require('../services/cities');
const tagService = require('../services/tag');
const userService = require('../services/user');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
const Sequelize = require('sequelize');
const QueryTypes   = Sequelize.QueryTypes;
var sequelize = require('../db');

module.exports = {
  async admin_dashboard_report(req, res) {

    var dateTime = require('node-datetime');
    var dt = dateTime.create();

    // Total Users
    const users = await sequelize.query("SELECT count(*) as total_users FROM `users`", { type: QueryTypes.SELECT });
    total_users = (users[0]['total_users']);

    // Today Register Users
    var today_start_date = dt.format('Y-m-d')+" 00:00:00"; 
    var today_end_date = dt.format('Y-m-d')+" 23:59:59"; 
    const today_register = await sequelize.query("SELECT count(*) as total_users FROM `users` where createdAt BETWEEN  '"+today_start_date+"' AND '"+today_end_date+"';", { type: QueryTypes.SELECT });
    today_register_users = (today_register[0]['total_users']);


    // Total Events    
    const events = await sequelize.query("SELECT count(*) as total_events FROM `events`", { type: QueryTypes.SELECT });
    total_events = (events[0]['total_events']);

    // Total Active Events
    const total_active_events_data = await sequelize.query("SELECT count(*) as total_events FROM `events` where status='published'", { type: QueryTypes.SELECT });
    total_active_events = (total_active_events_data[0]['total_events']);


    // Total Pending Events
    const total_pending_events_data = await sequelize.query("SELECT count(*) as total_events FROM `events` where status='waiting_for_approval'", { type: QueryTypes.SELECT });
    total_pending_events = (total_pending_events_data[0]['total_events']);

    // Today Pending Events
    const today_pending_events_data = await sequelize.query("SELECT count(*) as total_events FROM `events` where status='waiting_for_approval' AND createdAt BETWEEN  '"+today_start_date+"' AND '"+today_end_date+"' ", { type: QueryTypes.SELECT });
    today_pending_events = (today_pending_events_data[0]['total_events']);

    // Orders
    const total_orders_data = await sequelize.query("SELECT count(*) as total_orders FROM `event_orders` where status='succeeded'", { type: QueryTypes.SELECT });
    total_orders = (total_orders_data[0]['total_orders']);

    // Today Orders
    const today_orders_data = await sequelize.query("SELECT count(*) as total_orders FROM `event_orders` where status='succeeded' AND createdAt BETWEEN  '"+today_start_date+"' AND '"+today_end_date+"'", { type: QueryTypes.SELECT });
    today_orders = (today_orders_data[0]['total_orders']);

    var report_object = {
        'total_users':total_users,
        'today_register_users':today_register_users,
        'total_events':total_events,
        'total_active_events':total_active_events,
        'total_pending_events':total_pending_events,
        'today_pending_events':today_pending_events,
        'total_orders':total_orders,
        'today_orders':today_orders
    }

    return res.send({
        success: true,
        data: report_object
    });
  },
  async order_report(req, res) {

    // Last 7 Days Report 
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    dt.offsetInDays(-7);
    var today_start_date = dt.format('Y-m-d')+" 00:00:00"; 
    var dt = dateTime.create();
    var today_end_date = dt.format('Y-m-d')+" 23:59:59"; 
    const order_report_data = await sequelize.query("SELECT count(id) as total_orders, DATE(createdAt) as date FROM event_orders where createdAt BETWEEN  '"+today_start_date+"' AND '"+today_end_date+"' GROUP BY DATE(createdAt);", { type: QueryTypes.SELECT });
    var order_report_final_data=[];
    for(i=6;i>=0;i--) {
        var dateTime = require('node-datetime');
        var dt = dateTime.create();
        dt.offsetInDays(-i);
        var date = dt.format('Y-m-d');
        var obj={};
        obj.total_orders=0;
        obj.date=date;
        order_report_data.map(function(data){
          if(data.date==date){       
            obj.total_orders=data.total_orders;
            obj.date=data.date;
          }
        });
        order_report_final_data.push(obj);
    }
    return res.send({
        success: true,
        data: order_report_final_data
    });  
  },
  async revenue_report(req, res) {

    // Last 7 Days Revenue
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    dt.offsetInDays(-7);
    var today_start_date = dt.format('Y-m-d')+" 00:00:00"; 
    var dt = dateTime.create();
    var today_end_date = dt.format('Y-m-d')+" 23:59:59"; 
    var currency_id="1"; // Default Currency
    if(req.query.currency_id){
       currency_id=req.query.currency_id;
    }
    const order_report_data = await sequelize.query("SELECT sum(total_amount) as total_amount, DATE(createdAt) as date FROM event_orders where event_orders.currency_id="+currency_id+" AND createdAt BETWEEN  '"+today_start_date+"' AND '"+today_end_date+"' GROUP BY DATE(createdAt);", { type: QueryTypes.SELECT });

    var order_report_final_data=[];
    for(i=6;i>=0;i--) {
        var dateTime = require('node-datetime');
        var dt = dateTime.create();
        dt.offsetInDays(-i);
        var date = dt.format('Y-m-d');
        var obj={};
        obj.total_amount=0;
        obj.date=date;
        order_report_data.map(function(data){
          if(data.date==date){       
            obj.total_amount=data.total_amount;
            obj.date=data.date;
          }
        });
        order_report_final_data.push(obj);
    }
    return res.send({
        success: true,
        data: order_report_final_data
    });
  },
  async recent_enquiry(req, res) {
    var order_query = ['createdAt', 'DESC'];
    const EventEnquiry = await models.event_enquiries.findAndCountAll({
      distinct:true,
      include:[
        {
          model: models.events,
          attributes:['name']
        }
      ],
      limit: 5,
      order: [order_query],
      $sort: { id: 1 }
    });
    return res.send({
        success: true,
        data: EventEnquiry.rows,
        count: EventEnquiry.count
    });
  },
  async recent_orders(req, res) {

    var order_query = ['createdAt', 'DESC'];
    const EventOrders = models.event_orders.findAndCountAll({
      distinct:true,
      limit: limit,
      include: [
          {
              model: models.users,
              attributes: ['first_name', 'email']
          },
          {
              model: models.currencies,
              attributes: ['name']
          },
          {
              model: models.events,
              attributes: ['name']
          }
      ],
      order: [order_query],
      offset: offset,
      $sort: { id: 1 }
    });
    return res.send({
        success: true,
        data: EventOrders.rows,
        count: EventOrders.count
    });
  },
  async recent_contacts(req, res) {
    var order_query = ['createdAt', 'DESC'];
    const Contacts = await models.contacts.findAndCountAll({  
      limit: 5,
      order: [order_query],
      $sort: { id: 1 }
    });
    console.log(Contacts);

    return res.send({
        success: true,
        data: Contacts.rows,
        count: Contacts.count
    });
  }
}
 

