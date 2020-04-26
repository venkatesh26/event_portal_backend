const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
  if(data.page_no){
    page = data.page_no;
  }
  offset = limit * (page - 1);
  if (data.name) {
    where.name = { [Op.iLike]: '%' + data.name + '%' }
  }
  if (data.is_active) {
		where.is_active = data.is_active
	}
  where.deletedAt = null 
  const EventEnquiry = models.event_enquiries.findAndCountAll({
    distinct:true,
    include:[
      {
        model: models.events
      }
    ],
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'EventEnquiry': EventEnquiry}
};

const getById = id => models.event_enquiries.findById(id);

const deleteData = id => models.event_enquiries.destroy(
  {
    where: { id: id }
  });

module.exports = { getAllData, getById, deleteData };