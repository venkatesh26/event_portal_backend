const authService = require('../services/auth');
const encrypt = require('../customFunctions').encrypt;
const models = require('../models');
module.exports = {
	async login(req, res) {
		if(typeof req.body.email=='undefined'){
			return res.send(encrypt({
					success: false,
					message: "email is required"
			}));
		}
		if(typeof req.body.password=='undefined'){
			return res.send(encrypt({
					success: false,
					message: "password is required"
			}));
		}
		return await authService.authenticate(req, res, req.body)
			.then(async token => { 
				res.send(encrypt({
					success: true,
					data: token
				}));
			})
			.catch(err => { 
				if (err.type === 'custom') {
					return res.send(encrypt({
						success: false,
						message: err.message
					}));
				}
				console.log(err)	
				return res.send(encrypt({
					success: false,
					message: err.message
				}));
			})
	},
	async logout (req, res) {
		if(typeof req.body.user_id=='undefined'){
			return res.send(encrypt({
					success: false,
					message: "user_id is required"
			}));
		}
		user_id= req.body.user_id;
		token= req.body.token;
		const  user  = models.users.update(  // to maintain logout time log
			{
				is_login: false
			},
			{ where: { id: user_id}
		});
		const  login_log  = models.user_logins.update(  // to maintain logout time log
			{
				out_time: Date()
			},
			{ where: { user_id: user_id, out_time:  null, token: token}
		 });
		login_log.then(() => res.send(encrypt({ "success": true, "message":"Logged out successfully..." })))
			.catch((error) => res.status(200).send(encrypt({ "success": false, "message": error })));
	}
}