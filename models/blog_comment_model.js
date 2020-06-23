module.exports = (sequelize, DataTypes) => {
	var blog_comments = sequelize.define('blog_comments', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER
		},
		blog_id: {
			type: DataTypes.INTEGER
		},
		comments: {
			type: DataTypes.STRING, allowNull: false, trim:true, validate: {
				notEmpty: {
					args: true,
					msg: "Comments Required"
				},
			}
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false, 
			trim:true
		},
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updatedAt: { type: DataTypes.DATE, allowNull: true },
		deletedAt: { type: DataTypes.DATE, allowNull: true }
	})
	blog_comments.associate = models => {
		blog_comments.belongsTo(models.users, { foreignKey: 'user_id' })
		blog_comments.belongsTo(models.blogs, { foreignKey: 'blog_id' })
	}
	return blog_comments;
}