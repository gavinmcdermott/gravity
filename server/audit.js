// Dependencies
var _           = require('lodash');
var redisClient = require('./redis').client;
// TODO: Promisify this whole thing

// Constants
var FETCH_PREFIX = "logEvents";

/**
 * Get all events from the log
 *
 * @param {req} object Express request object
 * @param {res} object Express response object
 * @return {json} json blob
 */
module.exports.getEvents = function(req, res) {
  var limit = (req.query && req.query.limit && req.query.limit <= 99) ? req.query.limit : 99;
  var start = (req.query && req.query.start) || 0;
  // TODO: better type sanity checking
  var suspiciousOnly = (req.query && req.query.suspicious) || false;

  redisClient.lrange(FETCH_PREFIX, start, limit, function(err, fetchIds) {
    if (err) {
      // TODO: Better error handling
      return res.json({ error: err });
    }
    // Prepare a multistep async redis getter
    var allResults = [];
    var multi = redisClient.multi();
    _.forEach(fetchIds, function(fetchId) {
      multi.hgetall(fetchId, function(err, data) {
        var item = JSON.parse(data.data);
        if (suspiciousOnly) {
          if (item.audit.suspicious) {
            allResults.push(item);
          }
        } else {
          allResults.push(item);
        } 
      });
    });
    // Execute the fetches
    multi.exec(function(err) {
      if (err) {

        res.json({ error: err });
      }
      res.json({ data: allResults });
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
  var updateCounter = 0
  
  // Prepare a multistep async redis getter
  var multi = redisClient.multi();
  _.forEach(updates, function(logItem) {
    multi.hgetall(FETCH_PREFIX + ":" + logItem.id, function(err, data) {
      // There is a lot we can do better here for error handling and data / 
      // param sanitization for safety :)
      var newLogItem = data && JSON.parse(data.data);
      if (!newLogItem) {
        return;
      }
      newLogItem.audit.suspicious = logItem.suspicious;
      newLogItem.audit.comment = logItem.comment;
      
      redisClient.hmset(FETCH_PREFIX + ":" + newLogItem.id, "data", JSON.stringify(newLogItem), function(err, data) {
        updateCounter++;
      });
    });
  });

  // Execute the fetches
  multi.exec(function(err, data) {
    if (err) {
      res.json({ error: err });
    }
    res.json({ success: true, updated: data.length });
  });
};
