const eventService = require('../services/events');
const tagService = require('../services/tag');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  async index(req, res) {
    const { Events } = eventService.getAllData(req.query)
      Events.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async add(req, res) {

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
      // check slug already exists
      var slug_counts = await eventService.getSlugCount(slug);
      if(slug_counts > 0 ){
         slug = slug+"_"+parseInt(slug_counts+1);   
      }

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
          thumb_nail_img_dir:req.body.thumb_nail_img_dir,
          thumb_nail_img_name:req.body.thumb_nail_img_name,
          img_dir:req.body.img_dir,
          img_name:req.body.img_name,
          city:req.body.city_name,
          city_id:req.body.city_id,
          tags:req.body.tags,
          status:'published',
          venue_name:req.body.venue_name,
          address_line_1:req.body.address_line_1,
          currency_id:req.body.currency_id,
          event_tickets:req.body.event_tickets
      }

      try
      {

        var event_details = models.events.create(post_data, {
          include: [
              {  
                 model: models.event_tickets,
                 as: 'event_tickets'
              }
          ]
        });
        event_details.then(function(data){

          var event_id = data.id;   

          // Tags 
          if(req.body.tags) {

            var all_tags = (req.body.tags).split(",");  
            all_tags.forEach(async function(data) {
                var  name = data;
                var  slug = sluggable_behavior((data).toString().toLowerCase());
                var tag_id = await tagService.FindOrSave(name, slug);  
                var tag_object = {
                    'tag_id':tag_id,
                    'event_id':event_id
                }
                models.event_tags.create(tag_object);
            });
          }

         });
        return res.send({
          status: true,
          message: "Events Added Sucessfully"
        });

      }
      catch(error) {

        return res.send({
            status: false,
            message: "Something Went Wrong While creating AAn Event",
        });

      }
  },
  async update(req, res) {

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
      // check slug already exists
      var slug_counts = await eventService.getSlugCount(slug, req.body.id);
      if(slug_counts > 0 ){
         slug = slug+"_"+parseInt(slug_counts+1);   
      }

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
          thumb_nail_img_dir:req.body.thumb_nail_img_dir,
          thumb_nail_img_name:req.body.thumb_nail_img_name,
          img_dir:req.body.img_dir,
          img_name:req.body.img_name,
          city:req.body.city_name,
          city_id:req.body.city_id,
          tags:req.body.tags,
          status:'published',
          venue_name:req.body.venue_name,
          address_line_1:req.body.address_line_1,
          currency_id:req.body.currency_id
      }

      try
      {
          await models.events.update(post_data,{
                where: { id: req.body.id },
          });

          var event_id = req.body.id;

          // Event Tickets Update
          if(req.body.event_tickets) {

            req.body.event_tickets.forEach(async function(data) {

                if(typeof data.id!='undefined') {

                    if(typeof data.action!='undefined' && data.action=='delete') {

                        data.deletedAt = Date();
                        models.event_tickets.update(data,{
                              where: { id: data.id },
                        });
                    }
                    else {

                        models.event_tickets.update(data,{
                              where: { id: data.id },
                        });
                    }
                }
                else {

                    data.event_id = req.body.id;
                    models.event_tickets.create(data,{
                          where: { id: data.id },
                    });
                }
            });
          }


          // Delete All Events Tags
          models.event_tags.destroy({
            where: {
              'event_id': event_details
            }
          });  

          // Tags 
          if(req.body.tags) {
            var all_tags = (req.body.tags).split(",");  
            all_tags.forEach(async function(data) {
                var  name = data;
                var  slug = sluggable_behavior((data).toString().toLowerCase());
                var tag_id = await tagService.FindOrSave(name, slug);  
                var tag_object = {
                    'tag_id':tag_id,
                    'event_id':event_id
                }
                models.event_tags.create(tag_object);
            });
          } 

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
  async view(req, res) {
    var where = {};
    where.id = req.params.id;
    const Events = models.events.findOne({
      where: where,
      include: [
        {
            model: models.users,
            attributes: ['first_name','last_name','user_name']
        },
        {
            model: models.event_tags
        },
        {
            model: models.event_tickets
        }
      ]
    });
    Events.then(function(data){
        if(data) {
            return res.send({
                status: true,
                data: data,
            });
        }
        else {
          return res.send({
              status: false,
              data: data,
          });
      }
    });
  },
  async delete(req, res) {
    eventService.deleteEvents(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  }
}