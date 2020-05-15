module.exports = (sequelize, DataTypes) => {
	var event_order_items = sequelize.define('event_order_items', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		event_order_id: {
			type: DataTypes.INTEGER
		},
		event_ticket_id: {
			type: DataTypes.INTEGER
		},
		no_of_tickets: {
			type: DataTypes.INTEGER
		},
		amount: {
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
	event_order_items.associate = models => {
		event_order_items.belongsTo(models.event_orders, { foreignKey: 'event_order_id' })
		event_order_items.belongsTo(models.event_tickets, { foreignKey: 'event_ticket_id' })
	}
	return event_order_items;
}
