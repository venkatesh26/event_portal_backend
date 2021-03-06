const contactsService = require('../services/contacts');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  index(req, res) {
    const { Contacts } = contactsService.getAllData(req.query)
      Contacts.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async add(req, res) {

      // Required Fields
      var required_fields = ['name', 'email', 'contact_no', 'message']
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

      try
      {
        var post_data = { 
            name: req.body.name,
            email: req.body.email,
            contact_no: req.body.contact_no,
            message: req.body.message,
        }
        var contacts = await models.contacts.create(post_data);
        return res.send(encrypt({
                  success: true,
                  message: 'Thanks For Contact Us'
        }));
      }
      catch(error){
          return res.send(encrypt({
                  success: false,
                  message: 'Event Enquires Not Saved'
          }));
      }
  },
  view(req, res) {
    contactsService.getContactById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  delete(req, res) {
    contactsService.deleteContact(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}