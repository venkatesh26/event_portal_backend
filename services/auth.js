const models = require('../models');
const CustomError = require('../customError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const aes256 = require('aes256');
var key = CONFIG.Aes_key;
const decrypt = require('../customFunctions').decrypt;
var dateTime = require('node-datetime');

async function authenticate(req, res, params){
	return models.users.findOne({
		where: {
			email: params.email,
			deletedAt: null,
			is_active: true
		}, include: [{
			model: models.role,
			attributes: ['name','is_admin', 'is_super_admin'],
			as: 'role'
		}]
	}).then(async user => {
		if (!user)
			throw new CustomError('Authentication failed. User not found.');

		if (!bcrypt.compareSync(params.password || '', user.password))
			throw new CustomError('Authentication failed. Wrong password.');

		if(CONFIG.disable_multiple_login==true && user.is_login==true){
			throw new CustomError('Your previously signed account terminated incorrectly.Please try after some time.');
		}
		var is_branch_connect=false;
		var user_type_data=undefined;
		const payload = {
			id: bcrypt.hashSync(aes256.encrypt(key, user.id.toString()), CONFIG.saltRounds),
			time: bcrypt.hashSync(aes256.encrypt(key, new Date().toString()), CONFIG.saltRounds),
			r_token: aes256.encrypt(key, user.role.name),
			super_admin_token: aes256.encrypt(key, (user.role.is_super_admin).toString()),
			role_id: aes256.encrypt(key, (user.role_id).toString()),
			user_id: aes256.encrypt(key, (user.id).toString())
		};
		var token = jwt.sign(payload, CONFIG.jwtSecret, {
			expiresIn: CONFIG.tokenExpireTimeInHours+"h"
		});
		var dt = dateTime.create();
		var current_login_time = dt.format('d-n-Y I:M:S p');
		var token_expiry_hours = CONFIG.tokenExpireTimeInHours;
		const  user_data_update  = models.users.update(  // to maintain logout time log
			{
				is_login: true,
				last_login:dt.format('Y-m-d H:M:S'),
				token_expiry_hours:token_expiry_hours
			},
			{ where: { id: user.id}
		 });


		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		ua = req.headers['user-agent'];
		if( /firefox/i.test(ua) )
			browser = 'firefox';
		else if( /chrome/i.test(ua) )
			browser = 'chrome';
		else if( /safari/i.test(ua) )
			browser = 'safari';
		else if( /msie/i.test(ua) )
			browser = 'msie';
		else
			browser = 'unknown';

		async function log_check() {
			return models.user_logins.findOne({
				where: {
					user_id: user.id,	
				},
				raw: true,
				plain: true,
				limit:1,
				order: [
					['in_time', 'DESC'], 
			  ]
			}).then(async data => {
				models.user_logins.create({ 
					user_id: user.id,
					token: token ,
					ip_address: ip,
					broswer_info: browser,
					mac_address: '12:909:90:90'
				});						
				return data.in_time
			}).catch(() => {
				models.user_logins.create({ 
					user_id: user.id,
					token: token ,
					ip_address: ip,
					broswer_info: browser,
					mac_address: '12:909:90:90'
				});	
				return current_login_time
			})
		}

		var last_login_time_data = await log_check();
		var last_login_time = dateTime.create(last_login_time_data).format('d-n-Y I:M:S p');
		var data = {
			id: user.id,
			first_name: user.first_name,
			login: user.login,
			role_id: user.role_id,
			role: user.role.role,
			token: token,
			is_admin:user.role.is_admin,
			is_super_admin:user.role.is_super_admin,
			last_login_time : last_login_time,
			current_login_time : current_login_time,
			user_name:user.login
		}
		return data;
	});
}

module.exports = {
	authenticate
}