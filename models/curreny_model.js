module.exports = (sequelize, DataTypes) => {
	var currencies = sequelize.define('currencies', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING, allowNull: true,
			unique:true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Name Required"
				},
			}
		},
		code: {
			type: DataTypes.STRING, allowNull: true, unque:true
		},
		is_active: { type: DataTypes.BOOLEAN, defaultValue: false },

		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	});
	return currencies;
}
