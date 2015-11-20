// Dependencies
var redis    = require('./redis');

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

  return redis.client.lrange('logEvents', start, limit)
    .then(function(data) {
      return res.json(data);
    })
    .catch(function(error) {
      // log error
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
