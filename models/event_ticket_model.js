module.exports = (sequelize, DataTypes) => {
	var Event_Tickets = sequelize.define('event_tickets', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		event_id: {
			type: DataTypes.INTEGER
		},
		name: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Name Required"
				},
			}
		},
		slug: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Slug Required"
				},
			}
		},
		description: {
			type: DataTypes.TEXT, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Description Required"
				},
			}
		},
		quantity: { type: DataTypes.INTEGER},
		price: { type: DataTypes.FLOAT },
		start_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		end_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		min_per_booking: { type: DataTypes.INTEGER},
		max_per_booking: { type: DataTypes.INTEGER},
		message_to_attendee: {
			type: DataTypes.TEXT, allowNull: true, trim:true
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	});
	Event_Tickets.associate = models => {
		Event_Tickets.belongsTo(models.events, { foreignKey: 'event_id' })
	}
	return Event_Tickets;
}
