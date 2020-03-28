module.exports = (sequelize, DataTypes) => {
	const Countries = sequelize.define('countries', {
		name: {type: DataTypes.STRING, unique: true,},
		iso_code: {type: DataTypes.STRING, allowNull: true},
		slug: {type: DataTypes.STRING, allowNull: true, unique: true},
		createdAt: { type: DataTypes.DATE},
        updatedAt: { type: DataTypes.DATE,  allowNull: true},
        deletedAt: { type: DataTypes.DATE,  allowNull: true},
        is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
	});
	return Countries;
}