const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getPopularEventList = function (data, user_id) {
  let where = {}
  let limit = 3;
  let order_query = ['createdAt', 'DESC']
  where.deletedAt = null; 
  where.status = 'published';
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
  if(data.page_no){
    page = data.page_no;
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
  if (data.start_date && data.end_date) {
    where.createdAt ={
      [Op.between]: [data.start_date+" 00:00:00.000 +00:00", data.end_date+" 23:59:00.000 +00:00"]
      }
  }
  where.deletedAt = null; 
  where.status = 'published';
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
  if (data.is_active) {
		where.is_active = ((data.is_active==true || data.is_active=='true') ) ? 1:0;
	}
  where.deletedAt = null; 
  const Events = models.events.findAndCountAll({
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

module.exports = {getAdminListData, deleteEvents, getSlugCount, getSearchEventList, getmyEventList, getPopularEventList, getHomeEventList};