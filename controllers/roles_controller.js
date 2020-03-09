const roleService = require('../services/role');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  index(req, res) {
    const { Roles } = roleService.getRoleAll(req.query)
      Roles.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
      .catch(function(error){

        console.log(error);

        res.send(encrypt({ "success": false, "message": error }))

      })
  },
  add(req, res) {
    roleService.addRole(req.body)
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  update(req, res) {
    roleService.updateRole(req.body)
      .then(data => res.send(encrypt({ "success": true, "message": "Updated successfully." })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  view(req, res) {
    roleService.getRoleById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  delete(req, res) {
    roleService.deleterole(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  },
  approveRole(req, res) {
    if (typeof req.query.is_active=="undefined"){
      res.send(encrypt({ "success": false, "message": "is_active Field Is required"}))
    }
    if (typeof req.query.role_id=="undefined"){
      res.send(encrypt({ "success": false, "message": "role_id Field Is required"}))
    }
		const req_data = {
			is_active: req.query.is_active,
			id: req.query.role_id
		}
		roleService.approveRole(req_data)
			.then(
				data => res.send(encrypt({ "success": true, "message": "Updated successfully." })))
			.catch(
				(err) => res.status(200).send(encrypt({ "success": false, "message": err.message })));
	},
}