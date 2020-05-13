module.exports = (sequelize, DataTypes) => {
	var categories = sequelize.define('categories', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Name Required"
				},
			},
			unique: {
				args: true,
				msg: 'Category name already in use!'
			}
		},
		slug: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Slug Required"
				},
			},
			unique: {
				args: true,
				msg: 'Slug already in use!'
			}
		},
		is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
		image_path: {
			type: DataTypes.STRING, allowNull: true,
		},
		image_name: {
			type: DataTypes.STRING, allowNull: true,
		},
		event_count: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue:0,

		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})
	categories.associate = models => {
		categories.hasMany(models.events, { foreignKey: 'category_id' })
	}
	return categories;
}
