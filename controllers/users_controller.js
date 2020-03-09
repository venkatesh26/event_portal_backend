const userService = require('../services/user');
const models = require('../models');
const bcrypt = require('bcrypt');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
const base64 = require('base-64');
const aes256 = require('aes256');
const dateTime = require('node-datetime');
let converter = require('json-2-csv');
module.exports = {
	index(req, res) {
		const { User } = userService.getUsers(req.query)
		User.then(async function(data){
		   if(req.query.is_download == 'true' || req.query.is_download == true){
			var excel_data = [];			
			await Promise.all(
				data.rows.map(async (my_data,i) => {					
				  var obj={}
				  obj['first_name']=my_data['first_name'];
				  obj['user_name']=my_data['user_name'];
				  obj['user_type']=(my_data['user_type']!=null) ? my_data['user_type']:'';
				  obj['role']=my_data['role']['name'];
				  obj['email']=my_data['email'];
				  obj['is_active']=(my_data['is_active']==true) ? 'Approved':'Pending',
				  obj['is_branch_connect']=(my_data['is_branch_connect']==true) ? 'Yes':'No'				  
				  excel_data.push(obj);
			  })
			);
			var new_file_header=[
				{'column_name':'first_name', displayName:'First Name'},
				{'column_name':'user_name', displayName:'User Name'},
				{'column_name':'user_type', displayName:'User Type'},
				{'column_name':'role', displayName:'Role'},
				{'column_name':'email', displayName:'Email'},
				{'column_name':'department', displayName:'Department'},
				{'column_name':'is_active', displayName:'Status'},
				{'column_name':'is_branch_connect', displayName:'Branch Connect User'}                    
			]
			var reports = downloadExcel.downloadExcelSheet(new_file_header, excel_data)
			var file_name = "user-list.xlsx"
			var file_dir = "assets/"
			writeFileSync(file_dir+file_name, reports);
			var base64_data='';
			var fs = require('fs');
			var bitmap = fs.readFileSync(file_dir+file_name);
			base64_data = new Buffer.from(bitmap).toString('base64');
			fs.unlinkSync(file_dir+file_name)  //Delete the file
			return res.send(encrypt({ "success": true, "base64_data": base64_data, 'file_name':file_name}))
			}
		   else{
		   	console.log(data.rows)
			res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
		   }
		})		
		.catch(function(error){

        console.log(error);

        res.send(encrypt({ "success": false, "message": error }))

      })
	},
	add(req, res) {
		return userService.getUserByLogin(req.body.login || '')
			.then(exists => {
				if (exists) {
					return res.send(encrypt({
						success: false,
						message: 'Registration failed. User with this User name already registered.'
					}));
				}
				var user = {
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					user_name: req.body.user_name,
					password: bcrypt.hashSync(req.body.password, CONFIG.saltRounds),
					gender: req.body.gender,
					dob: req.body.dob,
					email: req.body.email,
					pan: req.body.pan,
					area_code: req.body.area_code,
					mobile_no: req.body.mobile_no,
					role_id: req.body.role_id,
					branch_id: req.body.branch_id,
					is_active: req.body.is_active
				}

				return userService.addUser(user)
				.then(() => res.send(encrypt({ success: true,message:"User added succesfully..." })))
				.catch(err => {
					return res.send(encrypt({
						success: false,
						message: err.message
					}));
				});
			});
	},
	update(req, res) {
		const req_data = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			gender: req.body.gender,
			dob: req.body.dob,
			email: req.body.email,
			pan: req.body.pan,
			area_code: req.body.area_code,
			mobile_no: req.body.mobile_no,
			address_1: req.body.address_1,
			address_2: req.body.address_2,
			role_id: req.body.role_id,
			is_active: req.body.is_active,
			id: req.body.id,
			is_admin: req.body.is_admin
		}
		if (req.body.user_name) {
			req_data.user_name = req.body.user_name
		}
		if (req.body.password) {
			req_data.password = bcrypt.hashSync(req.body.password, CONFIG.saltRounds)
		}
		userService.updateUser(req_data)
			.then(
				data => res.send(encrypt({ "success": true, "message": "Updated successfully." })))
			.catch(
				(err) => res.status(200).send(encrypt({ "success": false, "message": err.message })));
	},
	view(req, res) {
		userService.getUser({
			id: decrypt(decode_id(req.params.id))
		})
		.then(
			data => res.send(encrypt({ "success": true, "data": data })))
		.catch(
			(error) => res.status(400).send(encrypt({ "success": false, "message": error })));
	},
	delete(req, res) {
		userService.deleteUser({
			id: decrypt(decode_id(req.params.id))
		}).then(
		data => res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
		.catch(
		(error) => res.status(400).send(encrypt({ "success": false, "message": error })));
	},
	getUsersLog(req, res) {
		const { Login_log } = userService.getUsersLog(req.query)
		Login_log.then(
			data => res.send(encrypt({ "success": true, "data": data.rows, "count": data.count })))
			.catch(
				(error) => res.status(400).send(encrypt({ "success": false, "message": error })));
	},
	async forgot_password(req, res) {
	 	if (typeof req.body.email=='undefined'){
	       return res.send(encrypt({ "success": false, "message": "email field is required"}))
	    }
	    if (req.body.email==''){
	       return res.send(encrypt({ "success": false, "message": "email field is required"}))
	    }
	    var where =[{'email':req.body.email}]
		const user_data = userService.getUserDetails(where)
		user_data.then(function(data){	
			if (data!=null){
				var user_data = data.dataValues
				var dt = dateTime.create();
				var forgot_pass_date = dt.format('Y-m-d H:M:S');
				var expiry_hours = CONFIG.reset_password_link_expiry_hours
	 			dt.offsetInHours(expiry_hours);
				var forgot_pass_exp_date = dt.now();
				var forgot_pass_token = aes256.encrypt(CONFIG.Aes_key, user_data.id.toString())
				forgot_pass_token = base64.encode(forgot_pass_token);

				console.log(forgot_pass_exp_date);
				var update_data ={
					'forgot_pass_token':forgot_pass_token,
					'forgot_pass_date':forgot_pass_date,
					'forgot_pass_exp_timestamp':forgot_pass_exp_date
				}
				userService.updateUserData(update_data, user_data.id)
				var password_reset_link=CONFIG.reset_password_link+"?token="+forgot_pass_token	
				var data = {
					'customer_name':user_data.first_name,
					'password_reset_link':password_reset_link,
					'forgot_password_link':CONFIG.forgot_password_link,
					'expiry_hours':expiry_hours
				}
	            mailer.send_mail(user_data.email, "UP Event - Password Reset Link", data, 'forgot_password')
				res.send(encrypt({ "success": true, "message": "Please check you mail to Reset your Password"}))
			}
			else{
				res.send(encrypt({ "success": false, "message": "Invalid Email ID"}))
			}
		}).catch(function(error){
			console.log(error)
			res.send(encrypt({ "success": false, "message": "Invalid Email ID" }))
		});
	},
	async forgot_password_token_validate(req, res){
		if (typeof req.body.token=='undefined'){
			return res.send(encrypt({ "success": false, "message": "token field is required"}))
		}
		if (typeof req.body.token==''){
			return res.send(encrypt({ "success": false, "message": "token field is required"}))
		}
		var dt = dateTime.create();
		var where={
			forgot_pass_token: req.body.token
		}
		const user_data  = userService.getUserDetails(where)		
		user_data.then(function(data){	
			if (data==null){
				res.send(encrypt({ "success": false, "message": "Invalid Token" }))
			}
			else {
               if(data.forgot_pass_exp_timestamp=='' || data.forgot_pass_exp_timestamp==null){
					res.send(encrypt({ "success": true, "message": "Token Expired" }))
               }
               else if(dt.now() >= data.forgot_pass_exp_timestamp){
					res.send(encrypt({ "success": true, "message": "Token Expired" }))
               }
               else{
               	    res.send(encrypt({ "success": true, "message": "Token Validated Successfully" }))
               }
			
			}
		}).catch(function(error){
			console.log(error)
			res.send(encrypt({ "success": false, "message": "Invalid1Token" }))
		});
	},
	async reset_password(req, res){
		if (typeof req.body.token=='undefined'){
			return res.send(encrypt({ "success": false, "message": "token field is required"}))
		}
		if (typeof req.body.token==''){
			return res.send(encrypt({ "success": false, "message": "token field is required"}))
		}
		if (typeof req.body.password=='undefined'){
			return res.send(encrypt({ "success": false, "message": "password field is required"}))
		}
		if (req.body.password==''){
			return res.send(encrypt({ "success": false, "message": "password field is required"}))
		}
		if (typeof req.body.confirm_password=='undefined'){
			return res.send(encrypt({ "success": false, "message": "confirm_password field is required"}))
		}
		if (req.body.confirm_password==''){
			return res.send(encrypt({ "success": false, "message": "confirm_password field is required"}))
		}
		if (req.body.password!=req.body.confirm_password){
			return res.send(encrypt({ "success": false, "message": "password and confirm_password field mismatched"}))
		}
		var dt = dateTime.create();
		var where={
			forgot_pass_token: req.body.token
		}
		const user_data  = userService.getUserDetails(where)
		user_data.then(function(data){	
			if (data!=null){
				if(data.forgot_pass_exp_timestamp=='' || data.forgot_pass_exp_timestamp==null){
					res.send(encrypt({ "success": true, "message": "Token Expired" }))
				}
				else if(dt.now() >= data.forgot_pass_exp_timestamp){
					res.send(encrypt({ "success": true, "message": "Token1 Expired" }))
				}
				else{
					var user_data = data.dataValues
					var update_data ={
						'forgot_pass_token':null,
						'forgot_pass_date':null,
						'forgot_pass_exp_timestamp':null,
						'password':bcrypt.hashSync(req.body.password, CONFIG.saltRounds)
					}
					userService.updateUserData(update_data, user_data.id)
					res.send(encrypt({ "success": true, "message": "Password Updated Successfully" }))
				}
			}
			else{
				res.send(encrypt({ "success": false, "message": "Invalid Token" }))
			}
		}).catch(function(error){
			res.send(encrypt({ "success": false, "message": "Invalid Token" }))
		});
	},
	async FileTobase64(req, res){
		try{
			var filename = req.query.file_name
			var file_dir = req.query.file_dir
			base64_data = await customFunctions.FileToBase64Conversion(file_dir, filename);
			res.send(encrypt({ "success": true, "base64_data": base64_data}));
		}catch(error){
			console.log(error)
			res.send(encrypt({ "success": false, "message":error}));
		}
	}
}