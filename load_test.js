var myArgs = process.argv.slice(2);
const async = require('async');
const request = require('request');
var requestArray=[];
var action = '';
var number_of_request=5;
for (var i = 1; i <= number_of_request; i++) {
   requestArray.push({url: 'http://localhost:8012/api/payment_intents'});
}

let getApi = function (opt, callback) {
    request(opt, (err, response, body) => {
            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            var formatted = dt.format('Y-m-d H:M:S');
            var elapsed_time = new Date(formatted) - new Date(opt.start_time);
            var output={
                requestIndex:opt.request_number,
                start_time:opt.start_time,
                end_time:formatted,
                elapsed_time:elapsed_time,
                body:body
            }
            callback(err, output);
    });
};

const functionArray = requestArray.map((opt, i) => { 

var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    opt.start_time = formatted;
    opt.request_number = parseInt(i+1);
    return (callback) => getApi(opt, callback); 
});


async.parallel(
    functionArray, (err, results, callback) => {
        if (err) {
            console.error('Error: ', err);
        } else {
            var file_dir = "assets/load_test/";
            var fs = require("fs");
            if (!fs.existsSync('assets/')){
               fs.mkdirSync('assets/');
            }
            if (!fs.existsSync(file_dir)){
               fs.mkdirSync(file_dir);
            }
            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            var file_name = dt.format('Y-m-d-H-M-S')+".txt";
            var content="Request No:"+parseInt(results.requestIndex)+"\nStart Time :"+ results.requestIndex+"\nEnd time:"+results.end_time+"\nElapsed Time :"+results.elapsed_time+"\n"+results.body+"\n\n";
           
            fs.appendFile(file_dir+file_name, JSON.stringify(results, null, 4), function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }
});