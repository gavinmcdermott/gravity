var redis       = require('promise-redis')();
var config      = require('./config');

var REDIS_URL   = config.REDIS_URL;

var redisClient = redis.createClient(REDIS_URL);

// Redis error handler
redisClient.on('error', function(err) {
  console.error("+++++++++++", err);
});

module.exports.client = redisClient;
