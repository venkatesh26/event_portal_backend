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
	if (data.limit) {
    limit = parseInt(data.limit);
  }
  var page = 1;
  if(data.page_no){
    page = parseInt(data.page_no);
  }
  offset = limit * (page - 1);
  if (data.name) {
    where.name = { [Op.like]: '%' + data.name + '%' }
  }
  if (data.is_active) {
		where.is_active = (data.is_active==true || data.is_active=='true') ? 1:0;
	}
  if (data.country_id) {
    where.country_id = data.country_id;
  }
  if (data.state_id) {
    where.state_id = data.state_id;
  }
  where.deletedAt =  null;  
  const Cities = models.cities.findAndCountAll({
    distinct:true,
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    include : [{
      model: models.states
    },
    {
      model: models.countries
    }
    ],
    $sort: { id: 1 }
  });
  return { 'Cities': Cities}
};

const update = function (data) {
  return models.cities.update(
    {
      name: data.name,
      slug: data.slug,
      country_id:data.country_id,
      state_id:data.state_id,
      is_active: data.is_active
    },
    { where: { id: data.id } })
}

const getById = id => models.cities.findById(id);

const add = data => models.cities.create(data, { returning: true });

const deleteData = function (id) {
  return models.cities.update(
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
  const data = models.cities.count({
     where: where
  });
  return data.then(function(count){
      if(count > 1){
        return true;
      }
      return false;
  });
}


const findOrSaveAndGetId = async function(name, state_id, country_id) {
  var where ={}
  where.name = name;
  const data = models.cities.findOne({
      where: where,
      limit: 1
  });
  return data.then(async function(data){
      if(data){
        return data.id; 
      }
      var slug = sluggable_behavior((name).toString().toLowerCase());
      var country_data = {
        state_id:state_id,
        country_id:country_id,
        name:name,
        slug:slug,
        is_active:1
      }
      var country = await models.cities.create(country_data, { returning: true });
      return country.id;
  });
}

module.exports = { add, getAllData, getById, deleteData, update, isExistOrNot, findOrSaveAndGetId};