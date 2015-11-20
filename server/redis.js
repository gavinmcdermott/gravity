// Dependencies
var redis       = require('redis');
var config      = require('./config');

// Constants
var REDIS_URL   = config.REDIS_URL;

// Init instances
var redisClient = redis.createClient(REDIS_URL);

// Redis error handling
redisClient.on('error', function(err) {
  console.error("There was an error: ", err);
});

// Exposed API
module.exports.client = redisClient;
