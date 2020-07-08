const eventOrderService = require('../services/event_order');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
	async index(req, res) {
	    const { EventOrders } = eventOrderService.getAllData(req.query)
	      	EventOrders.then(async function(data){
		   if(req.query.is_download == 'true' || req.query.is_download == true){
		      	var excel_data = [];			
				await Promise.all(
					data.rows.map(async (my_data,i) => {	
					  var obj={}
					  obj['created']=my_data['createdAt'];
					  obj['first_name']=my_data['user']['first_name'];
					  obj['email']=my_data['user']['email'];
					  obj['no_of_tickets']=my_data['no_of_tickets'];
					  obj['total_amount']=my_data['total_amount'];
					  obj['currency']=my_data['currency']['name'];
					  obj['payment_source']=my_data['payment_source'];
					  obj['transaction_id']=my_data['transaction_id'];
					  obj['event_name']=my_data['event']['name'];
					  obj['status']=my_data['status'];
					  excel_data.push(obj);
				  })
				);
				var new_file_header=[
					{'column_name':'created', displayName:'Order Date'},
					{'column_name':'first_name', displayName:'First Name'},
					{'column_name':'email', displayName:'Email'},
					{'column_name':'no_of_tickets', displayName:'No. Of Tickets'},
					{'column_name':'total_amount', displayName:'Total Sale'},
					{'column_name':'currency', displayName:'Currency'},
					{'column_name':'payment_source', displayName:'Payment Source'},
					{'column_name':'transaction_id', displayName:'Transaction ID'},
					{'column_name':'event_name', displayName:'Event Name'},
					{'column_name':'status', displayName:'Status'},                    
				]
				var reports = downloadExcel.downloadExcelSheet(new_file_header, excel_data)
				var file_name = "order-list.xlsx"
				var file_dir = "assets/"
				writeFileSync(file_dir+file_name, reports);
				var base64_data='';
				var fs = require('fs');
				var bitmap = fs.readFileSync(file_dir+file_name);
				base64_data = new Buffer.from(bitmap).toString('base64');
				fs.unlinkSync(file_dir+file_name)
				return res.send(encrypt({ "success": true, "base64_data": base64_data, 'file_name':file_name}))
	      	}
	      	else {
	        	res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
	    	}
	      })
	    .catch(function(error){
	        res.send(encrypt({ "success": false, "message": error }))
	    })
    },
    async view(req, res) {
		var where = {};
	    where.id = req.params.id;
	    const Event_Orders = models.event_orders.findOne({
	      where: where,
	      include: [
	        {
	            model: models.events,
	            attributes : ['name']
	        },
	        {
	            model: models.users,
	            attributes : ['first_name', 'last_name', 'email', ]
	        },
	        {
	            model: models.event_attenders
	        },
	        {
	            model: models.currencies,
	            attributes:['name', 'code']
	        },
	        {
	            model: models.event_order_items,
	            include: [
	           	 	{
	            		model: models.event_tickets,
	            		attributes:['name']
	            	}
	            ]	
	        }
	      ]
	    });
	    Event_Orders.then(function(data){
	        if(data) {
	            return res.send({
	                success: true,
	                data: data,
	            });
	        }
	        else {
	          return res.send({
	              success: false,
	              data: data,
	          });
	      }
	    });
    },
    async download_invoice(req, res) {
	    if(typeof req.body.order_id =='undefined' || req.body.order_id==''){
	      return res.send(encrypt({
	            success: false,
	            message: 'order_id Field Is required'
	      }));
	    }

		var where = {};
	    where.id = req.body.order_id;
	    const Event_Orders = models.event_orders.findOne({
	      where: where,
	      include: [
	        {
	            model: models.events,
	            attributes:['name']
	        },
	        {
		        model: models.currencies,
	            attributes:['name', 'code']
		    },
	        {
	            model: models.users,
	            attributes:['first_name', 'last_name', 'email']
	        },
	        {
	            model: models.event_order_items,
	            include: [
		            {
		            	model: models.event_tickets
		            },
		            
	            ]	
	        }
	      ]
	    });
	    Event_Orders.then(async function(data){
	    	if(data){
				var ejs = require("ejs");
				const html = await ejs.renderFile("views/order_invoice.ejs", {viewData: data })
				.then(output => output);

				var pdf = require('html-pdf');
				var options = { 'format': 'A4',   "orientation": "portait" };
				await pdf.create(html, options).toFile('assets/order_invoice.pdf', function (err, response) {
					var base64_data='';
					var fs = require('fs');
					var bitmap = fs.readFileSync('assets/order_invoice.pdf');
					base64_data = new Buffer.from(bitmap).toString('base64');
					fs.unlinkSync('assets/order_invoice.pdf')
					return res.send(encrypt({ "success": true, "base64_data": base64_data, 'file_name':'order_invoice.pdf'}));
				});
			}
			else {
				return res.send(encrypt({
	            	success: false,
	            	message: 'Invalid Order'
	      		}));
			}
	    });
    },
    async my_orders(req, res) {
	    const { EventOrders } = eventOrderService.getMyOrders(req.query, req.params.user_id)
	      EventOrders.then(data => {
	        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
	      })
	    .catch(function(error){
	        res.send(encrypt({ "success": false, "message": error }))
	    })
    },
    async my_order_detail(req, res) {
	    var where = {};
	    where.id = req.params.id;
	    where.event_user_id = req.params.user_id;
	     const Event_Orders = models.event_orders.findOne({
	      where: where,
	      include: [
	        {
	            model: models.events,
	            attributes : ['name']
	        },
	        {
	            model: models.users,
	            attributes : ['first_name', 'last_name', 'email', ]
	        },
	        {
	            model: models.event_attenders
	        },
	        {
	            model: models.currencies,
	            attributes:['name', 'code']
	        },
	        {
	            model: models.event_order_items,
	            include: [
	           	 	{
	            		model: models.event_tickets,
	            		attributes:['name']
	            	}
	            ]	
	        }
	      ]
	    });
	    Event_Orders.then(function(data){
	        if(data) {
	            return res.send({
	                success: true,
	                data: data,
	            });
	        }
	        else {
	          return res.send({
	              success: false,
	              data: data,
	          });
	      }
	    });
    },
    async my_tickets(req, res) {
	    const { EventOrders } = eventOrderService.getMyTicketsData(req.query, req.params.user_id)
	      EventOrders.then(data => {
	        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
	      })
	    .catch(function(error){
	        res.send(encrypt({ "success": false, "message": error }))
	    })
    },
    async my_ticket_detail(req, res) {
    	var where = {};
	    where.id = req.params.id;
	    where.user_id = req.params.user_id;
	    const Event_Orders = models.event_orders.findOne({
	      where: where,
	      include: [
	        {
	            model: models.events,
	            attributes:['name']
	        },
	        {
	            model: models.event_order_items
	        },
	        {
	            model: models.event_attenders
	        },
	        {
	            model: models.currencies,
	            attributes:['name', 'code']
	        }
	      ]
	    });
	    Event_Orders.then(function(data){
	        if(data) {
	            return res.send({
	                success: true,
	                data: data,
	            });
	        }
	        else {
	          return res.send({
	              success: false,
	              data: data,
	          });
	      }
	    });
    },
    async payment_intents(req, res){

		const stripe = require('stripe')(CONFIG.stripe.securet_key);
		if(typeof req.body.event_id =='undefined' || req.body.event_id==''){

			return res.send(encrypt({
				success: false,
				message: 'event_id Field Is required'
			}));
		}

		if(typeof req.body.ticket_details =='undefined' || req.body.ticket_details==''){
			return res.send(encrypt({
				success: false,
				message: 'ticket_details Field Is required'
			}));
		}

		var ref_number='';
		var event_ticket_log_details=[];

		try
		{
			// Get Event Details
			var where = {};
	        where.id = req.body.event_id;
	        where.status = 'published';
			const Events = await models.events.findOne({
		      where: where,
		      include: [
		        {
		            model: models.event_tickets
		        },
		        {
		            model: models.currencies
		        }
		      ]
		    });
		    if(Events) {

		    	var currencies_code = Events.currency.code;
		    	var curreny_id = Events.currency.id;
		    	var event_user_id = Events.user_id;
		    	var total_amount = 0;
		    	var event_ticket_order_items = [];
		    	var ticket_data = [];
		    	var total_tickets = 0;
				Events.event_tickets.map(function(ticket){
				    if(ticket.is_active==1){
					   ticket_data[ticket.id]=ticket.price;
					}
				});	

				var ticket_error = false;
				req.body.ticket_details.map(field => {	
					try
					{
						var ticket_price =  ticket_data[field.ticket_id];
						if(typeof ticket_price!='undefined'){
							var  ticket_amount  = parseFloat(field.quantity * ticket_price);
							total_amount = parseFloat(total_amount) + ticket_amount;
							total_tickets = parseInt(total_tickets)+parseInt(field.quantity);
							if(field.no_of_tickets_sold > field.quantity){
								ticket_error=true;
							}
							event_ticket_log_details.push({
								'event_ticket_id': field.ticket_id,
								'no_of_tickets':field.quantity,
								'amount':ticket_price,
								'total_amount':ticket_amount
							});
						}
					}
					catch(error){

					}
				});


				let amount = total_amount * 100;
		    	var currencies_code = Events.currency.code;
				stripe.paymentIntents.create(
				{
					amount: amount,
					description:"BuyUrTicket - Event Ticket Booking",
					currency: 'inr',//currencies_code,
					payment_method_types: ['card']
				},
				function(err, paymentIntent) {

					// Save Ticket Log
					var ticket_log = {
						"event_id":req.body.event_id,
						"ref_number":ref_number,
						"no_of_tickets":total_tickets,
						"status":"processing",
						"event_ticket_log_details":event_ticket_log_details
					}

					return res.send(encrypt({
						success: true,
						data:paymentIntent.client_secret,
						client_secret:paymentIntent.client_secret,
						ref_number:ref_number,
						message: 'success'
					}));
				});
			}
			else {
				return res.send(encrypt({
					success: false,
					message: 'Somethig Went Wrong'
				}));
			}
		}
		catch(error) {
			return res.send(encrypt({
				success: false,
				message: error
			}));
		}
    },
	async place_order(req, res) {

		var payment_types = ['stripe'];
		if(typeof req.body.payment_type =='undefined' || req.body.payment_type==''){

			return res.send(encrypt({
				success: false,
				message: 'payment_type Field Is required'
			}));
		}
		if(typeof req.body.event_id =='undefined' || req.body.event_id==''){

			return res.send(encrypt({
				success: false,
				message: 'event_id Field Is required'
			}));
		}
		if(typeof req.body.ticket_details =='undefined' || req.body.ticket_details==''){

			return res.send(encrypt({
				success: false,
				message: 'ticket_details Field Is required'
			}));
		}
		if(typeof req.body.event_attenders =='undefined' || req.body.event_attenders==''){

			return res.send(encrypt({
				success: false,
				message: 'event_attenders Field Is required'
			}));
		}
		if(typeof req.body.user_id =='undefined' || req.body.user_id==''){

			return res.send(encrypt({
				success: false,
				message: 'user_id Field Is required'
			}));
		}

		if(typeof req.body.customer_name =='undefined' || req.body.customer_name==''){

			return res.send(encrypt({
				success: false,
				message: 'customer_name Field Is required'
			}));
		}

		if(typeof req.body.user_logged_in!='undefined' && req.body.user_logged_in==false || req.body.user_logged_in=='false'){
			var random_password  = Math.random().toString(36).slice(-6);
			const userService = require('../services/user');
			var user_data = await userService.getUserByEmail(req.body.email);
			const bcrypt = require('bcrypt');
			const base64 = require('base-64');
			const aes256 = require('aes256');
			const dateTime = require('node-datetime');
			if(typeof user_data!='undefined' &&  user_data!=null && user_data.id!=''){
				req.body.user_id = user_data.id
			}
			else {
				// create new user 
				var user = {
						first_name: req.body.customer_name,
						password: bcrypt.hashSync(random_password, CONFIG.saltRounds),
						email: req.body.email,
						is_active: 1,
						is_email_verfied: 0,
						role_id:2
				}
				req.body.user_id = await userService.customerRegister(user).then(function(user){
					var email_config=EMAIL_CONFIG['guest_customer_register'];
					var token = aes256.encrypt(CONFIG.Aes_key, user.id.toString())
					token = base64.encode(token);
					var verfication_link=CONFIG.account_verification_link+"?token="+token
					var email_data = {
						'password':random_password,
						'customer_name':req.body.first_name,
						'verfication_link':verfication_link,
					}
					var update_data ={
						'email_verification_token':token
					}
					userService.updateUserData(update_data, user.id)
				    mailer.send_mail(user.email, email_config.subject, email_data, email_config.template_name);
				    return user.id;
				});
			}
		}

		try 
		{
	    	// Get Event Details
			var where = {};
	        where.id = req.body.event_id;
			const Events = await models.events.findOne({
		      where: where,
		      include: [
		        {
		            model: models.event_tickets
		        },
		        {
		            model: models.users
		        },
		        {
		            model: models.currencies
		        }
		      ]
		    });
		    if(Events) {

		    	var currencies_code = Events.currency.code;
		    	var curreny_id = Events.currency.id;
		    	var event_user_id = Events.user_id;
		    	var total_amount = 0;
		    	var event_ticket_order_items = [];
		    	var ticket_data = [];
		    	var total_tickets = 0;
				Events.event_tickets.map(function(ticket){
					ticket_data[ticket.id]=ticket.price;
				});	  
				req.body.ticket_details.map(field => {	

					try
					{
						var ticket_price =  ticket_data[field.ticket_id];
						if(typeof ticket_price!='undefined'){
							var  ticket_amount  = parseFloat(field.quantity * ticket_price);
							total_amount = parseFloat(total_amount) + ticket_amount;
							total_tickets = parseInt(total_tickets)+parseInt(field.quantity);
							event_ticket_order_items.push({
								'event_ticket_id': field.ticket_id,
								'no_of_tickets':field.quantity,
								'amount':ticket_price,
								'total_amount':ticket_amount
							});
						}
					}
					catch(error){

					}
			    });

			    if(typeof req.body.paymentIntent.status!='undefined' && req.body.paymentIntent.status=='succeeded'){

					// Create Order 
					var order_details = {
						event_user_id:event_user_id,
						user_id:req.body.user_id,
						event_id: req.body.event_id,
						currency_id: curreny_id,
						no_of_tickets: total_tickets,
						total_amount: total_amount,
						payment_source:'Stripe Payment',
						transaction_id:req.body.paymentIntent.id,
						status:req.body.paymentIntent.status,
						event_order_items: event_ticket_order_items,
						event_attenders: req.body.event_attenders
					}
				    var order_details = await models.event_orders.create(order_details, {
				          include: [
				              {  
				                 model: models.event_order_items
				              },
				              {  
				                 model: models.event_attenders
				              }
				          ]
				    });

				    if(order_details){

					    var where={};

					    where.id = order_details.id;

					    // Get Order Details
					    const Event_Orders = await models.event_orders.findOne({
					      where: where,
					      include: [
					        {
					            model: models.events,
					            attributes:['name']
					        },
					        {
						        model: models.currencies,
					            attributes:['name', 'code']
						    },
					        {
					            model: models.users,
					            attributes:['first_name', 'last_name', 'email']
					        },
					        {
					            model: models.event_order_items,
					            include: [
						            {
						            	model: models.event_tickets
						            },
						            
					            ]	
					        }
					      ]
					    });

					    var ejs = require("ejs");
						const html = await ejs.renderFile("views/order_invoice.ejs", {viewData: Event_Orders })
						.then(output => output);
						var pdf = require('html-pdf');
						var options = { 'format': 'A4',   "orientation": "portait" };
						var file_name = "order_invoice" + Date.now() + ".pdf";
					    pdf.create(html, options).toFile('assets/order_invoice/'+file_name,async  function (err, response) {

							// Get Buyer Details
							var buyer_details = await models.users.findOne({
								where: { id: req.body.user_id }, 
								attributes: ['id', 'first_name', 'last_name','email']
							});

						    // Send Email To Buyer
							var email_config = EMAIL_CONFIG['event_book_ticket_buyer_invoice'];
							var email_data = {
								'customer_name':buyer_details.first_name+" "+buyer_details.last_name,
								'customer_email':buyer_details.email
							}
							mailer.send_mail(buyer_details.email, email_config.subject, email_data,
							 email_config.template_name, 'assets/order_invoice/'+file_name);
						});

						return res.send(encrypt({
							success: true,
							message: 'Order Placed Successfully'
						}));
					}
					else{

						return res.send(encrypt({
							success: false,
							message: 'Order Not Placed'
						}));
					}
				}
				else
				{
					return res.send(encrypt({
						success: false,
						message: 'Invalid Event ID'
					}));
				}
			}
		    else 
		    {
				return res.send(encrypt({
					success: false,
					message: 'Invalid Event ID'
				}));
		    }
		}
		catch(error) {
			console.log('=================================================')
			console.log(error)

			console.log('=================================================')
			return res.send(encrypt({
				success: false,
				message: error
			}));
		}
	}
}