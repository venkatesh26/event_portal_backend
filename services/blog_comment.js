const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getAllData = function (data) {
  let where = {}
  let limit = 10;
  let offset = 0;
  let order_query = []
	if(data.order_key && data.order_param){ 
		order_query.push(data.order_key)  
		order_query.push(data.order_param)
	}else{
		order_query = ['createdAt', 'DESC']
	}
  var page = 1;
  if(data.page_no){
    page = data.page_no;
  }
  offset = limit * (page - 1);
  if (data.name) {
    where.name = { [Op.like]: '%' + data.name + '%' }
  }
  if (data.is_active) {
		where.is_active = ((data.is_active==true || data.is_active=='true') ) ? 1:0;
	}
  if (data.status) {
    where.status = data.status
  }
  where.deletedAt = null; 
  const BlogComments = models.blog_comments.findAndCountAll({
    distinct:true,
    include:[
    {

              model: models.users,
              attributes: ['first_name']

    },
    {

              model: models.blogs,
              attributes: ['name']

    }
  ],
  limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'BlogComments': BlogComments}
};

const getBlogCommentById = id => models.blog_comments.findOne({
 where: { id }, 
 include:[
    {

              model: models.users,
              attributes: ['first_name']

    },
    {

              model: models.blogs,
              attributes: ['name']

    }
  ]
});

const addBlogComments = blog_comment_data => models.blog_comments.create(blog_comment_data, { returning: true });

module.exports = { getAllData, getBlogCommentById , addBlogComments };