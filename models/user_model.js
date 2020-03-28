module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		first_name: {
			type: DataTypes.STRING, allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: "First name Required"
				},
			}
		},
		last_name: { type: DataTypes.STRING, allowNull: true },
		user_name: {
			type: DataTypes.STRING, allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: "User Name Required"
				},
			},
			unique: {
				args: true,
				msg: 'User name already in use!'
			}
		},
		password: {
			type: DataTypes.STRING, allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: "Password Required"
				},
			}
		},
		gender: DataTypes.INTEGER,
		dob: DataTypes.DATEONLY,
		email: { type: DataTypes.STRING, allowNull: true,
			unique: {
				args: true,
				msg: 'Email id already in use!'
			}
		},
		area_code: { type: DataTypes.STRING, allowNull: true },
		mobile_no: {
			type: DataTypes.STRING, allowNull: false, unique: true,
			validate: {
				len: {
					args: [10],
					msg: "Mobile number must be 10 digit"
				}
			},
			unique: {
				args: true,
				msg: 'Mobile number already in use!'
			}
		},
		address_1: { type: DataTypes.STRING, allowNull: true },
		address_2: { type: DataTypes.STRING, allowNull: true },
		role_id: {
			type: DataTypes.INTEGER, allowNull: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Role id Required"
				},
			}
		},
		city: { type: DataTypes.STRING, allowNull: true },
		state: { type: DataTypes.STRING, allowNull: true },
		pincode: {
			type: DataTypes.INTEGER, allowNull: true,
			validate: {
				len: {
					args: [6],
					msg: "Pincode must be 6 digit"
				}
			}
		},
		country: { type: DataTypes.STRING, allowNull: true },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true },
		is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
		is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
		is_login: { type: DataTypes.BOOLEAN, defaultValue: false },
		last_login: { type: DataTypes.DATE, allowNull: true },
		token_expiry_hours: { type: DataTypes.STRING, allowNull: true },
		forgot_pass_token: { type: DataTypes.STRING, allowNull: true },
		forgot_pass_date: { type: DataTypes.DATE, allowNull: true },
		forgot_pass_exp_timestamp: { type: DataTypes.DATE, allowNull: true },
		user_type: { type: DataTypes.STRING, allowNull: true, defaultValue:null },
	});
	User.associate = models => {
			User.belongsTo(models.role, { foreignKey: 'role_id' })
	}
	return User;
}