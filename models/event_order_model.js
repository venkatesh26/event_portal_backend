module.exports = (sequelize, DataTypes) => {
	var event_orders = sequelize.define('event_orders', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
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
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	});
	event_orders.associate = models => {
		event_orders.belongsTo(models.events, { foreignKey: 'event_id' })
	}
	return event_orders;
}
