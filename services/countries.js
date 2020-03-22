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
	if(data.page_no > 0){
    limit = 10;
		let page = data.page_no;
		offset = limit * (page - 1);
  }
  if (data.name) {
    where.name = { [Op.iLike]: '%' + data.name + '%' }
  }
  if (data.is_active) {
		where.is_active = (data.is_active==true || data.is_active=='true') ? 1:0;
	}
  where.deletedAt = null;
  const Countries = models.countries.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 },
    
  });
  return { 'Countries': Countries}
};

const update = function (data) {
  return models.countries.update(
    {
      name: data.name,
      iso_code:data.description,
      is_active: data.is_active
    },
    { where: { id: data.id } })
}

const getById = id => models.countries.findById(id);

const add = data => models.countries.create(data, { returning: true });

const deleteData = function (id) {
  return models.countries.update(
    {
      deletedAt: Date()
    },
    { where: { id: id } })
}
module.exports = { add, getAllData, getById, deleteData, update};