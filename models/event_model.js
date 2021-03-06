module.exports = (sequelize, DataTypes) => {
	var Events = sequelize.define('events', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
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
					msg: "Long Description Required"}

			}
		},
		start_date: { type: DataTypes.DATEONLY },
		end_date: { type: DataTypes.DATEONLY },
		start_time: { type: DataTypes.STRING, allowNull: true},
		end_time: { type: DataTypes.STRING, allowNull: true },
		time_zone: { type: DataTypes.STRING, allowNull: true },
		type: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		event_visibility: {
			type: DataTypes.STRING, allowNull: false, trim:true
		},
		thumb_nail_img_dir: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Image Dir Required"
				},
			}
		},
		thumb_nail_img_name: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "ImagePath Required"
				},
			}
		},
		img_dir: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Image Dir Required"
				},
			}
		},
		img_name: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Image Path Required"
				},
			}
		},
		venue_name: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		address_line_1: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		address_line_2: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		city: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		city_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		state: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		state_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		country: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		country_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		pincode: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		lat: {
			type: DataTypes.STRING,
			allowNull: true, 
			trim:true 
		},
		long: {
			type: DataTypes.STRING,
			allowNull: true, 
			trim:true 
		},
		tags: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		category_name: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "category Required"
				},
			}
		},
		category_id: {
			type: DataTypes.INTEGER, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "category_id Required"
				},
			}
		},
		currency_id: {
			type: DataTypes.INTEGER, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "currency_id Required"
				},
			}
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false, 
			trim:true
		},
		is_popular: {
			type: DataTypes.BOOLEAN,
			defaultValue:0
		},
		declined_message: {
			type: DataTypes.TEXT,
			allowNull: true, 
			trim:true
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{
		charset:'utf8',
		collate:'utf8_general_ci'
	});

	Events.associate = models => {	
		Events.belongsTo(models.users, { foreignKey: 'user_id' })
		Events.belongsTo(models.currencies, { foreignKey: 'currency_id' })
		Events.belongsTo(models.categories, { foreignKey: 'category_id' })
		Events.hasMany(models.event_tickets, { foreignKey: 'event_id' })
		Events.hasMany(models.event_schedule_details, { foreignKey: 'event_id' })
		Events.hasMany(models.event_tags, { foreignKey: 'event_id' })
	}
	
	return Events;
}
