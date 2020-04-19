const authController = require(__basedir +'/controllers/auth_controller');
const userController = require(__basedir +'/controllers/users_controller');
const roleController = require(__basedir +'/controllers/roles_controller');
const contactsController = require(__basedir +'/controllers/contacts_controller');
const categoriesController = require(__basedir +'/controllers/categories_controller');
const countriesController = require(__basedir +'/controllers/countries_controller');
const statesController = require(__basedir +'/controllers/states_controller');
const citiesController = require(__basedir +'/controllers/cities_controller');
const currenciesController = require(__basedir +'/controllers/currencies_controller');
const eventsController = require(__basedir +'/controllers/events_controller');
const uploadController = require(__basedir +'/controllers/upload_controller');

const jwt = require('jsonwebtoken');
const decrypt = require('../customFunctions').decrypt;
const encrypt = require('../customFunctions').encrypt;
const Aes_key = CONFIG.Aes_key;
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

			jwt.verify(token, CONFIG.jwtSecret, function (err, decoded) {
				if (err) {
					const encrypting = require('../customFunctions').encrypt;
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
	
      
	const fileUpload = require('express-fileupload');
	app.use(fileUpload());

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
	app.post('/api/users', userController.add);  
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

	// Categories
	app.get('/api/categories', categoriesController.index);
	app.get('/api/categories_open', categoriesController.index); 
	app.get('/api/categories/:id', categoriesController.view);
	app.post('/api/categories', categoriesController.add);
	app.delete('/api/categories/:id', categoriesController.delete);
	app.put('/api/categories', categoriesController.update);

	// Currency	
	app.get('/api/currencies', currenciesController.index);
	app.get('/api/currencies_open', currenciesController.index);
	app.delete('/api/currencies/:id', categoriesController.delete);

	// Events	
	app.get('/api/events', eventsController.index);
	app.get('/api/events_open', eventsController.index);
	app.get('/api/events/:id', eventsController.view);
	app.post('/api/events', eventsController.add);
	app.delete('/api/events/:id', eventsController.delete);
	app.put('/api/events', eventsController.update);


	// Upload 
	app.post('/api/upload', uploadController.upload);
}
