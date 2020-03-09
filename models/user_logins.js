module.exports = (sequelize, DataTypes) => {
	var UsersLogins = sequelize.define('user_logins', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER
		},
		ip_address: {
			type: DataTypes.STRING, allowNull: false, trim:true
		},
		broswer_info: {
			type: DataTypes.STRING, allowNull: false, trim:true
		},
		mac_address: {
			type: DataTypes.STRING, allowNull: false, trim:true
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		token: {
			type: DataTypes.TEXT, allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: "User id Required"
				},
			}
		},	
		in_time: { type: DataTypes.DATE,defaultValue: DataTypes.NOW },
		out_time: { type: DataTypes.DATE, allowNull: true, defaultValue:null },
		updatedAt: { type: DataTypes.DATE},
		deletedAt: { type: DataTypes.DATE, allowNull: true },
	})
	UsersLogins.associate = models => {
			UsersLogins.belongsTo(models.users, { foreignKey: 'user_id' })
	}
	return UsersLogins;
}
