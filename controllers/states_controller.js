const statesService = require('../services/states');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  index(req, res) {
    const { States } = statesService.getAllData(req.query)
      States.then(data => {
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
    if(typeof req.body.country_id =='undefined' || req.body.country_id==''){
      return res.send(encrypt({
            success: false,
            message: 'country_id Field Is required'
      }));
    }
    // Check  Already Exists
    var isExist = statesService.isExistOrNot(req.body.name);
    if(isExist==true){
      return res.send(encrypt({
            success: false,
            message: 'State Already Exists'
      }));
    }

    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    statesService.add(req.body)
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
    if(typeof req.body.country_id =='undefined' || req.body.country_id==''){
      return res.send(encrypt({
            success: false,
            message: 'country_id Field Is required'
      }));
    }

    // Check  Already Exists
    var isExist = statesService.isExistOrNot(req.body.name, req.body.id);
    if(isExist==true){
      return res.send(encrypt({
            success: false,
            message: 'State Already Exists'
      }));
    }

    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    statesService.update(req.body)
      .then(data => res.send(encrypt({ "success": true, "message": "Updated successfully." })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  view(req, res) {
    statesService.getById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  delete(req, res) {
    statesService.deleteData(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}