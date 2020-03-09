module.exports = (sequelize, DataTypes) => {
	var Role = sequelize.define('role', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Role name Required"
				},
			},
			unique: {
				args: true,
				msg: 'Role name already in use!'
			}
		},
		slug: { type: DataTypes.TEXT, allowNull: true },
		description: { type: DataTypes.TEXT, allowNull: true },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true },
		is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
		is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
		is_super_admin: { type: DataTypes.BOOLEAN, defaultValue: false }
	})
	Role.associate = models => {
		Role.hasMany(models.users, {foreignKey: 'role_id'})
	}
	return Role;
}
