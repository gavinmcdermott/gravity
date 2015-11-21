var app           = require('../app');
var audit         = require('../audit');
var redisClient   = require('../redis').client;

var assert        = require('assert');
var request       = require('supertest')(app.app);

describe('Audit Log Test', function(){

  // Fake data in redis
  var eventA = JSON.stringify({id: 'logEvents:1', key:1, audit: { suspicious: true } });
  var eventB = JSON.stringify({id: 'logEvents:2', key:2, audit: { suspicious: false } });
 
  beforeEach(function(){
    redisClient.flushdb();
    redisClient.sadd('logEvents', eventA);
    redisClient.sadd('logEvents', eventB);
    redisClient.hmset('logEvents:1', "event", eventA);
    redisClient.hmset('logEvents:2', "event", eventB);
  });
 
  afterEach(function(){
    redisClient.flushdb();
  });

  it('Get log events', function(done) {
    request.get('/api/v1/events')
    .end(function(err, res) {
      if (err) {
        throw new Error(err);
      }
      assert.equal(2, res.body.data.length);
      // Set up a test object to work with
      // newest member added is at the beginning
      var testObj = JSON.parse(res.body.data[0]);
      assert.equal(testObj.key, 2);
      done();
    });
  });

  it('Get suspicious log events', function(done) {
    request.get('/api/v1/events?suspicious=true')
    .end(function(err, res) {
      if (err) {
        throw new Error(err);
      }
      assert.equal(1, res.body.data.length);
      var testObj = JSON.parse(res.body.data[0]);
      assert.equal(testObj.key, 1);
      done();
    });
  });

  it('Updates a single log event', function(done) {
    var evtId = 'logEvents:2';
    var testComment = 'some comment :)';
    request.put('/api/v1/events/audit')
    .set('Content-Type',  'application/json')
    .send({ updates: [{ id: evtId, suspicious: false, comment: testComment }] })
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw new Error(err);
      }
      assert.equal(res.body.updated, 1);
      redisClient.hgetall(evtId, function(err, data) {
        var logItem = JSON.parse(data.event);
        assert.equal(logItem.audit.suspicious, false);
        assert.equal(logItem.audit.comment, testComment);
        done();
      });
    });
  });

  it('Updates multiple log events', function(done) {
    var evtIdA = 'logEvents:1';
    var evtIdB = 'logEvents:2';
    var testComment = 'another comment :)';
    request.put('/api/v1/events/audit')
    .set('Content-Type',  'application/json')
    .send({ updates: [
        { id: evtIdA, suspicious: false, comment: testComment },
        { id: evtIdB, suspicious: true, comment: testComment }
      ] 
    })
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw new Error(err);
      }
      assert.equal(res.body.updated, 2);
      redisClient.hgetall(evtIdB, function(err, data) {
        var logItem = JSON.parse(data.event);
        assert.equal(logItem.audit.suspicious, true);
        assert.equal(logItem.audit.comment, testComment);
        done();
      });
    });
  });
});
