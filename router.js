const authController = require('./controllers/auth_controller');
const userController = require('./controllers/users_controller');
const roleController = require('./controllers/roles_controller');
const contactsController = require('./controllers/contacts_controller');
const categoriesController = require('./controllers/categories_controller');
const countriesController = require('./controllers/countries_controller');
const statesController = require('./controllers/states_controller');
const citiesController = require('./controllers/cities_controller');


const jwt = require('jsonwebtoken');
const config = require('./config');
const decrypt = require('./customFunctions').decrypt;
const encrypt = require('./customFunctions').encrypt;
const Aes_key = require('./config').Aes_key;
const aes256 = require('aes256');

module.exports.set = (app) => {
	const unAuthrorizedUrl = [
		'/api/login', 
		'/api/logout', 
		'/api/forgot_password',
		'/api/reset_password',
		'/api/forgot_password_token_validate'
	]
	var fs = require('fs');
	app.use('*', function (req, res, next) {
		console.log(req.baseUrl);
		if (unAuthrorizedUrl.includes(req.baseUrl)) {
			next();
		}
		else {
			var token = req.body.authtoken || req.query.authtoken || req.headers['authtoken'] ||
				req.headers.authorization || req.headers['token'];
			if (!token)
				return res.status(403).send(encrypt({ auth: false, message: 'No token provided.' }));

			jwt.verify(token, config.jwtSecret, function (err, decoded) {
				if (err) {
					const encrypting = require('./customFunctions').encrypt;
					res.send(encrypting({
						err: true,
						msg: 'Failed to authenticate token.'
					}));
				} else {
					req.decoded = decoded;
					req.headers.role = aes256.decrypt(Aes_key, req.decoded.r_token)
					if (typeof req.decoded.super_admin_token!='undefined'){
						req.headers.super_admin_token = aes256.decrypt(Aes_key, req.decoded.super_admin_token)
					}
					if (typeof req.decoded.role_id!='undefined'){
						req.headers.role_id = aes256.decrypt(Aes_key, req.decoded.role_id)
					}
					if (typeof req.decoded.user_id!='undefined'){
						req.headers.user_id = aes256.decrypt(Aes_key, req.decoded.user_id)
					}
					if (typeof req.decoded.user_type!='undefined'){
						req.headers.user_type = aes256.decrypt(Aes_key, req.decoded.user_type)
					}
					if (typeof req.decoded.is_branch_connect!='undefined'){
						req.headers.is_branch_connect = aes256.decrypt(Aes_key, req.decoded.is_branch_connect)
					}
					next();
				}
			})
		}
	})

	app.post('/api/login', authController.login);
	app.post('/api/logout', authController.logout);

	app.post('/api/forgot_password', userController.forgot_password);
	app.post('/api/reset_password', userController.reset_password);
	app.post('/api/forgot_password_token_validate', userController.forgot_password_token_validate);

	// Users
	app.post('/api/users/add', userController.add);
	app.get('/api/users/:id', userController.view);
	app.get('/api/users', userController.index);
	app.get('/apoi/open_users', userController.index);
	app.put('/api/users', userController.update);  
	app.delete('api/users/:id', userController.delete);

    // Log in Logs
	app.get('/api/login_log', userController.getUsersLog);

	// Roles
	app.get('/api/roles', roleController.index);
	app.get('/api/roles_open', roleController.index);
	app.get('/api/roles/approve', roleController.approveRole);
	app.get('/api/roles/:id', roleController.view);
	app.post('/api/roles', roleController.add);
	app.delete('/api/roles/:id', roleController.delete);
	app.put('/api/roles', roleController.update);


	// Contacts
	app.get('/api/contacts', contactsController.index);
	app.get('/api//contacts/:id', contactsController.view);
	app.delete('/api/contacts/:id', contactsController.delete);


	// Countries
	app.get('/api/countries', countriesController.index);
	app.get('/api/countries_open', countriesController.index);
	app.get('/api/countries/:id', countriesController.view);
	app.post('/api/countries', countriesController.add);
	app.delete('/api/countries/:id', countriesController.delete);
	app.put('/api/countries', countriesController.update);  

	// States
	app.get('/api/states', statesController.index);
	app.get('/api/states_open', statesController.index);
	app.get('/api/states/:id', statesController.view);
	app.post('/api/states', statesController.add);
	app.delete('/api/states/:id', statesController.delete);
	app.put('/api/states', statesController.update); 

	// Cities
	app.get('/api/cities', citiesController.index);
	app.get('/api/cities_open', citiesController.index); 
	app.get('/api/cities/:id', citiesController.view);
	app.post('/api/cities', citiesController.add);
	app.delete('/api/cities/:id', citiesController.delete);
	app.put('/api/cities', citiesController.update);
}
