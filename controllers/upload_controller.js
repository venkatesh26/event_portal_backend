const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  upload(req, res) {

      if (typeof req.query.type=='undefined' || req.query.type==null){
        return res.send(encrypt({ "success": false, "message": "type Field Is required"}))
      }
      if (typeof req.files=='undefined' || req.files==null){
        return res.send(encrypt({ "success": false, "message": "file_data Field Is required"}))
      }
      else if (req.files!='null' && typeof req.files.file_data=='undefined'){
        return res.send(encrypt({ "success": false, "message": "file_data Field Is required"}))
      }

      var datetime = require('node-datetime');
      var dt = datetime.create();
      var file_name = req.files.file_data.name;
      var file_dir = "assets/tmp_files/"+type+"/"
      var fs = require("fs");
      if (!fs.existsSync('assets/')){
         fs.mkdirSync('assets/');
      }
      if (!fs.existsSync(file_dir)){
         fs.mkdirSync(file_dir);
      }
      var file_path=file_dir+file_name;
      req.files.file_data.mv(file_path, async function(err) {
        if(err)
        {
              try { fs.unlinkSync(file_path) } catch { }
              return res.send(encrypt({ "success": false, message:err}))
        }
        else
        {
          var data={};
          data.file_dir=file_dir;
          data.file_name=file_name;
          return res.send(encrypt({ "success": true, "data":data}));
        }
    });
}
}
