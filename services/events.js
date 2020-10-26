const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getPopularEventList = function (data, user_id) {
  let where = {}
  let limit = 9;
  let order_query = ['createdAt', 'DESC']
  where.deletedAt = null; 
  where.status = 'published';
  where.event_visibility = 'public';
  where.is_popular = 1;
  const Events = models.events.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    $sort: { id: 1 }
  });
  return { 'Events': Events}
};


const getHomeEventList = function (data, user_id) {
  let where = {}
  let limit = 12;
  let order_query = [];
  order_query = ['createdAt', 'DESC'];
  where.deletedAt = null; 
  where.status = 'published';
  where.event_visibility = 'public';
  const Events = models.events.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    $sort: { id: 1 }
  });
  return { 'Events': Events}
};


const getmyEventList = function (data, user_id) {
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
  if (data.category_id) {
     where.category_id = data.category_id
  }
  if (data.start_date && data.end_date) {
    where.createdAt ={
      [Op.between]: [data.start_date+" 00:00:00.000 +00:00", data.end_date+" 23:59:00.000 +00:00"]
      }
  }
  if (data.is_active) {
      where.is_active = ((data.is_active==true || data.is_active=='true') ) ? 1:0;
  } 
  where.deletedAt = null; 
  where.user_id = user_id;
  const Events = models.events.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Events': Events}
};

const getSearchEventList = function (data) {
  let where = {}
  let limit = 12;
  let offset = 0;
  let order_query = []
  if(data.order_key && data.order_param){ 
    order_query.push(data.order_key)  
    order_query.push(data.order_param)
  }else{
    order_query = ['createdAt', 'DESC']
  }
  var page = 1;
  if(data.page_no){
    page = data.page_no;
  }
  offset = limit * (page - 1);
  if (data.name) {
    where.name = { [Op.like]: '%' + data.name + '%' }
  }
  if (data.category_id) {
     where.category_id = data.category_id;
  }
  if (data.city_id) {
     where.city_id = data.city_id;
  }
  if (data.start_date) {
      where.start_date = { [Op.gte]: data.start_date }
  }
  if (data.end_date) {
     where.end_date = { [Op.lte]: data.end_date }
  }
  if (data.is_online==true || data.is_online=='true') {
     where.type = 'online';
  }
  if (data.is_popular) {
     where.is_popular = 1;
  }
  if (data.keyword) {
      var q=data.keyword;
      where[Op.or] = [
      {'name':{ [Op.like]: '%' + q + '%' }},
      {'venue_name':{ [Op.like]: '%' + q + '%' }},
      {'category_name':{ [Op.like]: '%' + q + '%' }}
    ]
  }
  where.deletedAt = null; 
  where.status = 'published';
  where.event_visibility = 'public';
  const Events = models.events.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Events': Events}
};


const getAdminListData = function (data) {
  let where = {}
  let limit = 10;
  let offset = 0;
  let order_query = []
	if(data.order_key && data.order_paraom){ 
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
  if (data.category_id) {
     where.category_id = data.category_id
  }
  if (data.user_id) {
     where.user_id = data.user_id
  }
  if (data.start_date && data.end_date) {
    where.createdAt ={
      [Op.between]: [data.start_date+" 00:00:00.000 +00:00", data.end_date+" 23:59:00.000 +00:00"]
      }
  }
  if (data.event_start_date) {
      where.start_date = { [Op.gte]: data.event_start_date }
  }
  if (data.event_end_date) {
     where.end_date = { [Op.lte]: data.event_end_date }
  }
  if (data.user_id) {
     where.user_id = data.user_id
  }
  if (data.status) {
    where.status = data.status;
  }  
  if (data.type) {
    where.type = data.type; 
  }  
  where.deletedAt = null; 
  const Events = models.events.findAndCountAll({
    distinct:true,
    include: [
          {
              model: models.users,
              attributes: ['first_name','last_name', 'email']
          },
    ],
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Events': Events}
};

const deleteEvents = function (id) {
  return models.events.update(
    {
      deletedAt: Date()
    },
    { where: { id: id } })
}


const getSlugCount = function(slug, id=null) {

  var where ={}
  where.slug = slug;
  if(id){
    where.id =  { [Op.not]:id}
  }
  const data = models.events.count({
     where: where
  });
  return data.then(function(count){
    console.log(count);
      return count;
  });
}

const updateData = function (update_data, event_id) {
  return models.events.update(update_data,{ where: { id: event_id } })
}

module.exports = {getAdminListData, deleteEvents, getSlugCount, getSearchEventList, getmyEventList, getPopularEventList, getHomeEventList, updateData};