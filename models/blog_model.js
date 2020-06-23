module.exports = (sequelize, DataTypes) => {
	var blogs = sequelize.define('blogs', {
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
		category_id: {
			type: DataTypes.INTEGER, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "category_id Required"
				},
			}
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false, 
			trim:true
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})
	blogs.associate = models => {
		blogs.belongsTo(models.users, { foreignKey: 'user_id' })
		blogs.belongsTo(models.categories, { foreignKey: 'category_id' })
	}
	return blogs;
}