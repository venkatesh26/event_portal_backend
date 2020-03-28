const eventService = require('../services/events');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  index(req, res) {
    const { Events } = eventService.getAllData(req.query)
      Events.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  add(req, res) {

      req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
      var base64ToImage = require('base64-to-image');
      var img_name='';
      var thumb_nail_img_name='';
      var img_dir = 'assets/events_banner_thumb/';
      var thumb_nail_img_dir = 'assets/events_thumb/';

      // Tumbnail Image Upload
      try{
        var info =  base64ToImage(req.body.thumb_nail_image_base64, __basedir+"/public/"+thumb_nail_img_dir);
        thumb_nail_img_name = info.fileName;
      }
      catch{
      }

      // Banner Image Upload
      try{
        var info =  base64ToImage(req.body.banner_image_base64, __basedir+"/public/"+img_dir);
        img_name = info.fileName;
      }
      catch{
      }

      var post_data = {
          name: req.body.name,
          slug: re.body.slug,
          user_id:req.body.user_id,
          description:req.body.description,
          start_date:req.body.start_date,
          end_date:req.body.end_date,
          category_id:req.body.category_id,
          category_name:req.body.category_name,
          type:req.body.type,
          event_visibility:req.body.event_visibility,
          thumb_nail_img_dir:thumb_nail_img_dir,
          thumb_nail_img_name:thumb_nail_img_name,
          img_dir:img_dir,
          img_name:img_name,
          city:req.body.city_name,
          city_id:req.body.city_id,
          tags:req.body.tags,
          status:1,
          venue_name:req.body.venue_name,
          address_line_1:req.body.address_line_1,
          event_tickets:req.body.event_tickets
      }
      console.log(post_data);
      await  models.events.create(post_data,
      {
            include: [
                {  
                   model: models.event_tickets,
                   as: 'event_tickets'
                }
            ]
       })
      return res.send({
          status: true,
          message: "Events Added Sucessfully",
          redirect_link:req.protocol+"://"+req.headers.host+"/backoffice/events"
      });
  },
  update(req, res) {
    req.body.slug=sluggable_behavior((req.body.name).toString().toLowerCase());
    eventService.updateEvents(req.body)
      .then(data => res.send(encrypt({ "success": true, "message": "Category Updated successfully." })))
      .catch(err => {
        return res.send(encrypt({
          success: false,
          message: err.message
        }));
      });
  },
  view(req, res) {
    eventService.getEventsById(decrypt(decode_id(req.params.id)))
      .then(data => res.send(encrypt({ "success": true, "data": data })))
      .catch((err) => res.status(400).send(err.message));
  },
  delete(req, res) {
    eventService.deleteEvents(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}