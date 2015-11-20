// Pull in dependencies
var config      = require('./config');
var express     = require('express');
var path        = require('path');
var promise     = require('bluebird');
// var redis       = require('redis');
var redis       = require('promise-redis')();

// Constants
var PORT        = config.PORT;
var REDIS_URL   = config.REDIS_URL;

// Initialize needed objects
var app         = express();
var redisClient = redis.createClient(REDIS_URL);




// Redis error handler
redisClient.on('error', function(err) {
  console.error("+++++++++++", err);
});














// Set up relevant paths for responses
var staticPath  = path.resolve(__dirname, '../client');
var indexPath   = path.resolve(__dirname, '../client/index.html');

// Public API
app.get('/api/v1/events', function (req, res) {
  // res.sendFile(indexPath);
});

// Serve static files
app.use(express.static(staticPath));

// App navigation
app.get('/', function (req, res) {
  res.sendFile(indexPath);
});

// Start our app
app.listen(PORT, function () {
  var host = this.address().address;
  var port = this.address().port;
  console.log('Listening at http://%s:%s', host, port);


  redisClient.set('mykey', 'myvalue')
    .then(console.log)
    .catch(console.log);

});
