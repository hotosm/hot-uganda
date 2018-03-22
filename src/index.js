'use strict';

module.exports = {};

var gisida = module.exports;

gisida.version = require('../package.json').version;
gisida.Map = require('./components/Map/Map').default;
gisida.Dashboard = require('./Dashboard').default;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/index.js