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
	            model: models.event_order_items,
	            include: [
		            {
		            	model: models.event_tickets
		            }
	            ]	
	        }
	      ]
	    });
	    Event_Orders.then(async function(data){
	       
 		  var ejs = require("ejs");
	       const html = await ejs.renderFile("views/order_invoice,ejs", {viewData: data })
          .then(output => output);



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
	            model: models.events
	        },
	        {
	            model: models.event_order_items
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
	            model: models.events
	        },
	        {
	            model: models.event_order_items
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

				let amount = total_amount * 100;
		    	var currencies_code = Events.currency.code;

				stripe.paymentIntents.create(
				{
					amount: amount,
					description:"event ticket purchase",
					currency: 'inr',//currencies_code,
					payment_method_types: ['card'],
				},
				function(err, paymentIntent) {

					console.log(paymentIntent);

					return res.send(encrypt({
						success: true,
						data:paymentIntent.client_secret,
						client_secret:paymentIntent.client_secret,
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

		console.log(req.body);
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
				    var order_details = models.event_orders.create(order_details, {
				          include: [
				              {  
				                 model: models.event_order_items
				              },
				              {  
				                 model: models.event_attenders
				              }
				          ]
				        });
					return res.send(encrypt({
						success: true,
						message: 'Order Placed Successfully'
					}));
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
			return res.send(encrypt({
				success: false,
				message: error
			}));
		}
	}
}