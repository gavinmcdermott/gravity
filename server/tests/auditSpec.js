var app           = require('../app');
var audit         = require('../audit');
var redisClient   = require('../redis').client;

var assert        = require('assert');
var request       = require('superagent');

describe('Audit Log Test', function(){
 
  beforeEach(function(){
    redisClient.flushdb();
  });
 
  afterEach(function(){
    redisClient.flushdb();
  });

  it('Get log events', function(done) {
    // Fake some data in redis
    redisClient.rpush(['logEvents', JSON.stringify({key:111}) ]);
    redisClient.rpush(['logEvents', JSON.stringify({key:222}) ]);

    request.get('http://localhost:3000/api/v1/events')
    .end(function(err, res) {
      if (err) {
        throw new Error(err);
      }
      assert.equal(2, res.body.length);
      // Set up a test object to work with
      var testObj = JSON.parse(res.body[0]);
      assert.equal(testObj.key, 111);
      done();
    });
  });

});
