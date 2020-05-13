module.exports = (sequelize, DataTypes) => {
	var pages = sequelize.define('pages', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
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
		content: {
			type: DataTypes.TEXT, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Cotent Required"
				},
			}
		},
		meta_title: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		meta_description: {
			type: DataTypes.TEXT, allowNull: true, trim:true
		},
		meta_keywords: {
			type: DataTypes.STRING, allowNull: true, trim:true
		},
		is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})
	return pages;
}