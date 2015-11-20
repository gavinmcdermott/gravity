var assert        = require('assert');
var redisClient   = require('fakeredis').createClient('test');
var audit         = require('../audit');

describe('Audit Test', function(){
 
  beforeEach(function(){
    redisClient.flushall();
  });
 
  afterEach(function(){
    redisClient.flushall();
  });
   
  //all the tests go here
});