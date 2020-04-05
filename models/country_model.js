module.exports = (sequelize, DataTypes) => {
	const Countries = sequelize.define('countries', {
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
				msg: 'Country name already in use!'
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
		iso_code: {type: DataTypes.STRING, allowNull: true},
		createdAt: { type: DataTypes.DATE},
        updatedAt: { type: DataTypes.DATE,  allowNull: true},
        deletedAt: { type: DataTypes.DATE,  allowNull: true},
        is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
	});
	return Countries;
}