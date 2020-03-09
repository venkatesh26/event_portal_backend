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
    where.name = { [Op.like]: '%' + data.name + '%' }
  }
  if (data.is_active) {
		where.is_active = ((data.is_active==true || data.is_active=='true') ) ? 1:0;
	}
  where.deletedAt = { $eq: null }

  const Categories = models.categories.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Categories': Categories}
};

const updateCategory= function (data) {
  return models.categories.update(
    {
      name: data.name,
      slug:data.slug,
      is_active: data.is_active
    },
    { where: { id: data.id } })
}

const getCategoryById = id => models.categories.findById(id);

const addCategory = category_data => models.categories.create(category_data, { returning: true });

const deleteCategory = function (id) {
  return models.categories.update(
    {
      deletedAt: Date()
    },
    { where: { id: id } })
}
module.exports = { addCategory, getAllData, getCategoryById, deleteCategory, updateCategory };