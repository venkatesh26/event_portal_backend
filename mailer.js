var mailer = require('express-mailer');
var config = require('./config/config');
var default_mail_server = (config.default_mail_server ) ? config.default_mail_server:'default' ;
if(typeof config.email_servers[default_mail_server]!='undefined') {
  var mail_server = config.email_servers[default_mail_server];
  var EMAIL_CONFIG = {
      from: mail_server.from,
      host: mail_server.host, // hostname
      secureConnection: mail_server.secureSSLConnection, // use SSL
      port: mail_server.port, // port for secure SMTP
      transportMethod: mail_server.transportMethod, // default is SMTP. Accepts anything that nodemailer accepts
  }
  if(typeof mail_server.user!='undefined' && typeof mail_server.pass!='undefined' ) {
      EMAIL_CONFIG.auth = {}
      EMAIL_CONFIG.auth = {
        user: mail_server.user,
        pass: mail_server.pass
      }
  }
}

mailer.extend(app, EMAIL_CONFIG);
async function send_mail(toEmail, Subject, Data, template_name, attachments=[]) {
    var config = require('./config/config');
    var default_mail_server = (config.default_mail_server ) ? config.default_mail_server:'default' ;
    var mail_server = config.email_servers[default_mail_server];
    if(typeof mail_server.send_to_test_email!='undefined' && typeof mail_server.test_email!='undefined' && mail_server.send_to_test_email==true){
       console.log("E-mail sending to test_email")
       toEmail= mail_server.test_email
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

        const models = require('./models');
        // Save Email Log 
        var email_log = {
          'subject':Subject,
          'email':toEmail,
          'template_name':template_name,
          'source':default_mail_server,
          'status': (err) ? 'failed':'success'
        }
        models.email_log.create(email_log);

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