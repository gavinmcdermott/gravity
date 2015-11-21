// Dependencies
var auditAPI    = require('./audit');
var bodyParser  = require('body-parser');
var config      = require('./config');
var cors        = require('cors');
var express     = require('express');
var path        = require('path');
var redisClient = require('./redis').client;
var dataBuilder = require('./tasks/buildData');

// Constants
var PORT        = config.PORT;

// Initialize the app with appropriate middleware
var app         = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// app.use(cors());

// Set up relevant paths for responses
var staticPath  = path.resolve(__dirname, '../client');
var indexPath   = path.resolve(__dirname, '../client/index.html');

// Public API
app.get('/api/v1/events', auditAPI.getEvents);
app.put('/api/v1/events/audit', auditAPI.updateAuditEvents);

// Static files
app.use(express.static(staticPath));

// Client app navigation
app.get('/', function (req, res) {
  res.sendFile(indexPath);
});

// Start the app
app.listen(PORT, function () {
  var hostData = this.address();
  console.log('Listening at addr:', hostData);
  // Build demo data
  dataBuilder.build();
});

module.exports.app = app;









// wipe data setup during tests
process.on('exit', function() {
  console.log('Node exiting...');
  redisClient.flushdb();
  redisClient.flushall();
});
