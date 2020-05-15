module.exports = (sequelize, DataTypes) => {
	var event_orders = sequelize.define('event_orders', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER
		},
		event_user_id: {
			type: DataTypes.INTEGER
		},
		event_id: {
			type: DataTypes.INTEGER
		},
		currency_id: {
			type: DataTypes.INTEGER
		},
		no_of_tickets: {
			type: DataTypes.INTEGER
		},
		total_amount: {
			type: DataTypes.INTEGER
		},
		transaction_id: {
			type: DataTypes.STRING,
			allowNull: false, 
			trim:true
		},
		payment_source: {
			type: DataTypes.STRING,
			allowNull: false, 
			trim:true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false, 
			trim:true
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	});
	event_orders.associate = models => {
		
		event_orders.hasMany(models.event_order_items, { foreignKey: 'event_order_id' });
		event_orders.hasMany(models.event_attenders, { foreignKey: 'event_order_id' });
		event_orders.belongsTo(models.events, { foreignKey: 'event_id' });
		event_orders.belongsTo(models.users, { foreignKey: 'user_id' });
		event_orders.belongsTo(models.currencies, { foreignKey: 'currency_id' })
	}
	return event_orders;
}
