const blogService = require('../services/blog');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  async index(req, res) {
    const { Blogs } = blogService.getAllData(req.query)
      Blogs.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async add(req, res) {

    // Required Fields
    var required_fields=['category_id', 'thumb_nail_img_dir', 'thumb_nail_img_name', 'img_dir', 
      'img_name', 
      'description','name','user_id'
    ]

    var error = false;
    var error_field = '';
    // Required Validation
    required_fields.forEach(field => {
        if(typeof req.body[field] =='undefined' || req.body[field]==''){
          error_field=field;
          error = true;
        }
    });

    if(error) {
      return res.send(encrypt({
              success: false,
              message: error_field + ' Field Is required'
      }));
    }

    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    req.body.status = "published";
    blogService.addBlog(req.body)
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  async update(req, res) {
    // Required Fields
    var required_fields=['category_id', 'thumb_nail_img_dir', 'thumb_nail_img_name', 'img_dir', 
     'img_name', 'description','name','id'
    ]

    var error = false;
    var error_field = '';
    // Required Validation
    required_fields.forEach(field => {
        if(typeof req.body[field] =='undefined' || req.body[field]==''){
          error_field=field;
          error = true;
        }
    });

    if(error) {
      return res.send(encrypt({
              success: false,
              message: error_field + ' Field Is required'
      }));
    }
    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    blogService.updateBlog(req.body)
      .then(data => res.send(encrypt({ "success": true, "message": "Blog Updated successfully." })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  async view(req, res) {
    blogService.getBlogById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  async delete(req, res) {
    blogService.deleteBlog(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  },
  async frontend_index(req, res) {
    const { Blogs } = blogService.getFrontendList(req.query)
      Blogs.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
   async frontend_view(req, res) {
    
      var where = {};
      var blog_comment_where={};
      blog_comment_where.status='published';

      where.id = req.query.blog_id;
      where.status = "published";
      const Blogs = models.blogs.findOne({
        where: where,
        include:[
          {
            model: models.blog_comments,
            where: blog_comment_where,
            include:[
              {
                model: models.users,
                attributes: ['first_name']
              }
            ]
          }
        ]
      });
      Blogs.then(function(data){
          if(data) {
              return res.send({
                  success: true,
                  data: data,
              });
          }
          else {
            return res.send({
                success: false,
                data: data,
            });
        }
      });
  },
}