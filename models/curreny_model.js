module.exports = (sequelize, DataTypes) => {
	var currency = sequelize.define('currency', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING, allowNull: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Name Required"
				},
			}
		},
		slug: {
			type: DataTypes.STRING, allowNull: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Slug Required"
				},
			}
		},
		code: {
			type: DataTypes.STRING, allowNull: true
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	});
	return currency;
}
