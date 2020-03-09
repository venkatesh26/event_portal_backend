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
	if(data.page_no != 0){
    limit = 10;
		let page = data.page_no;
		offset = limit * (page - 1);
  }
  if(data.page_no == 0){
		limit = 100;
		let page = 1;  
		offset = limit * (page - 1);
	}
  if (data.name) {
    where.name = { [Op.iLike]: '%' + data.name + '%' }
  }
  if (data.is_active) {
		where.is_active = data.is_active
	}
  where.deletedAt = { $eq: null }

  const Contacts = models.contacts.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Contacts': Contacts}
};


const getContactById = id => models.contacts.findById(id);

const deleteCategory = id => models.contacts.destroy(
  {
    where: { id: id }
  });
module.exports = { getAllData, getContactById, deleteCategory };