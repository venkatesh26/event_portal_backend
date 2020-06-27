const blogCommentService = require('../services/blog_comment');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  async index(req, res) {
    const { BlogComments } = blogCommentService.getAllData(req.query)
      BlogComments.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async view(req, res) {
    blogCommentService.getBlogCommentById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  async add_comments(req, res){
    // Required Fields
    var required_fields=['comments', 'blog_id', 'user_id']

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
    req.body.status="published";

    blogCommentService.addBlogComments(req.body)
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  } 
}