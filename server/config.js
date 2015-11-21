// An exposable environment config object
var config = {};

// Environment configuration values
// TODO: set up test instance and prod 
var ENV = {
  REDIS_URL: 'redis://localhost:6379',
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
setEnv('REDIS_URL', ENV.REDIS_URL);
setEnv('PORT', ENV.PORT);

// Set up our (little) exposable config object
config.PORT = getEnv('PORT');
config.REDIS_URL = getEnv('REDIS_URL');
 
module.exports = config;
