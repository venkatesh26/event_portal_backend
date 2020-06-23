module.exports = (sequelize, DataTypes) => {
	var activity_logs = sequelize.define('activity_logs', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER
		},
		message: {
			type: DataTypes.TEXT, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "message Required"}

			}
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})
	activity_logs.associate = models => {
		activity_logs.belongsTo(models.users, { foreignKey: 'user_id' })
	}
	return activity_logs;
}