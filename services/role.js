const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getRoleAll = function (data) {
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
    limit = data.limit;
  }
  var page = 1;
  if(data.page_no){
    page = data.page_no;
  }
  offset = limit * (page - 1);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  if (data.name) {
    where.name = { [Op.iLike]: '%' + data.name + '%' }
  }
  if (data.is_active) {
		where.is_active = (data.is_active==true || data.is_active=='true') ? 1:0;
	}
  where.deletedAt = null
  const Roles = models.role.findAndCountAll({
    limit: limit,
    where: where,
    distinct:true,
    include : [{
      model: models.users,
      attributes:['id']
    }],
    order: [order_query],
    offset: offset,
    $sort: { id: 1 },
  });
  return { 'Roles': Roles}
};

const updateRole = function (data) {
  return models.role.update(
    {
      name: data.name,
      description:data.description,
      is_active: data.is_active,
      is_admin:data.is_admin
    },
    { where: { id: data.id } })
}

const getRoleById = id => models.role.findById(id);

const addRole = Role_data => models.role.bulkCreate(Role_data, { returning: true });

const deleterole = function (id) {
  return models.role.update(
    {
      deletedAt: Date()
    },
    { where: { id: id } })
}
const approveRole = function (data) {
  const update_data = {
    is_active: data.is_active
  }
  return models.role.update(update_data,{ where: { id: data.id } })
}
module.exports = { addRole, getRoleAll, getRoleById, deleterole, updateRole, approveRole };