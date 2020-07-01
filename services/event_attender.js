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
  if (data.email) {
    where.email = { [Op.like]: '%' + data.email + '%' }
  }
  if (data.mobile_no ) {
    where.mobile_no   = { [Op.like]: '%' + data.mobile_no   + '%' }
  }
  if (data.event_id) {
    where.event_id = data.event_id
  }
  if (data.start_date && data.end_date) {
      where.createdAt ={
        [Op.between]: [data.start_date+" 00:00:00.000 +00:00", data.end_date+" 23:59:00.000 +00:00"]
      }
  }
  where.deletedAt = null 
  const EventAttenders = models.event_attenders.findAndCountAll({
    distinct:true,
    include:[
      {
        model: models.events,
        attributes:['name']
      }
    ],
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'EventAttenders': EventAttenders}
};

module.exports = { getAllData };