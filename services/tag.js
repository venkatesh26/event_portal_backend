const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const FindOrSave = function(name, slug) {
  var where ={}
  where.slug = slug;
  const data = models.tags.findOne({
     where: where
  });
  return data.then(function(data){

  	    if(typeof data !='undefined' && data && data){
  	    	return data.id;
  	    }		
  		var tags_data = {};
  		tags_data.name = name;
  		tags_data.slug = slug;
  		var tags_data = models.tags.create(tags_data);
  		return tags_data.then(function(data){
  			return data.id;
  		});
  });
}	
module.exports = {
	FindOrSave
}