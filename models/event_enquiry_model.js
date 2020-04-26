module.exports = (sequelize, DataTypes) => {
	var event_enquiries = sequelize.define('event_enquiries', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		event_id: {
			type: DataTypes.INTEGER, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "event_id Required"
				},
			}
		},
		name: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Name Required"
				},
			}
		},
		email: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Email Required"
				},
			}
		},
		contact_no: {
			type: DataTypes.STRING, allowNull: false
		},
		message: { type: DataTypes.TEXT, allowNull: true},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})

	event_enquiries.associate = models => {	
		event_enquiries.belongsTo(models.events, { foreignKey: 'event_id' })
	}
	return event_enquiries;
}