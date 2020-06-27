	const eventAttenderService = require('../services/event_attender');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
	async index(req, res) {
	    const { EventAttenders } = eventAttenderService.getAllData(req.query)
	      	EventAttenders.then(async function(data){
		   if(req.query.is_download == 'true' || req.query.is_download == true){
		      	var excel_data = [];			
				await Promise.all(
					data.rows.map(async (my_data,i) => {	
					  var obj={}
					  obj['created']=my_data['createdAt'];
					  obj['name']=my_data['name'];
					  obj['email']=my_data['email'];
					  obj['mobile_no']=my_data['mobile_no'];
					  obj['company_name']=my_data['company_name'];
					  obj['destination']=my_data['destination'];
					  obj['city']=my_data['city'];
					  excel_data.push(obj);
				  })
				);
				var new_file_header=[
					{'column_name':'created', displayName:'Register Date'},
					{'column_name':'name', displayName:'Name'},
					{'column_name':'email', displayName:'Email'},
					{'column_name':'mobile_no', displayName:'Mobile Number'},
					{'column_name':'company_name', displayName:'Company Name'},
					{'column_name':'destination', displayName:'Destination'},
					{'column_name':'city', displayName:'City'}
				];
				var reports = downloadExcel.downloadExcelSheet(new_file_header, excel_data);
				var file_name = "attenders-list.xlsx"
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
    async view(req, res) {
		var where = {};
	    where.id = req.params.id;
	    const Event_Attenders = models.event_attenders.findOne({
	      where: where,
	      include: [
	        {
	            model: models.events,
	            attributes : ['name']
	        }
	      ]
	    });
	    Event_Attenders.then(function(data){
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
    }
}