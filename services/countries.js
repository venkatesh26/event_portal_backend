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
      iso_code:data.iso_code,
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

const isExistOrNot = function(name, id=null) {

  var where ={}
  where.name = name;
  if(id){
    where.id =  { [Op.not]:id}
  }
  const data = models.countries.count({
     where: where
  });
  return data.then(function(count){
      if(count > 1){
        return true;
      }
      return false;
  });
}

const findOrSaveAndGetId = async function(name) {
  var where ={}
  where.name = name;
  const data = models.countries.findOne({
      where: where,
      limit: 1
  });
  return data.then(async function(data){
      if(data){
        return data.id; 
      }
      var slug = sluggable_behavior((name).toString().toLowerCase());
      var country_data = {
        name:name,
        slug:slug
      }
      var country = await models.countries.create(country_data, { returning: true });
      return country.id;
  });
}

module.exports = { add, getAllData, getById, deleteData, update, isExistOrNot, findOrSaveAndGetId};