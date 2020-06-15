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
    where.name = { [Op.like]: '%' + data.name + '%' }
  }
  if (data.email) {
    where.email = { [Op.like]: '%' + data.email + '%' }
  }
  if (data.contact_no ) {
    where.contact_no   = { [Op.like]: '%' + data.contact_no   + '%' }
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

const getById = function (data) {
   return models.event_enquiries.findOne({where:{id:data}});
}

const deleteData = id => models.event_enquiries.destroy(
  {
    where: { id: id }
  });

module.exports = { getAllData, getById, deleteData };