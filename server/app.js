// Dependencies
var auditAPI    = require('./audit');
var config      = require('./config');
var express     = require('express');
var path        = require('path');
var promise     = require('bluebird');
var redisClient = require('./redis');
var dataBuilder = require('./tasks/buildData');

// Constants
var PORT        = config.PORT;

// Initialize needed objects
var app         = express();

// Set up relevant paths for responses
var staticPath  = path.resolve(__dirname, '../client');
var indexPath   = path.resolve(__dirname, '../client/index.html');

// Public API
app.get('/api/v1/events', auditAPI.getEvents);
app.put('/api/v1/events/:eventId/audit', auditAPI.updateAuditEvent);

// Static files
app.use(express.static(staticPath));

// Client app navigation
app.get('/audit', function (req, res) {
  res.sendFile(indexPath);
});

// Start the app
app.listen(PORT, function () {
  var hostData = this.address();
  console.log('Listening at addr:', hostData);

  // Build demo data
  dataBuilder.build();
  auditAPI.getEvents({},{});
});










// wipe data setup during tests
process.on('exit', function() {
  redisClient.flushall();
});
