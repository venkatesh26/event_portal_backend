const eventEnuquiryService = require('../services/event_enquiry');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  async index(req, res) {
    const { EventEnquiry } = eventEnuquiryService.getAllData(req.query)
      EventEnquiry.then(async function(data){

        if(req.query.is_download == 'true' || req.query.is_download == true){
            var excel_data = [];      
            await Promise.all(
              data.rows.map(async (my_data,i) => {  
                var obj={}
                obj['created']=my_data['createdAt'];
                obj['name']=my_data['name'];
                obj['email']=my_data['email'];
                obj['contact_no']=my_data['contact_no'];
                obj['message']=my_data['message'];
                excel_data.push(obj);
              })
            );
            var new_file_header=[
              {'column_name':'created', displayName:'Enquiry Date'},
              {'column_name':'name', displayName:'Name'},
              {'column_name':'email', displayName:'Email'},
              {'column_name':'message', displayName:'Message'},
              {'column_name':'event_name', displayName:'Event Name'}                   
            ]
            var reports = downloadExcel.downloadExcelSheet(new_file_header, excel_data)
            var file_name = "lead-list.xlsx"
            var file_dir = "assets/"
            writeFileSync(file_dir+file_name, reports);
            var base64_data='';
            var fs = require('fs');
            var bitmap = fs.readFileSync(file_dir+file_name);
            base64_data = new Buffer.from(bitmap).toString('base64');
            fs.unlinkSync(file_dir+file_name)
            return res.send(encrypt({ "success": true, "base64_data": base64_data, 'file_name':file_name}))
        }
        else {
            res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
        }
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async add_enquiry(req, res) {
      // Required Fields
      var required_fields=[
        'event_id', 'name', 'email', 'contact_no', 'message'
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
      
      try
      {
        var post_data = { 
            event_id:req.body.event_id,
            name: req.body.name,
            email: req.body.email,
            contact_no: req.body.contact_no,
            message: req.body.message,
        }
        var event_enquiries = models.event_enquiries.create(post_data);
        return res.send(encrypt({
                  success: true,
                  message: 'Thanks For your Enquires. We will shortly Contact you.'
        }));
      }
      catch(error){
          return res.send(encrypt({
                  success: false,
                  message: 'Event Enquires Not Saved'
          }));
      }
  },
  async view(req, res) {
    eventEnuquiryService.getById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  async delete(req, res) {
    eventEnuquiryService.deleteData(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}