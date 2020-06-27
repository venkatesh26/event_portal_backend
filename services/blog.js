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
  const Blogs = models.blogs.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Blogs': Blogs}
};

const getFrontendList = function (data) {
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
  if (data.status) {
    where.status = data.status
  }
  where.deletedAt = null; 
  const Blogs = models.blogs.findAndCountAll({
    limit: limit,
    where: where,
    order: [order_query],
    offset: offset,
    $sort: { id: 1 }
  });
  return { 'Blogs': Blogs}
};

const getBlogById = id => models.blogs.findOne({ where: { id } });

const addBlog = blog_data => models.blogs.create(blog_data, { returning: true });

const updateBlog = function (data) {

  return models.blogs.update(
    {
      name: data.name,
      description: data.description,
      slug:data.slug,
      thumb_nail_img_dir:data.thumb_nail_img_dir,
      thumb_nail_img_name:data.thumb_nail_img_name,
      img_dir:data.img_dir,
      img_name:data.img_name,
      category_id:data.category_id,
      status:data.status
    },
    { where: { id: data.id } })
}

const deleteBlog = function (id) {
  return models.blogs.update(
    {
      deletedAt: Date()
    },
    { where: { id: id } })
}

module.exports = { addBlog, getAllData, getBlogById, deleteBlog, updateBlog, getFrontendList };