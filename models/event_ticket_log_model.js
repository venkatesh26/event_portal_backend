module.exports = (sequelize, DataTypes) => {
	var event_ticket_logs = sequelize.define('event_ticket_logs', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		event_id: {
			type: DataTypes.INTEGER
		},
		ref_number: {
			type: DataTypes.STRING, allowNull: false
		},
		no_of_tickets: {
			type: DataTypes.INTEGER
		},
		status: { type: DataTypes.STRING, defaultValue: 'order_process'},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	});
	event_ticket_logs.associate = models => {
		event_ticket_logs.belongsTo(models.events, { foreignKey: 'event_id' })
		event_ticket_logs.hasMany(models.event_ticket_log_details, { foreignKey: 'ticket_log_id' })
	}
	return event_ticket_logs;
}
