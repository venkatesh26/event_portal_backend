const config = require('./config');
const Sequelize = require('sequelize');
var sequelize = new Sequelize(config.dbConnectionString,{
	define:{
		charset:'utf8',
		collate:'utf8_general_ci'
	}
});
module.exports = sequelize;