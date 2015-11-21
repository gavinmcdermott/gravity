# Audit Log

Before attempting to set up and run the app you'll need the following:
  - Redis: [download](http://redis.io/) 
  - Node.js: [download](https://nodejs.org/en/); recommended install with [Homebrew](http://brew.sh/) 
  - NPM: [download](https://www.npmjs.com/)

### Version
0.0.1

### Installation

With the above dependencies accounted for, from the root directory run:

```sh
$ npm install
```

To run the API tests:

```sh
$ npm test
```


To run the app:

```sh
$ npm start
```


### Etc.

- why Redis instead of mongo (tailable cursor, merges, etc.)
- why no socket (no live view yet)
- comments galore throughout :)
