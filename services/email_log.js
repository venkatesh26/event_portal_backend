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
  if (data.email) {
    where.email = { [Op.like]: '%' + data.email + '%' }
  }
  if (data.template_name) {
    where.template_name = { [Op.like]: '%' + data.template_name + '%' }
  }
  if (data.subject) {
    where.subject = { [Op.like]: '%' + data.subject + '%' }
  }
  if (data.startDate && data.endDate) {
    where.createdAt ={
      [Op.between]: [data.startDate+" 00:00:00.000 +00:00", data.endDate+" 23:59:00.000 +00:00"]
      }
  }
  where.deletedAt = null; 
  const EmailLogs = models.email_log.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'EmailLogs': EmailLogs}
};

module.exports = {getAllData};