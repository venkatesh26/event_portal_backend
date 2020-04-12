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

      // Required Fields
      var required_fields=[
        'name', 'description', 'start_date', 'end_date', 'category_id', 'category_name',
        'type', 'event_visibility', 'thumb_nail_img_dir', 'thumb_nail_img_name', 'img_dir', 
        'img_name', 'city', 'city_id', 'tags', 'venue_name', 'address_line_1',"currency_id", 
        'user_id'
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

      var slug = sluggable_behavior((req.body.name).toString().toLowerCase());
      var thumb_nail_img_dir = '/events/';
      var thumb_nail_img_name = '1.png';
      var img_dir = '/events/';
      var img_name = '1.png';

      var post_data = {
          name: req.body.name,
          slug: slug,
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
          currency_id:req.body.currency_id,
          event_tickets:req.body.event_tickets
      }

      try
      {
        models.events.create(post_data,
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
          message: "Events Added Sucessfully"
        });
      }
      catch(error){
        return res.send({
            status: false,
            message: "Something Went Wrong While creating AAn Event",
        });
      }
  },
  update(req, res) {

    // Required Fields
      var required_fields=[
        'id','name', 'description', 'start_date', 'end_date', 'category_id', 'category_name',
        'type', 'event_visibility', 'thumb_nail_img_dir', 'thumb_nail_img_name', 'img_dir', 
        'img_name', 'city', 'city_id', 'tags', 'venue_name', 'address_line_1',"currency_id", 
        'user_id'
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

      var slug = sluggable_behavior((req.body.name).toString().toLowerCase());
      var thumb_nail_img_dir = '/events/';
      var thumb_nail_img_name = '1.png';
      var img_dir = '/events/';
      var img_name = '1.png';

      var post_data = {
          name: req.body.name,
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
          currency_id:req.body.currency_id
      }

      try
      {
        models.events.update(post_data,{
              where: { id: req.body.id },
        });
        return res.send({
          status: true,
          message: "Events Updated Sucessfully"
        });
      }
      catch(error){
        return res.send({
            status: false,
            message: "Something Went Wrong While updating an Event",
        });
      }
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