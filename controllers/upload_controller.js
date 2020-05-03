const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;

module.exports = {
    upload(req, res) {
        if (typeof req.query.folder_type == 'undefined' || req.query.folder_type == null){
          return res.send(encrypt({ "success": false, "message": "folder_type Field Is required"}))
        }
        if (typeof req.query.file_type == 'undefined' || req.query.file_type == null){
          return res.send(encrypt({ "success": false, "message": "file_type Field Is required"}))
        }
        if (typeof req.files == 'undefined' || req.files == null){
          return res.send(encrypt({ "success": false, "message": "file_data Field Is required"}))
        }
        else if (req.files !='null' && typeof req.files.file_data == 'undefined'){
          return res.send(encrypt({ "success": false, "message": "file_data Field Is required"}))
        }

        var image_file_types = ['image/jpg', 'image/jpeg', 'image/png'];
        var file_type = ['image'];
        var folder_type = ['events', 'profile_avatar', 'category'];

        if(folder_type.indexOf(req.query.folder_type) == -1){
          return res.send(encrypt({ "success": false, "message": "Invalid folder_type"}))   
        }

        if(file_type.indexOf(req.query.file_type) == -1){
          return res.send(encrypt({ "success": false, "message": "Invalid file_type"}))   
        } 

        var datetime = require('node-datetime');
        var dt = datetime.create();

        var file_path = req.files.file_data.name;
        
        var file_name = file_path.substr(0, file_path.lastIndexOf('.'));
        var ext = file_path.substr((file_path.lastIndexOf('.') + 1));

        var slug = sluggable_behavior((file_name).toString().toLowerCase());
        var file_name = Date.now()+"_"+slug+"."+ext;
        var file_dir = "assets/"+req.query.folder_type+"/"
        var fs = require("fs");
        if (!fs.existsSync('assets/')){
           fs.mkdirSync('assets/');
        }
        if (!fs.existsSync(file_dir)){
           fs.mkdirSync(file_dir);
        }
        var file_path = file_dir+file_name;
        req.files.file_data.mv(file_path, async function(err) {
        if(err)
        {
            try { fs.unlinkSync(file_path) } catch { }
            return res.send(encrypt({ "success": false, message:err}))
        }
        else
        {
          var data = {};
          data.file_dir = file_dir;
          data.file_name = file_name;
          module.exports.compress_image(file_dir+file_name, file_dir);
          return res.send(encrypt({ "success": true, "data":data}));
        }
      });
    },
    compress_image(image_path, image_dir){

        var compress_images = require('compress-images'), INPUT_path_to_your_images, OUTPUT_path;
        INPUT_path_to_your_images = image_path;
        OUTPUT_path = image_dir+"compress/";
        compress_images(INPUT_path_to_your_images, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true}, false,
                                                    {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
                                                    {png: {engine: 'pngquant', command: ['--quality=20-50']}},
                                                    {svg: {engine: 'svgo', command: '--multipass'}},
                                                    {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}

}, function(error, completed, statistic){
                    console.log('-------------');
                    console.log(error);
                    console.log(completed);
                    console.log(statistic);
                    console.log('-------------');                                   
        });
    }

}
