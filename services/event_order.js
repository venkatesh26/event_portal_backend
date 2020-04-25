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
  if (data.is_active) {
		where.is_active = ((data.is_active==true || data.is_active=='true') ) ? 1:0;
	}
  where.deletedAt = null; 
  const EventOrders = models.event_orders.findAndCountAll({
        distinct:true,
    limit: limit,
    where: where,
    include: [
        {
            model: models.event_order_items
        },
        {
            model: models.users
        }
    ],
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'EventOrders': EventOrders}
};
module.exports = {getAllData};