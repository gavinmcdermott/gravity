// Environment config
var ENV = {
  REDISURL: 'redis://localhost:6379',
  PORT: 3000
};

/**
 * Sets relevant environment variables
 *
 * @param {variable} string Environment variable we're looking for
 * @param {value} string || number Environment variable's value
 * @return {string || number} If exists, the value of environment variable
 */
function setEnv(variable, value) {
  if (!variable || !value) {
    throw new Error('Cannot initialize: ', variable);
  }
  if (process.env[variable]){
    throw new Error('You\'re overwriting the environment variable: ', variable);
  }
  process.env[variable] = value;
  return process.env[variable];
}

/**
 * Gets relevant environment variables
 *
 * @param {variable} string Environment variable we're looking for
 * @return {string} If exists, the value of environment variable
 */
function getEnv(variable) {
  if (process.env[variable] === undefined){
    throw new Error('You must create an environment variable for ', variable);
  }
  return process.env[variable];
};

// Set up the environment
setEnv('REDISURL', ENV.REDISURL);
setEnv('PORT', ENV.PORT);

// Set up an exposable config object
var config = {
  PORT: getEnv('PORT'),
  REDISURL: getEnv('REDISURL')
};
 
module.exports = config;
