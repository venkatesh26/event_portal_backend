module.exports = (sequelize, DataTypes) => {
	var event_gallery = sequelize.define('event_galleries', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		event_id: {
			type: DataTypes.INTEGER
		},
		img_dir: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Image Dir Required"
				},
			}
		},
		img_path: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Image Path Required"
				},
			}
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})
	event_gallery.associate = models => {
		event_gallery.belongsTo(models.events, { foreignKey: 'event_id' })
	}
	return event_gallery;
}
