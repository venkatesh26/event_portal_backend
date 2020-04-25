const eventOrderService = require('../services/event_order');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
	async index(req, res) {
	    const { EventOrders } = eventOrderService.getAllData(req.query)
	      EventOrders.then(data => {
	        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
	      })
	    .catch(function(error){
	        res.send(encrypt({ "success": false, "message": error }))
	    })
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
		if(typeof req.body.stripe_token =='undefined' || req.body.stripe_token==''){

			return res.send(encrypt({
				success: false,
				message: 'stripe_token Field Is required'
			}));
		}
		if(typeof req.body.user_id =='undefined' || req.body.user_id==''){

			return res.send(encrypt({
				success: false,
				message: 'user_id Field Is required'
			}));
		}

		var ticket = ['ticket_id', 'quantity'];

		// Ticket Validate
		req.body.ticket_details.forEach(field => {
			console.log(field);
		});

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
		    	var total_amount = 0;
		    	var event_ticket_order_items = [];
		    	var ticket_data = [];
		    	var total_tickets = 0;

				Events.event_tickets.forEach(function(ticket){
					ticket_data[ticket.id]=ticket.price;
				});	  

				req.body.ticket_details.forEach(field => {	
					var ticket_price =  ticket_data[field.ticket_id];
					var  ticket_amount  = parseFloat(field.quantity * ticket_price);
					total_amount = parseFloat(total_amount) + ticket_amount;
					total_tickets = parseInt(total_tickets)+field.quantity;
					event_ticket_order_items.push({
						'event_ticket_id': field.ticket_id,
						'no_of_tickets':field.quantity,
						'amount':ticket_price,
						'total_amount':total_amount
					});
			    });

				let amount = total_amount * 100;
		

		    	const stripe = require('stripe')(CONFIG.stripe.securet_key);


		    	var customer_description = '#'+req.body.user_id+" Event Ticket Purchase";

		    	var charge_description = '#'+req.body.user_id+" Event Charge";

			    // create a customer 
			    stripe.customers.create({
			    	name:req.body.customer_name,
			    	description:customer_description,
			        email: req.body.email, 
			        source: req.body.stripe_token ,
			        address: {
			        	city : '', 
			        	country :'', 
			        	line1 :'',
			         	line2 : "", 
			         	postal_code: '', 
			         	state : ''
			        }
			    }).then(function(customer){

					stripe.charges.create({ // charge the customer
						amount,
						description: charge_description,
						currency: currencies_code,
						customer: customer.id
					}).then(function(transaction) {

						// Create Order 
						var order_details = {
							user_id:req.body.user_id,
							event_id: req.body.event_id,
							currency_id: curreny_id,
							no_of_tickets: total_tickets,
							total_amount: amount,
							payment_source:'Stripe Payment',
							transaction_id:transaction.id,
							status:transaction.status,
							event_order_items: event_ticket_order_items
						}
				        var order_details = models.event_orders.create(order_details, {
				          include: [
				              {  
				                 model: models.event_order_items
				              }
				          ]
				        });

						return res.send(encrypt({
							success: true,
							message: 'Order Placed Successfully'
						}));

					});
			    });
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