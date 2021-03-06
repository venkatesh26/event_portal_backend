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
const orderController = require(__basedir +'/controllers/order_controller');
const eventEnquiryController = require(__basedir +'/controllers/event_enquiry_controller');
const pagesController = require(__basedir +'/controllers/pages_controller');
const emailLogController = require(__basedir +'/controllers/email_log_controller');
const reportController = require(__basedir +'/controllers/report_controller');
const attendersController = require(__basedir +'/controllers/event_attenders_controller');
const blogsController = require(__basedir +'/controllers/blogs_controller');
const blogCommentsController = require(__basedir +'/controllers/blog_comments_controller');
const cronController = require(__basedir +'/controllers/cron_controller');

const jwt = require('jsonwebtoken');
const decrypt = require('../customFunctions').decrypt;
const encrypt = require('../customFunctions').encrypt;
const Aes_key = CONFIG.Aes_key;
const aes256 = require('aes256');

module.exports.set = (app) => {
	const unAuthrorizedUrl = [
		'/api/customer/register',
		'/api/login', 
		'/api/logout', 
		'/api/forgot_password',
		'/api/reset_password',
		'/api/forgot_password_token_validate',
		'/api/popular_events',
		'/api/home_events',
		'/api/search_events',
		'/api/home_categories',
		'/api/event_details',
		'/api/ticket_detail',
		'/api/place_order',
		'/api/add_enquiry',
		'/api/payment_intents',
		'/api/email_verification',
		'/api/customer_login',
		'/api/customer_logout',
		'/api/page_details',
		'/api/user_auto_complete',
		'/api/city_auto_complete',
		'/api/event_auto_complete',
		'/api/social_media',
		'/api/frontend_blogs',
		'/api/frontend_blog_detail',
		'/api/add_comments',
		'/cron/event_exipry',
		'/cron/ticket_reset',
		'/api/add_contacts'
	]
	var fs = require('fs');
	app.use('*', function (req, res, next) {
		
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

	app.post('/api/customer_login', authController.customer_login);
	app.post('/api/customer_logout', authController.customer_logout);

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
	app.get('/api/user_auto_complete', userController.auto_complete);
	app.post('/api/social_media', userController.social_media_register_or_login);

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
	app.get('/api/contacts/:id', contactsController.view);
	app.delete('/api/contacts/:id', contactsController.delete);
	app.post('/api/add_contacts', contactsController.add);

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

	app.get('/api/city_auto_complete', citiesController.auto_complete);	

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
	app.post('/api/update_event_status', eventsController.update_status);
	app.get('/api/event_auto_complete', eventsController.auto_complete);
	

	app.get('/api/email_logs', emailLogController.index);

	// Pages
	app.get('/api/pages', pagesController.index);
	app.get('/api/pages/:id', pagesController.view);
	app.post('/api/pages', pagesController.add);
	app.delete('/api/pages/:id', pagesController.delete);
	app.put('/api/pages', pagesController.update);

	// Upload 
	app.post('/api/upload', uploadController.upload);

	app.get('/api/orders', orderController.index);
	app.get('/api/orders/:id', orderController.view);

	// Event Enquiry
	app.get('/api/event_enquiry', eventEnquiryController.index);
	app.delete('/api/event_enquiry/:id', eventEnquiryController.delete);
	app.get('/api/event_enquiry/:id',eventEnquiryController.view);

	// Front End Router

	// Unauthorize Router
	app.post('/api/customer/register', userController.register);
	app.get('/api/popular_events', eventsController.popular_event_list);
	app.get('/api/home_events', eventsController.home_event_list);
	app.get('/api/search_events', eventsController.search_event_list);
	app.get('/api/event_details', eventsController.event_detail);
	app.get('/api/ticket_details', eventsController.ticket_detail);
	app.get('/api/home_categories', categoriesController.home_categories);
	app.post('/api/place_order', orderController.place_order);
	app.post('/api/payment_intents', orderController.payment_intents);

	app.get('/api/payment_intents', orderController.payment_intents);


	app.post('/api/add_enquiry', eventEnquiryController.add_enquiry);
    app.post('/api/email_verification', userController.account_verification);
    app.post('/api/download_invoice', orderController.download_invoice);
	app.post('/api/my_events', eventsController.add_my_event);
	app.put('/api/my_events', eventsController.update_my_event);

    app.post('/api/page_details', pagesController.get_page_details);
	app.put('/api/customer', userController.update);  

	app.put('/api/avatar_update', userController.avatar_update);  
    app.post('/api/change_password', userController.change_password);  
	app.get('/api/my_events/:user_id', eventsController.my_event_list);
	app.get('/api/my_event_details/:user_id/:id', eventsController.my_event_detail);
	app.get('/api/my_orders/:user_id', orderController.my_orders);
	app.get('/api/my_order_detail/:user_id/:id', orderController.my_order_detail);
	app.get('/api/my_tickets/:user_id', orderController.my_tickets);
	app.get('/api/my_ticket_detail/:user_id/:id', orderController.my_ticket_detail);


	// Reports
	app.get('/api/admin_dashboard_report', reportController.admin_dashboard_report);
	app.get('/api/admin_dashboard_order_report', reportController.order_report);
	app.get('/api/admin_dashboard_revenue_report', reportController.revenue_report);
	app.get('/api/admin_dashboard_recent_enquiry', reportController.recent_enquiry);
	app.get('/api/admin_dashboard_recent_contacts', reportController.recent_contacts);
	app.get('/api/admin_dashboard_recent_orders', reportController.recent_orders);


	// Customer Reports
	app.get('/api/dashboard_order_report/:user_id', reportController.customer_order_report);
	app.get('/api/dashboard_revenue_report/:user_id', reportController.customer_revenue_report);
	app.get('/api/dashboard_recent_enquiry/:user_id', reportController.customer_recent_enquiry);
	app.get('/api/dashboard_recent_orders/:user_id', reportController.customer_recent_orders);


	app.get('/api/event_attenders', attendersController.index);
	app.get('/api/event_attenders/:id', attendersController.view);


	// Blogs
	app.get('/api/blogs', blogsController.index);
	app.get('/api/blogs/:id', blogsController.view);
	app.post('/api/blogs', blogsController.add);
	app.delete('/api/blogs/:id', blogsController.delete);
	app.put('/api/blogs', blogsController.update);

	// Blog Comments
	app.get('/api/blog_comments', blogCommentsController.index);
	app.get('/api/blog_comments/:id', blogCommentsController.view);

	// FronTend Blog View 
	app.get('/api/frontend_blogs', blogsController.frontend_index);
	app.get('/api/frontend_blog_detail', blogsController.frontend_view);

	app.post('/api/add_comments', blogCommentsController.add_comments);	


	// Cron List
	app.get('/cron/event_exipry', cronController.event_exipry);
	app.get('/cron/ticket_reset', cronController.ticket_reset);
}