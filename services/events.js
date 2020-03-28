const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getAllData = function (data) {
  let where = {}
  let limit = 100;
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
    distinct:true,
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Events': Events}
};

const updateEvents = function (data) {
  return models.events.update(
    {
      name: data.name,
      slug:data.slug,
      is_active: data.is_active
    },
    { where: { id: data.id } })
}

const getEventsById = id => models.events.findById(id);

const addEvents = events_data => models.events.create(events_data, { returning: true });

const deleteEvents = function (id) {
  return models.events.update(
    {
      deletedAt: Date()
    },
    { where: { id: id } })
}
module.exports = { addEvents, getAllData, getEventsById, deleteEvents, updateEvents };