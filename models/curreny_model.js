module.exports = (sequelize, DataTypes) => {
	var currencies = sequelize.define('currencies', {
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
		code: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Code Required"
				},
			},
			unique: {
				args: true,
				msg: 'Code already in use!'
			}
		},
		is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	});
	return currencies;
}
