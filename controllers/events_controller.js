const eventService = require('../services/events');
const countryService = require('../services/countries');
const stateService = require('../services/states');
const cityService = require('../services/cities');
const tagService = require('../services/tag');
const userService = require('../services/user');
const models = require('../models');
var crypto = require('crypto');
const encrypt = require('../customFunctions').encrypt;
const decrypt = require('../customFunctions').decrypt;
const decode_id = require('../customFunctions').decode_id;
module.exports = {
  async index(req, res) {
    const { Events } = eventService.getAdminListData(req.query)
      Events.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async popular_event_list(req, res) {
    const { Events } = eventService.getPopularEventList(req.query)
      Events.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async home_event_list(req, res) {
    const { Events } = eventService.getHomeEventList(req.query)
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
        'name', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 'time_zone' , 
        'category_id', 'category_name','type', 'event_visibility', 'thumb_nail_img_dir', 
        'thumb_nail_img_name', 'img_dir', 'img_name', 'city', 'tags', 'venue_name', 
        'address_line_1',"currency_id", 'user_id', 'state', 'country', 'pincode'
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

      var dateTime = require('node-datetime');

      var event_tickets = [];
      req.body.event_tickets.forEach(function(ticket){
        ticket.slug = sluggable_behavior((ticket.name).toString().toLowerCase());
        event_tickets.push(ticket);
      });

      var country_id = '';
      var state_id = '';
      var city_id = '';

      // Save Country And GET ID
      country_id = await countryService.findOrSaveAndGetId(req.body.country);

      // Save State And GET ID
      state_id = await stateService.findOrSaveAndGetId(req.body.state, country_id);
      
      // Save City And GET ID
      city_id = await cityService.findOrSaveAndGetId(req.body.city, state_id, country_id);

      var start_date='';
      var end_date='';

      var dt = dateTime.create(req.body.start_date);
      var start_date = dt.format('Y-m-d');


      var dt = dateTime.create(req.body.end_date);
      var end_date = dt.format('Y-m-d');

      var post_data = {
          name: req.body.name,
          slug: slug,
          user_id:req.body.user_id,
          description:req.body.description,
          start_date:start_date,
          end_date:end_date,
          category_id:req.body.category_id,
          category_name:req.body.category_name,
          type:req.body.type,
          event_visibility:req.body.event_visibility,
          thumb_nail_img_dir:req.body.thumb_nail_img_dir,
          thumb_nail_img_name:req.body.thumb_nail_img_name,
          img_dir:req.body.img_dir,
          img_name:req.body.img_name,
          city:req.body.city,
          city_id:city_id,
          state:req.body.state,
          state_id:state_id,
          country:req.body.country,
          country_id:country_id,
          pincode:req.body.pincode,
          tags:req.body.tags,
          status:'published',
          venue_name:req.body.venue_name,
          address_line_1:req.body.address_line_1,
          address_line_2:req.body.address_line_2,
          currency_id:req.body.currency_id,
          lat:req.body.lat,
          long:req.body.long,
          is_popular:req.body.is_popular,
          start_time:req.body.start_time,
          end_time:req.body.end_time,
          time_zone:req.body.time_zone,
          event_tickets:event_tickets,
          event_schedule_details:req.body.event_schedule_details
      }

      try
      {


        var include_models=[];

        include_models.push( {  
                 model: models.event_tickets,
                 as: 'event_tickets'
        });

        if(typeof req.body.event_schedule_details!='undefined' ){

            include_models.push( {  
                     model: models.event_schedule_details,
                     as: 'event_schedule_details'
            });
        }
        var event_details = models.events.create(post_data, {
          include: include_models
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
          success: true,
          message: "Events Added Sucessfully"
        });
      }
      catch(error) {
        console.log(error);
        return res.send({
            success: false,
            message: "Something Went Wrong While creating An Event",
        });
      }
  },
  async update(req, res) {

    // Required Fields
      var required_fields=[
        'id','name', 'description', 'start_date', 'end_date', 'category_id', 'category_name',
        'type', 'event_visibility', 'thumb_nail_img_dir', 'thumb_nail_img_name', 'img_dir', 
        'img_name', 'city', 'tags', 'venue_name', 'address_line_1',"currency_id", 
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


      var country_id = '';
      var state_id = '';
      var city_id = '';

      var start_date='';
      var end_date='';


      var dateTime = require('node-datetime');

      var dt = dateTime.create(req.body.start_date);
      var start_date = dt.format('Y-m-d');


      var dt = dateTime.create(req.body.end_date);
      var end_date = dt.format('Y-m-d');
      

      // Save Country And GET ID
      country_id = await countryService.findOrSaveAndGetId(req.body.country);

      // Save State And GET ID
      state_id = await stateService.findOrSaveAndGetId(req.body.state, country_id);
      
      // Save City And GET ID
      city_id = await cityService.findOrSaveAndGetId(req.body.city, state_id, country_id);

      var post_data = {
          name: req.body.name,
          slug: slug,
          description:req.body.description,
          start_date:start_date,
          end_date:end_date,
          category_id:req.body.category_id,
          category_name:req.body.category_name,
          type:req.body.type,
          event_visibility:req.body.event_visibility,
          thumb_nail_img_dir:req.body.thumb_nail_img_dir,
          thumb_nail_img_name:req.body.thumb_nail_img_name,
          img_dir:req.body.img_dir,
          img_name:req.body.img_name,
          tags:req.body.tags,
          venue_name:req.body.venue_name,
          address_line_1:req.body.address_line_1,
          address_line_2:req.body.address_line_2,
          is_popular:req.body.is_popular,
          currency_id:req.body.currency_id,
          city:req.body.city,
          city_id:city_id,
          state:req.body.state,
          state_id:state_id,
          country:req.body.country,
          country_id:country_id,
          pincode:req.body.pincode,
          lat:req.body.lat,
          long:req.body.long,
          start_time:req.body.start_time,
          end_time:req.body.end_time,
          time_zone:req.body.time_zone
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

                data.slug = sluggable_behavior((data.name).toString().toLowerCase());

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
              'event_id': req.body.id
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
              success: true,
              message: "Events Updated Sucessfully"
          });

      }
      catch(error){
        return res.send({
            success: false,
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
              attributes: ['first_name','last_name', 'email']
          },
          {
              model: models.event_tags
          },
          {
              model: models.event_tickets
          },
          {
              model: models.currencies
          },
          {
            model: models.event_schedule_details
          }
        ]
      });
      Events.then(function(data){
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
  },
  async update_status(req, res) {
      if(typeof req.body.event_id =='undefined' || req.body.event_id==''){
        return res.send(encrypt({
              success: false,
              message: 'event_id Field Is required'
        }));
      }
      if(typeof req.body.user_id =='undefined' || req.body.user_id==''){
        return res.send(encrypt({
              success: false,
              message: 'user_id Field Is required'
        }));
      }
      if(typeof req.body.event_name =='undefined' || req.body.event_name==''){
        return res.send(encrypt({
              success: false,
              message: 'event_name Field Is required'
        }));
      }
      if(typeof req.body.status =='undefined' || req.body.status==''){
        return res.send(encrypt({
              success: false,
              message: 'status Field Is required'
        }));
      }
      if(req.body.status =='declined' && ( typeof req.body.declined_message=='undefined' || req.body.declined_message=='')){
        return res.send(encrypt({
              success: false,
              message: 'declined_message Field Is required'
        }));
      }
      var status = ['published', 'declined', 'unpublished', 'expired'];
      if(status.indexOf(req.body.status) > -1){
        var update_data ={
          'status':req.body.status,
          'declined_message':req.body.declined_message
        }
        eventService.updateData(update_data, req.body.event_id);
        if(req.body.status=='published'){
          var where =[{'id':req.body.user_id}]
          const user_data = userService.getUserDetails(where)
          user_data.then(function(user){ 
            if(user){
              var email_config=EMAIL_CONFIG['event_admin_approval'];
              var email_data = {
                'customer_name':user.first_name,
                'event_name':req.body.event_name
              }
              mailer.send_mail(user.email, email_config.subject, email_data, email_config.template_name);
            }
          });
        }
        else if(req.body.status=='declined'){
          var where =[{'id':req.body.user_id}]
          const user_data = userService.getUserDetails(where)
          user_data.then(function(user){ 
            if(user){
              var email_config=EMAIL_CONFIG['event_admin_declined'];
              var email_data = {
                'customer_name':user.first_name,
                'declined_message': req.body.declined_message,
                'event_name':req.body.event_name
              }
              mailer.send_mail(user.email, email_config.subject, email_data, email_config.template_name);
            }
          });
        }
        return res.send({
            status: true,
            message: "Status Updated Sucessfully"
        });
      }
      else {
        return res.send(encrypt({
              success: false,
              message: 'Invalid Status'
        }));
      }
  },
  async delete(req, res) {
    eventService.deleteEvents(decrypt(decode_id(req.params.id))).then(() => 
      res.send(encrypt({ "success": true, "message": "Deleted successfully." })))
      .catch((error) => res.status(400).send(error));
  },
  async search_event_list(req, res) {
    const { Events } = eventService.getSearchEventList(req.query)
      Events.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async event_detail(req, res){
    var where = {};
    where.id = req.query.event_id;
    where.status = 'published';
    const Events = models.events.findOne({
      where: where,
      include: [
        {
            model: models.event_tickets
        },
        {
            model: models.currencies
        },
        {
            model: models.event_schedule_details
        }
      ]
    });
    Events.then(function(data){
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
  },
  async my_event_list(req, res) {
    if(typeof req.params.user_id =='undefined' || req.params.user_id==''){
      return res.send(encrypt({
            success: false,
            message: 'user_id Field Is required'
      }));
    }
    const { Events } = eventService.getmyEventList(req.query, req.params.user_id)
      Events.then(data => {
        res.send(encrypt({ "success": true, "data": data.rows, "count": data.count }))
      })
    .catch(function(error){
        res.send(encrypt({ "success": false, "message": error }))
    })
  },
  async my_event_detail(req, res){
    if(typeof req.params.user_id =='undefined' || req.params.user_id==''){
        return res.send(encrypt({
              success: false,
              message: 'user_id Field Is required'
        }));
    }
    if(typeof req.params.id =='undefined' || req.params.id==''){
        return res.send(encrypt({
              success: false,
              message: 'id Field Is required'
        }));
     }
     var where = {};
     where.id = req.params.id;
     where.user_id = req.params.user_id;
     const Events = models.events.findOne({
      where: where,
      include: [
        {
            model: models.event_tickets
        },
        {
            model: models.currencies
        },
        {
            model: models.event_schedule_details
        }
      ]
    });
    Events.then(function(data){
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
  },
  async add_my_event(req, res) {

      // Required Fields
      var required_fields=[
        'name', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 'time_zone' , 
        'category_id', 'category_name','type', 'event_visibility', 'thumb_nail_img_dir', 
        'thumb_nail_img_name', 'img_dir', 'img_name', 'city', 'tags', 'venue_name', 
        'address_line_1',"currency_id", 'user_id', 'state', 'country', 'pincode'
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

      var dateTime = require('node-datetime');

      var event_tickets = [];
      req.body.event_tickets.forEach(function(ticket){
        ticket.slug = sluggable_behavior((ticket.name).toString().toLowerCase());
        event_tickets.push(ticket);
      });

      var country_id = '';
      var state_id = '';
      var city_id = '';

      // Save Country And GET ID
      country_id = await countryService.findOrSaveAndGetId(req.body.country);

      // Save State And GET ID
      state_id = await stateService.findOrSaveAndGetId(req.body.state, country_id);
      
      // Save City And GET ID
      city_id = await cityService.findOrSaveAndGetId(req.body.city, state_id, country_id);

      var start_date='';
      var end_date='';

      var dt = dateTime.create(req.body.start_date);
      var start_date = dt.format('Y-m-d');


      var dt = dateTime.create(req.body.end_date);
      var end_date = dt.format('Y-m-d');

      var post_data = {
          name: req.body.name,
          slug: slug,
          user_id:req.body.user_id,
          description:req.body.description,
          start_date:start_date,
          end_date:end_date,
          category_id:req.body.category_id,
          category_name:req.body.category_name,
          type:req.body.type,
          event_visibility:req.body.event_visibility,
          thumb_nail_img_dir:req.body.thumb_nail_img_dir,
          thumb_nail_img_name:req.body.thumb_nail_img_name,
          img_dir:req.body.img_dir,
          img_name:req.body.img_name,
          city:req.body.city,
          city_id:city_id,
          state:req.body.state,
          state_id:state_id,
          country:req.body.country,
          country_id:country_id,
          pincode:req.body.pincode,
          tags:req.body.tags,
          status:'waiting for approval',
          venue_name:req.body.venue_name,
          address_line_1:req.body.address_line_1,
          address_line_2:req.body.address_line_2,
          currency_id:req.body.currency_id,
          lat:req.body.lat,
          long:req.body.long,
          is_popular:req.body.is_popular,
          start_time:req.body.start_time,
          end_time:req.body.end_time,
          time_zone:req.body.time_zone,
          event_tickets:event_tickets,
          event_schedule_details:req.body.event_schedule_details
      }

      try
      {


        var include_models=[];

        include_models.push( {  
                 model: models.event_tickets,
                 as: 'event_tickets'
        });

        if(typeof req.body.event_schedule_details!='undefined' ){

            include_models.push( {  
                     model: models.event_schedule_details,
                     as: 'event_schedule_details'
            });
        }
        var event_details = models.events.create(post_data, {
          include: include_models
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
          success: true,
          message: "Events Added Sucessfully"
        });
      }
      catch(error) {
        console.log(error);
        return res.send({
            success: false,
            message: "Something Went Wrong While creating An Event",
        });
      }
  },
  async update_my_event(req, res) {

    // Required Fields
      var required_fields=[
        'id','name', 'description', 'start_date', 'end_date', 'category_id', 'category_name',
        'type', 'event_visibility', 'thumb_nail_img_dir', 'thumb_nail_img_name', 'img_dir', 
        'img_name', 'city', 'tags', 'venue_name', 'address_line_1',"currency_id", 
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


      var country_id = '';
      var state_id = '';
      var city_id = '';

      var start_date='';
      var end_date='';


      var dateTime = require('node-datetime');

      var dt = dateTime.create(req.body.start_date);
      var start_date = dt.format('Y-m-d');


      var dt = dateTime.create(req.body.end_date);
      var end_date = dt.format('Y-m-d');
      

      // Save Country And GET ID
      country_id = await countryService.findOrSaveAndGetId(req.body.country);

      // Save State And GET ID
      state_id = await stateService.findOrSaveAndGetId(req.body.state, country_id);
      
      // Save City And GET ID
      city_id = await cityService.findOrSaveAndGetId(req.body.city, state_id, country_id);

      var post_data = {
          name: req.body.name,
          slug: slug,
          description:req.body.description,
          start_date:start_date,
          end_date:end_date,
          category_id:req.body.category_id,
          category_name:req.body.category_name,
          type:req.body.type,
          event_visibility:req.body.event_visibility,
          thumb_nail_img_dir:req.body.thumb_nail_img_dir,
          thumb_nail_img_name:req.body.thumb_nail_img_name,
          img_dir:req.body.img_dir,
          img_name:req.body.img_name,
          tags:req.body.tags,
          venue_name:req.body.venue_name,
          address_line_1:req.body.address_line_1,
          address_line_2:req.body.address_line_2,
          is_popular:req.body.is_popular,
          currency_id:req.body.currency_id,
          city:req.body.city,
          city_id:city_id,
          state:req.body.state,
          state_id:state_id,
          country:req.body.country,
          country_id:country_id,
          pincode:req.body.pincode,
          lat:req.body.lat,
          long:req.body.long,
          start_time:req.body.start_time,
          end_time:req.body.end_time,
          time_zone:req.body.time_zone
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

                data.slug = sluggable_behavior((data.name).toString().toLowerCase());

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
              'event_id': req.body.id
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
              success: true,
              message: "Events Updated Sucessfully"
          });
      }
      catch(error){
        return res.send({
            success: false,
            message: "Something Went Wrong While updating an Event",
        });
      }
  },
  async auto_complete(req, res){
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    var q=req.query.q;
    var order_query = ['id', 'DESC']
    var where = {};
    where.deletedAt = null;
    where.status = 'published';
    where.event_visibility="public";
    if(req.query.city_id){
       where.city_id=req.query.city_id;
    }    
    where[Op.or] = [
      {'name':{ [Op.like]: '%' + q + '%' }},
      {'venue_name':{ [Op.like]: '%' + q + '%' }},
      {'category_name':{ [Op.like]: '%' + q + '%' }}
    ]
    const Events = await models.events.findAndCountAll({
      where: where,
      order: [order_query],
      limit:20,
      attributes:['id','name', 'city', 'state', 'slug', 'venue_name'],
      $sort: { id: 1 }
    });
    return res.send(encrypt({ "success": true, "data": Events.rows, "count":Events.count }));
  }
}