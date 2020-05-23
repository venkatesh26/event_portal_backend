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
  const Pages = models.pages.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Pages': Pages}
};

const updatePage = function (data) {

  return models.pages.update(
    {
      name: data.name,
      slug:data.slug,
      content:data.content,
      meta_title:data.meta_title,
      meta_description :data.meta_description  ,
      meta_keywords:data.meta_keywords,
      is_active: data.is_active
    },
    { where: { id: data.id } })
}


const getPageById = function (id) {
return models.pages.findOne({
		where: { id:id },
	
	});
}

const addPage = page_data => models.pages.create(page_data, { returning: true });

const deletePage = function (id) {
  return models.pages.update(
    {
      deletedAt: Date()
    },
    { where: { id: id } })
}

const isExistOrNot = function(name, id=null) {

  var where ={}
  where.name = name;
  if(id){
    where.id =  { [Op.not]:id}
  }
  const data = models.pages.count({
     where: where
  });
  return data.then(function(count){
    console.log(count);
      if(count > 1){
        return true;
      }
      return false;
  });
}

module.exports = { addPage, getAllData, getPageById, deletePage, updatePage , isExistOrNot};
