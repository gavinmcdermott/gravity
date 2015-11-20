// Dependencies
var redisClient = require('./redis').client;
var q           = require('q');

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
  
  return q.Promise(function(resolve, reject) {
    redisClient.lrange('logEvents', start, limit, function(err, data) {
      if (err) {
        // TODO: Better error handling
        reject(res.json({ error: err }));
      }
      resolve(res.json(data));
    });
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
