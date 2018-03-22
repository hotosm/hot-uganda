'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _App = require('./components/App/App');

var _App2 = _interopRequireDefault(_App);

var _Login = require('./components/Login/Login');

var _Login2 = _interopRequireDefault(_Login);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./includes/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.$ = _jquery2.default;
window.jQuery = _jquery2.default;
window.React = _react2.default;

require('bootstrap-loader');

var Dashboard = function Dashboard(options) {
  _classCallCheck(this, Dashboard);

  var container = document.getElementById(options.APP.container);
  var config = Object.assign({}, _config2.default, options);

  var sectorData = [];
  Object.keys(config.SECTORS).forEach(function (key) {
    sectorData.push({ sector: key, layers: config.SECTORS[key].layers });
  });

  if ((0, _utils.isLoggedIn)() || !config.APP.password) {
    (0, _reactDom.render)(_react2.default.createElement(_App2.default, {
      sectorData: sectorData,
      layerData: config.LAYERS,
      styles: config.STYLES,
      appConfig: config.APP,
      locations: config.LOCATIONS,
      summary: config.SUMMARY
    }), container);
  } else {
    (0, _reactDom.render)(_react2.default.createElement(_Login2.default, { appConfig: config.APP }), container);
  }
};

exports.default = Dashboard;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/Dashboard.jsx