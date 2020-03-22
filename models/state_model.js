module.exports = (sequelize, DataTypes) => {
	var states = sequelize.define('states', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		country_id: {
			type: DataTypes.INTEGER,
			validate: {
				notEmpty: {
					args: true,
					msg: "Country Required"
				},
			}
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
					msg: "slug Required"
				},
			}
		},
        is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	});
	states.associate = models => {
		states.belongsTo(models.countries, { foreignKey: 'country_id' })
	}
	return states;
}