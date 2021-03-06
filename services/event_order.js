const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const getMyOrders = function (data,  user_id) {
  let where = {}
  let limit = 10;
  let offset = 0;
  let order_query = []
  if(data.order_key && data.order_param){ 
    order_query.push(data.order_key)  
    order_query.push(data.order_param)
  }else{
    order_query = ['createdAt', 'DESC']
  }
  var page = 1;
  if (data.limit) {
    limit = parseInt(data.limit);
  }
  if(data.page_no){
    page = parseInt(data.page_no);
  }
  offset = limit * (page - 1);
  if (data.name) {
    where.name = { [Op.like]: '%' + data.name + '%' }
  }
  if (data.is_active) {
    where.is_active = ((data.is_active==true || data.is_active=='true') ) ? 1:0;
  }
  where.deletedAt = null;
  where.event_user_id = user_id; 
  const EventOrders = models.event_orders.findAndCountAll({
    distinct:true,
    limit: limit,
    where: where,
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
  return { 'EventOrders': EventOrders}
};


const getAllData = function (data) {
  let where = {}
  let limit = 10;
  let offset = 0;
  let order_query = []
	if(data.order_key && data.order_param){ 
		order_query.push(data.order_key)  
		order_query.push(data.order_param)
	}else{
		order_query = ['createdAt', 'DESC']
	}
  var page = 1;
  if (data.limit) {
    limit = parseInt(data.limit);
  }
  if(data.page_no){
    page = parseInt(data.page_no);
  }
  offset = limit * (page - 1);
  if (data.user_id) {
     where.user_id = data.user_id
  }
  if (data.transaction_id) {
    where.transaction_id = { [Op.like]: '%' + data.transaction_id + '%' }
  }
  if (data.start_date && data.end_date) {
    where.createdAt ={
      [Op.between]: [data.start_date+" 00:00:00.000 +00:00", data.end_date+" 23:59:00.000 +00:00"]
      }
  }
  if (data.status) {
		where.status = data.status
	}
  if (data.event_id) {
    where.event_id = data.event_id
  }
  if (data.currency_id) {
    where.currency_id = data.currency_id
  }
  where.deletedAt = null; 
  const EventOrders = models.event_orders.findAndCountAll({
    distinct:true,
    limit: limit,
    where: where,
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
  return { 'EventOrders': EventOrders}
};

const getMyTicketsData = function (data,  user_id) {
  let where = {}
  let limit = 10;
  let offset = 0;
  let order_query = []
  if(data.order_key && data.order_param){ 
    order_query.push(data.order_key)  
    order_query.push(data.order_param)
  }else{
    order_query = ['createdAt', 'DESC']
  }
  var page = 1;
  if (data.limit) {
    limit = parseInt(data.limit);
  }
  if(data.page_no){
    page = parseInt(data.page_no);
  }
  offset = limit * (page - 1);
  if (data.name) {
    where.name = { [Op.like]: '%' + data.name + '%' }
  }
  if (data.is_active) {
    where.is_active = ((data.is_active==true || data.is_active=='true') ) ? 1:0;
  }
  where.deletedAt = null; 
  where.user_id = user_id; 
  const EventOrders = models.event_orders.findAndCountAll({
    distinct:true,
    limit: limit,
    where: where,
    include: [
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
  return { 'EventOrders': EventOrders}
};

module.exports = {getAllData, getMyOrders, getMyTicketsData}