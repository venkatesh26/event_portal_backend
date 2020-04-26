const express = require('express');
const http = require('http');
const nocache = require('nocache');
const bodyParser = require('body-parser');
global.app = express();
global.__basedir = __dirname;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var path = require('path');

app.use("/assets", express.static(path.join(__dirname, 'assets')));


const helmet = require('helmet')
app.use(helmet())
app.use(helmet.xssFilter())
app.use(helmet.frameguard())

global.CONFIG = require('./config/config');
var sequelize = require('./db');
sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const router = require('./routers/router');
const encrypt = require('./customFunctions').encrypt;
const decrypt = require('./customFunctions').decrypt;


global.mailer = require('./mailer');

app.use(nocache());
app.use(bodyParser.json({limit: CONFIG.file_upload_limit, extended: true}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('client'));

app.all('*', function (req, res, next) {
  
  if(CONFIG.is_allow_origin==true){   
        var allowedOrigins = CONFIG.allowedOrigins
        var origin = req.headers.origin;
        console.log(origin)
        console.log(allowedOrigins)

       if(allowedOrigins.indexOf(origin) > -1){
            res.setHeader('Access-Control-Allow-Origin', origin);
        }else{
             return;
        }
        var responseSettings = {
            "AccessControlAllowOrigin": req.headers.origin,
            "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name",
            "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
            "AccessControlAllowCredentials": true
        };

        res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
        res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
        res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
          next();
        }
    }
    else {
      next();
    }
});
router.set(app);

global.downloadExcel = require('./excel');

if (CONFIG.is_ssl_enabled) {
    var https = require('https');
    const fs = require('fs');
    var options = {
        cert: fs.readFileSync('./security/localhost.key'),
        key:  fs.readFileSync('./security/localhost.crt')
    };
    var server = https.createServer(options, app);
    server.timeout = 0;
    server.listen(CONFIG.port, function(){
         console.log('SSL - App listening on port ' + CONFIG.port);
    });
}
else {

    app.listen(CONFIG.port, () => console.log('Non SSL - App listening on port ' + CONFIG.port));
}

global.writeFileSync = function (path, buffer, permission) {
    var fs = require('fs');
    permission = permission || 438;
    var fileDescriptor;

    try {
        fileDescriptor = fs.openSync(path, 'w', permission);
    } catch (e) {
        fs.chmodSync(path, permission);
        fileDescriptor = fs.openSync(path, 'w', permission);
    }

    if (fileDescriptor) {
        fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
        fs.closeSync(fileDescriptor);
    }
}

global.customFunctions = require('./customFunctions');
global.sluggable_behavior = require('slug')

global.sluggable_behavior.defaults.mode ='pretty';
global.sluggable_behavior.defaults.modes['rfc3986'] = {
    replacement: '-',      // replace spaces with replacement
    symbols: true,         // replace unicode symbols or not
    remove: null,          // (optional) regex to remove characters
    lower: true,           // result in lower case
    charmap: sluggable_behavior.charmap, // replace special characters
    multicharmap: sluggable_behavior.multicharmap // replace multi-characters
};
