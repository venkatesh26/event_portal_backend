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
	
		return true;
	}
}