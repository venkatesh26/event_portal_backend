const countryService = require('../services/countries');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  index(req, res) {
    const { Countries } = countryService.getAllData(req.query)
      Countries.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
      .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
      })
  },
  add(req, res) {
    req.body.slug = sluggable_behavior(req.body.name);
    countryService.add(req.body)
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  update(req, res) {
    countryService.update(req.body)
      .then(data => res.send(encrypt({ "success": true, "message": "Updated successfully." })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  view(req, res) {
    countryService.getById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  delete(req, res) {
    countryService.deleteData(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}