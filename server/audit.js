// Dependencies
var redisClient    = require('./redis').client;

/**
 * Get all events from the log
 *
 * @param {req} object Express request object
 * @param {res} object Express response object
 * @return {json} json blob
 */
module.exports.getEvents = function(req, res) {
  var limit = (req.params && req.params.limit && req.params.limit <= 100) ? req.params.limit : 100;
  var start = (req.params && req.params.start) || 0;
  return redisClient.lrange('logEvents', start, limit)
    .then(function(data) {
      console.log("foo: ", data);
      redisClient.flushall();
      return res.json(data);
    })
    .catch(function(error) {
      // log error
      console.log('ERR');
      return res.json(error);
    });
};

/**
 * Update a log event
 *
 * @param {req} object Express request object
 * @param {res} object Express response object
 * @return {json} json blob
 */
module.exports.updateAuditEvent = function(req, res) {

};
