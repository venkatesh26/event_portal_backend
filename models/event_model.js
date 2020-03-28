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

				},
			}
		},
		start_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		end_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
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
			type: DataTypes.STRING, allowNull: true, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Venue name Required"
				},
			}
		},
		address_line_1: {
			type: DataTypes.STRING, allowNull: true, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Address line1 Required"
				},
			}
		},
		address_line_2: {
			type: DataTypes.STRING, allowNull: true, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Address line2 Required"
				},
			}
		},
		city: {
			type: DataTypes.STRING, allowNull: true, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "City  Required"
				},
			}
		},
		city_id: {
			type: DataTypes.INTEGER
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
			type: DataTypes.BOOLEAN,
			defaultValue:0
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	},
	{

		charset:'utf8',
		collate:'utf8_general_ci'
	})
	Events.associate = models => {
		Events.belongsTo(models.users, { foreignKey: 'user_id' })
		Events.belongsTo(models.categories, { foreignKey: 'category_id' })
		Events.belongsTo(models.currencies, { foreignKey: 'currency_id' })
	}
	return Events;
}
