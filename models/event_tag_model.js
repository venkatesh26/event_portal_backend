module.exports = (sequelize, DataTypes) => {
	var EventTags = sequelize.define('event_tags', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		event_id: {
			type: DataTypes.INTEGER
		},
		tag_id: {
			type: DataTypes.INTEGER
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	})
	EventTags.associate = models => {
		EventTags.belongsTo(models.events, { foreignKey: 'event_id' })
		EventTags.belongsTo(models.tags, { foreignKey: 'tag_id' })
	}
	return EventTags;
}