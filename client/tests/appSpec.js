// A tiny testing framework :)
(function(global) {

  var test;
  var assert;

  var lib = global.lib;

  test = function test(name, fn) {
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('New Test Group: ', name);
    console.log('--------------------------------------------------');
    console.log('');
    console.log('...starting tests....');
    try {
      fn();
      console.log('');
      console.log('--------------------------------------------------');
      console.log('Hooray! Your test group passed!');
    } catch(e) {
      console.log('Your test group failed....sorry man.');
      console.log("Reason: ", e);
    }    
    console.log('End Test Group');
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('');
    console.log('');
    console.log('');
  };

  assert = function assert(value, statement) {
    if (value) {
      console.log('Test passed: ', statement);
      return true;
    }
    console.log('Test failed: ', statement);
    throw new Error(statement);
  };

  // At least one specs
  test('Angular Exists', function() {
    function angularExists() {
      return typeof(angular === 'object');
    };
    assert(angularExists(), "angular was instantiated");
  });

})(window);