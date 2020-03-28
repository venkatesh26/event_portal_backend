module.exports = (sequelize, DataTypes) => {
	var cities = sequelize.define('cities', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		country_id: {
			type: DataTypes.INTEGER
		},
		state_id: {
			type: DataTypes.INTEGER
		},
		name: {
			type: DataTypes.STRING, allowNull: true,
			unique: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Name Required"
				},
			}
		},
		slug: {
			type: DataTypes.STRING, allowNull: true,
			unique: true,
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
	cities.associate = models => {
		cities.belongsTo(models.countries, { foreignKey: 'country_id' })
		cities.belongsTo(models.states, { foreignKey: 'state_id' })		
	}
	return cities;
}