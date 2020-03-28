import {
  filter,
} from 'lodash';

 /**
 * A global hook which is applied to every model's create, update and destroy lifecycle
 * methods. Once one of those lifecycle event's occurs, this function iterates over
 * every other model definition looking for cache columns which point to the triggering
 * model. If any models are found, their cache counter coulmns are then updated.
 *
 * @param  {Object} models The Sequelize models object containing all model definitions.
 * @return {undefined}     Nothing is ever returned;
 */
const counterCache = (models) =>
  async (instance, options, next) => {
    // Get the model name of the instance
    const type = instance.$modelOptions.name.singular;
    
     await Promise.all(Object.keys(models).map(async (key) => {
      if (models[key].options.cacheColumns) {
        // Get all cache columns for the model
        let cacheColumns = models[key].options.cacheColumns(models);
        
         // Filter cache columns to only those that reference the instance's model type
        cacheColumns = filter(cacheColumns, (cc) => cc.model === type);
        
        await Promise.all(cacheColumns.map(async (cacheColumn) => {
          // Make the count to store in the cache
          const count = await models[cacheColumn.model].count({
            where: Object.assign({}, { [cacheColumn.foreignKey]: instance[cacheColumn.foreignKey] }, cacheColumn.where),
          });
          
           // Store the count in the cache
          await models[key].update(
            { [cacheColumn.column]: count },
            { where: { id: instance[cacheColumn.foreignKey] } }
          );
        }));
      }
    }));
    
    return next();
  };

 export default counterCache;
