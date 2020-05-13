const pageService = require('../services/page');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  index(req, res) {
    const { Categories } = pageService.getAllData(req.query)
      Categories.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async add(req, res) {
    
    if(typeof req.body.name =='undefined' || req.body.name==''){
      return res.send(encrypt({
            success: false,
            message: 'name Field Is required'
      }));
    }

    if(typeof req.body.content =='undefined' || req.body.content==''){
      return res.send(encrypt({
            success: false,
            message: 'content Field Is required'
      }));
    }

    // Check  Already Exists
    var isExist = await pageService.isExistOrNot(req.body.name);
    if(isExist) {
      return res.send(encrypt({
            success: false,
            message: 'Page Name Already Exists'
      }));
    }

    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    pageService.addPage(req.body)
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
            message: 'Title Field Is required'
      }));
    }
    // Check  Already Exists
    var isExist = pageService.isExistOrNot(req.body.name, req.body.id);
    if(isExist==true){
      return res.send(encrypt({
            success: false,
            message: 'Page Already Already Exists'
      }));
    }
    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    pageService.updatePage(req.body)
      .then(data => res.send(encrypt({ "success": true, "message": "Page Updated successfully." })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  view(req, res) {
    pageService.getPageById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  delete(req, res) {
    pageService.deleteCategory(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}