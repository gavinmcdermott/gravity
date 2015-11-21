var app           = require('../app');
var audit         = require('../audit');
var redisClient   = require('../redis').client;
var mock          = require('../tasks/buildData');

var assert        = require('assert');
var request       = require('supertest')(app.app);

describe('Audit Log Test', function(){
  var fetchPrefix = "logEvents";
  // Fake data in redis
  var eventA = mock.getAuthLogItem();
  // force one to be suspicious
  eventA.audit.suspicious = true;
  
  var eventB = mock.getSessionLogItem();
  eventB.audit.suspicious = false;
 
  beforeEach(function(){
    redisClient.flushdb();

    redisClient.hmset(fetchPrefix+ ':' + eventA.id, "data", JSON.stringify(eventA));
    redisClient.lpush(fetchPrefix, fetchPrefix + ':' + eventA.id);
    
    redisClient.hmset(fetchPrefix+ ':' + eventB.id, "data", JSON.stringify(eventB));
    redisClient.lpush(fetchPrefix, fetchPrefix + ':' + eventB.id);
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
      // newest list member added is at the beginning
      var testObj = res.body.data[0];
      assert.equal(testObj.id, eventB.id);
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
      var testObj = res.body.data[0];
      assert.equal(testObj.id, eventA.id);
      done();
    });
  });

  it('Updates a single log event', function(done) {
    var testComment = 'some comment :)';
    request.put('/api/v1/events/audit')
    .set('Content-Type',  'application/json')
    .send({ updates: [{ id: eventA.id, suspicious: false, comment: testComment }] })
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw new Error(err);
      }
      assert.equal(res.body.updated, 1);
      redisClient.hgetall(fetchPrefix+ ':' + eventA.id, function(err, data) {
        var logItem = JSON.parse(data.data);
        assert.equal(logItem.audit.suspicious, false);
        assert.equal(logItem.audit.comment, testComment);
        done();
      });
    });
  });

  it('Updates multiple log events', function(done) {
    var testComment = 'another comment :)';
    request.put('/api/v1/events/audit')
    .set('Content-Type',  'application/json')
    .send({ updates: [
        { id: eventA.id, suspicious: false, comment: testComment },
        { id: eventB.id, suspicious: true, comment: testComment }
      ] 
    })
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw new Error(err);
      }
      assert.equal(res.body.updated, 2);
      redisClient.hgetall(fetchPrefix+ ':' + eventB.id, function(err, data) {
        var logItem = JSON.parse(data.data);
        assert.equal(logItem.audit.suspicious, true);
        assert.equal(logItem.audit.comment, testComment);
        done();
      });
    });
  });
});
