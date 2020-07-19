const authService = require('../services/auth');
const encrypt = require('../customFunctions').encrypt;
const models = require('../models');
const Sequelize = require('sequelize');
const QueryTypes   = Sequelize.QueryTypes;
var sequelize = require('../db');

module.exports = {
	async event_exipry(req, res) {
		var dateTime = require('node-datetime');
		var dt = dateTime.create();
		var end_date = dt.format('Y-m-d');
		// Total Users
		await sequelize.query("UPDATE events SET status='expired' WHERE end_date <='"+end_date+"' AND  status!='expired';", { type: QueryTypes.UPDATE });
		return res.send(encrypt({
          success: true,
          message: "updated success"
        }));
	},
	async ticket_reset(req, res) {

		var where ={}
		where.status = 'processing';
		const ticket_log_data = await models.event_ticket_logs.findAll({
			where: where,
			include:[
				{
					model:models.event_ticket_log_details
				}
			]
		});
		ticket_log_data.map(async function(data) {
			data.event_ticket_log_details.map(async function(field) {
				sequelize.query('CALL ticket_reset(:param1, :param2, @status);', 
			 	{
					replacements: {param1: field.event_ticket_id, param2: field.quantity},
					type: sequelize.QueryTypes.RAW
			 	});
		  	});

			// Event Log Update 
			var log_data={
				'status':'failed'
			}
	        models.event_ticket_logs.update(log_data,{
	              where: { ref_number: data.ref_number },
	        });
    	});

    	return res.send(encrypt({
          success: true,
          message: "updated success"
        }));
	}
}