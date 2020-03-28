var mailer = require('express-mailer');
var config = require('./config/config');
var EMAIL_CONFIG = {
    from: config.email.from,
    host: config.email.host, // hostname
    secureConnection: config.email.secureSSLConnection, // use SSL
    port: config.email.port, // port for secure SMTP
    transportMethod: config.email.transportMethod, // default is SMTP. Accepts anything that nodemailer accepts
}
if(typeof config.email.user!='undefined' && typeof config.email.pass!='undefined' ) {
    EMAIL_CONFIG.auth = {}
    EMAIL_CONFIG.auth = {
      user: config.email.user,
      pass: config.email.pass
    }
}
mailer.extend(app, EMAIL_CONFIG);
async function send_mail(toEmail, Subject, Data, template_name, attachments=[]) {

    var config = require('./config');
    if(typeof config.email.send_to_test_email!='undefined' && typeof config.email.test_email!='undefined' && config.email.send_to_test_email==true){
       
       console.log("E-mail sending to test_email")
       toEmail=config.email.test_email
    }
    if (attachments!=''){
        const path = require('path');
        const ABSPATH = path.dirname(process.mainModule.filename);
        var base64Img = require('base64-img');
        if( typeof attachments === 'string' ) {
          var img = base64Img.base64Sync(attachments); 
           var attachments = [
                  {
                      filename: attachments,
                      path: ABSPATH+attachments,
                      contents: new Buffer.from(img.replace(/^data:image\/(png|gif|jpeg|jpg|xlsx|html|pdf);base64,/,''), 'base64')
                  }
              ]  
        }
        else {
          var new_attachments = []
          for(var k = 0; k < attachments.length; k++) {
                var img =base64Img.base64Sync(attachments[k]); 
                var att = {}
                att.filename = attachments[k]
                att.path=ABSPATH+attachments[k]
                att.contents = new Buffer.from(img.replace(/^data:image\/(png|gif|jpeg|jpg|xlsx|html|pdf);base64,/,''), 'base64')
                new_attachments.push(att)
            }
            attachments = new_attachments
          }
    }
    app.mailer.send(template_name, {
      to: toEmail,
      subject: Subject,
      viewData:Data,
      attachments: attachments,
    }, function (err) {
        if (err) {
          console.log(err);
          console.log('There was an error sending the email');
          return false
        }
        else {
            console.log("Email Sent");
            return true
        }
    });
}
module.exports = { send_mail};