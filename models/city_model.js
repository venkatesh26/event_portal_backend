module.exports = (sequelize, DataTypes) => {
	var cities = sequelize.define('cities', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		county_id: {
			type: DataTypes.INTEGER
		},
		state_id: {
			type: DataTypes.INTEGER
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
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})
	return cities;
}