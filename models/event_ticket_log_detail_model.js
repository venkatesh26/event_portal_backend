module.exports = (sequelize, DataTypes) => {
	var event_ticket_log_details = sequelize.define('event_ticket_log_details', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		ticket_log_id : {
			type: DataTypes.INTEGER
		},
		event_ticket_id: {
			type: DataTypes.INTEGER
		},
		quantity: { type: DataTypes.INTEGER},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	});
	event_ticket_log_details.associate = models => {
		event_ticket_log_details.belongsTo(models.event_ticket_logs, { foreignKey: 'ticket_log_id' })
		event_ticket_log_details.belongsTo(models.event_tickets, { foreignKey: 'event_ticket_id' })
	}
	return event_ticket_log_details;
}
