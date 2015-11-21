// Dependencies
var _           = require('lodash');
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
  var limit = (req.query && req.query.limit && req.query.limit <= 100) ? req.query.limit : 100;
  var start = (req.query && req.query.start) || 0;
  // TODO: type sanity
  var suspiciousOnly = (req.query && req.query.suspicious) || false;

  return q.Promise(function(resolve, reject) {
    redisClient.smembers('logEvents', function(err, data) {
      if (err) {
        // TODO: Better error handling
        reject(res.json({ error: err }));
      }
      var result;
      if (suspiciousOnly) {
        result = _.filter(data, function(d) {
          var logItem = JSON.parse(d);
          return logItem.audit.suspicious === true;
        });
      } else {
        result = data;
      }
      resolve(res.json({ data: result }));
    });
  });
};

/**
 * Update log events
 *
 * @param {req} object Express request object
 * @param {res} object Express response object
 * @return {json} json blob
 */
module.exports.updateAuditEvents = function(req, res) {
  var updates = req.body.updates;
  // naive way to check for num updates
  var updateCounter = 0
  // naive error
  var updateErr;
  
  return q.Promise(function(resolve, reject) {
    _.forEach(updates, function(logItem) {
      redisClient.hgetall(logItem.id, function(err, data) {
        // There is a lot we can do better here for error handling and data / 
        // param sanitization for safety :)
        var parsed = JSON.parse(data.event);
        parsed.audit.suspicious = logItem.suspicious;
        parsed.audit.comment = logItem.comment;
        redisClient.hmset(parsed.id, "event", JSON.stringify(parsed), function(err) {
          if (err) {
            reject(res.json({ error: err }));
          } else {
            updateCounter++;
            if (updateCounter == updates.length) {
              resolve(res.json({ success: true, updated: updateCounter }) );
            }
          }
        });
      });
    });
  });
};
