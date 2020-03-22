const categoryService = require('../services/categories');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  index(req, res) {
    const { Categories } = categoryService.getAllData(req.query)
      Categories.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  add(req, res) {
    if(typeof req.body.name =='undefined' || req.body.name==''){
      return res.send(encrypt({
            success: false,
            message: 'name Field Is required'
      }));
    }
    if(typeof req.body.state_id =='undefined' || req.body.state_id==''){
      return res.send(encrypt({
            success: false,
            message: 'state_id Field Is required'
      }));
    }
    if(typeof req.body.country_id =='undefined' || req.body.country_id==''){
      return res.send(encrypt({
            success: false,
            message: 'country_id Field Is required'
      }));
    }
    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    categoryService.addCategory(req.body)
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  update(req, res) {
    if(typeof req.body.name =='undefined' || req.body.name==''){
      return res.send(encrypt({
            success: false,
            message: 'name Field Is required'
      }));
    }
    if(typeof req.body.state_id =='undefined' || req.body.state_id==''){
      return res.send(encrypt({
            success: false,
            message: 'state_id Field Is required'
      }));
    }
    if(typeof req.body.country_id =='undefined' || req.body.country_id==''){
      return res.send(encrypt({
            success: false,
            message: 'country_id Field Is required'
      }));
    }
    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    categoryService.updateCategory(req.body)
      .then(data => res.send(encrypt({ "success": true, "message": "Category Updated successfully." })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  view(req, res) {
    categoryService.getCategoryById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  delete(req, res) {
    categoryService.deleteCategory(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}