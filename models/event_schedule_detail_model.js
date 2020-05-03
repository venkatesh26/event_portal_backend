module.exports = (sequelize, DataTypes) => {
	var event_schedule_details = sequelize.define('event_schedule_details', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		event_id: {
			type: DataTypes.INTEGER
		},
		event_day: {
			type: DataTypes.STRING
		},
		event_time: {
			type: DataTypes.STRING
		},
		description: {
			type: DataTypes.TEXT
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	});
	event_schedule_details.associate = models => {
		event_schedule_details.belongsTo(models.events, { foreignKey: 'event_id' })
	}
	return event_schedule_details;
}
