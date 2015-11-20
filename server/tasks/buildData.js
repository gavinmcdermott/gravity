module.exports.build = function(redis) {
  console.log('building');
  redis.set('mykey', 'test');
  redis.get('mykey').then(function(d) { console.log(d)});
};