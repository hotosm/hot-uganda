'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRgbA = exports.debounce = exports.isNewSeriesData = exports.isLoggedIn = undefined;
exports.formatNum = formatNum;
exports.getLastIndex = getLastIndex;

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as d3 from 'd3';

function formatNum(num, decimal) {
  var x = ('' + num).length;
  if (Number.isInteger(num) && x > 3) {
    var pow = Math.pow(10, decimal);
    x -= x % 3;
    return Math.round(num * pow / Math.pow(10, x)) / pow + ' kMGTPE'[x / 3];
  }
  return num;
}

function getLastIndex(arr, item) {
  var indices = [];

  for (var i = 0; i < arr.length; i += 1) {
    if (arr[i] === item) {
      indices.push(i);
    }
  }
  return indices[indices.length - 1];
}

var isLoggedIn = exports.isLoggedIn = function isLoggedIn() {
  return _jsCookie2.default.get('dsauth') === 'true';
};

var isNewSeriesData = exports.isNewSeriesData = function isNewSeriesData(oldArr, newArr) {
  // check for different numbers of objects
  if (oldArr.length !== newArr.length) return true;
  var i = 0;
  var k = 0;
  var keys = [];
  // loop through all objects
  for (i; i < oldArr.length; i += 1) {
    // define keys of old object
    keys = Object.keys(oldArr[0]);
    // check for different number of keys
    if (keys.length !== Object.keys(newArr[0]).length) return true;
    // loop through all keys of object
    for (k; k < keys.length; k += 1) {
      // check for presence of key on new obj
      if (typeof newArr[i][keys[k]] === 'undefined') return true;
      // check for different key/values
      if (oldArr[i][keys[k]] !== newArr[i][keys[k]]) return true;
    }
    // reset key iterator
    k = 0;
  }
  return false;
};

var debounce = exports.debounce = function debounce(func, wait, now) {
  var timeout = void 0;
  return function deb() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = this;
    var later = function later() {
      timeout = null;
      if (!now) func.apply(context, args);
    };
    var callNow = now && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// adapted from https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
var hexToRgbA = exports.hexToRgbA = function hexToRgbA(hex, alpha) {
  var c = void 0;
  var a = alpha || alpha === 0 ? alpha : 1;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = [[c[0], c[1]].join(''), [c[2], c[3]].join(''), [c[4], c[5]].join('')];
    return 'rgba(' + parseInt(c[0], 16) + ', ' + parseInt(c[1], 16) + ', ' + parseInt(c[2], 16) + ', ' + a + ')';
  }
  throw new Error('Bad Hex');
};


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/includes/utils.js