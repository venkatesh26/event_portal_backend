const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const addUser = user => models.users.create(user);
const customerRegister = user => models.users.create(user);
const getUserByLogin = user_name => models.users.findOne({ where: { user_name } });
const getUserByEmail = email => models.users.findOne({ where: { email } });

const getUser = function (data) {
	return models.users.findOne({
		where: { id: data.id },
		include: [{
			model: models.role,
			attributes: ['role']
		}], 
		attributes: ['id', 'first_name', 'last_name','gender','dob','email','area_code','mobile_no','address_1','address_2','city','state','pincode','country', 'role_id', 'user_name', 'is_active', 'is_admin', 'joining_date','user_type','is_branch_connect']
	});
};

const getUsers = function (data) {
	let where = {}
	let limit = 10; 
	let offset = 0;
	let order_query = []
	if(data.order_key && data.order_param){
		order_query.push(data.order_key) 
		if(data.order_key == 'role' || data.order_key == 'department'){
			order_query.push(data.order_key)
		} 
		order_query.push(data.order_param)
	}else{
		order_query = ['id', 'DESC']
	}
	if (data.limit) {
		limit = data.limit;
	}
	var page = 1;
	if(data.page_no){
		page = data.page_no;
	}
	offset = limit * (page - 1);
	if (data.first_name) {
		where.first_name = { [Op.like]: '%' + data.first_name + '%' }
	}
	if (data.login) {
		where.login = { [Op.like]: '%' + data.login + '%' }
	}
	if (data.role_id) {
		where.role_id = data.role_id
	}
	if (data.email) {
		where.email = { [Op.like]: '%' + data.email + '%' }
	}
	if (data.mobile_no) {
		where.mobile_no = { [Op.like]: '%' + data.mobile_no + '%' }
	}
	if (data.is_active==true || data.is_active=='true') {
		where.is_active = 1
	}
	if (data.is_active==false || data.is_active=='false') {
		where.is_active = 0
	}
	where.deletedAt = null
	const User = models.users.findAndCountAll({
		where: where,
		distinct:true,
		include: [{
			model: models.role,
			attributes: ['name'],
			as : 'role'
		}
	],
		limit: parseInt(limit),
		order: [order_query],
		offset: parseInt(offset),
		$sort: { id: 1 }
	});
	return ({ "User": User })
};

const updateUser = function (data) {
	const update_data = {
		first_name: data.first_name,
		last_name: data.last_name,
		gender: data.gender,
		dob: data.dob,
		email: data.email,
		area_code: data.area_code,
		mobile_no: data.mobile_no,
		address_1: data.address_1,
		address_2: data.address_2,
		role_id: data.role_id,
		is_active: data.is_active,
		city: data.city,
		state: data.state,
		pincode: data.pincode,
		country: data.country,
		is_admin: data.is_admin,
		joining_date:data.joining_date,
		user_type:data.user_type,
		is_branch_connect: data.is_branch_connect
	}
	if(data.login){
		update_data.login = data.login
	}
	if(data.password){
		update_data.password = data.password
	}
	return models.users.update(update_data,{ where: { id: data.id } })
}

const deleteUser = function (data) {
	return models.users.update(
		{
			deletedAt: Date()
		},
		{ where: { id: data.id } })
}


const approveUser = function (data) {
	const update_data = {
		is_active: data.is_active
	}
	return models.users.update(update_data,{ where: { id: data.id } })
}


const getUsersLog = function (data) {

	let where = {};
	let user_where={};
	let limit = 10; 
	let offset = 0;
	let order_query = []
	if(data.order_key && data.order_param){
		order_query.push(data.order_key) 
		order_query.push(data.order_param)
	}else{
		order_query = ['id', 'DESC']
	}
	if (data.limit) {
		limit = data.limit;
	}
	var page = 1;
	if(data.page_no){
		page = data.page_no;
	}
	offset = limit * (page - 1);

	if (data.user_id) {
		where.user_id = data.user_id
	}
	if (data.startDate && data.endDate) {
		where.createdAt ={
			[Op.between]: [data.startDate+" 00:00:00.000 +00:00", data.endDate+" 23:59:00.000 +00:00"]
		  }
	}
	if(data.user_name){
		user_where.user_name = { [Op.like]: '%' + data.user_name + '%' }
	}
	if(data.first_name){
		user_where.first_name = { [Op.like]: '%' + data.first_name + '%' }
	}
	if(data.last_name){
		user_where.last_name = { [Op.like]: '%' + data.last_name + '%' }
	}
	const Login_log = models.user_logins.findAndCountAll({
		where: where,
		include: [{
			model: models.users,
			attributes: ['first_name','last_name','user_name'],
			as: 'user',
			where :user_where
		}],
		limit: 10,
		order: [order_query],
		attributes: ['user_id','in_time','out_time'],
		offset: offset,
		$sort: { id: 1 }
	});
	return ({ "Login_log": Login_log })
};

const getUserDetails = async function (where) {
	return  await models.users.findOne({
		where: where,
		attributes: ['id', 'first_name', 'last_name','gender','dob',
		'email','area_code','mobile_no','address_1','address_2',
		'city','state','pincode','country', 'role_id', 'is_active', 'is_admin', 'forgot_pass_exp_timestamp', 
		'forgot_pass_token']
	});
};

const updateUserData = function (update_data, user_id) {
	return models.users.update(update_data,{ where: { id: user_id } })
}

module.exports = {
	addUser,
	getUserByLogin,
	getUsers,
	updateUser,
	getUser,
	deleteUser,
	getUsersLog,
	getUserDetails,
	updateUserData,
	approveUser,
	getUserByEmail,
	customerRegister
}
