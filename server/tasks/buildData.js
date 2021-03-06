// The sole purpose of this file is just to build test data for the app
var redis    = require('../redis');
var uuid     = require('node-uuid');

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRand(low, high) {
  return Math.floor(Math.random() * (high - low + high) + low);
}

function generateId() {
  return uuid.v4();
}

function generateAuditData() {
  return {
    suspicious: getRand(0, 1) === 1 ? true : false,
    comment: getRand(0, 1) === 1 ? "some comment here" : ""
  };
}

module.exports.getSessionLogItem = function() {
  return {
    type: 'session.log',
    id: generateId(),
    time: new Date().toISOString(),
    audit: generateAuditData(),
    event: { 
      user: 'bob',
      commands: [{
        command: 'ps aux | grep Gavin',
        output: new Buffer("This is a base64 encoded string").toString('base64'),
        code: 451
      }]
    }
  }
}

module.exports.getAuthLogItem = function() {
  return {
    type: 'auth.attmept',
    id: generateId(),
    time: new Date().toISOString(),
    audit: generateAuditData(),
    event: {
      user: 'terry',
      success: getRand(0, 1) === 1 ? true : false,
      error: 'some error string here',
      addr: '192.168.1.1',
      raddr: '192.168.1.2'
    }
  }
}

// TODO: fake live events
module.exports.build = function() {
  var iter = 0;
  while (iter < 30) {
    var logItem = getRand(0, 1) === 0 ? module.exports.getAuthLogItem() : module.exports.getSessionLogItem(); 
    var prefix = 'logEvents';
    redis.client.hmset( prefix + ':' + logItem.id, 'data', JSON.stringify(logItem));
    redis.client.lpush('logEvents', prefix + ':' + logItem.id);
    iter++;
  }
};
