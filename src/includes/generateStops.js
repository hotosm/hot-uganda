'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (layer, timefield) {
  var data = [];
  var osmIDs = [];
  var periods = [];
  var clusters = layer.categories.clusters;
  var colors = getColorBrewerColor(layer.categories.color, clusters) || layer.categories.color;
  var rows = layer.source.data.features || layer.source.data;
  var isGeoJSON = layer.source.data.features;
  var geoJSONWithOSMKey = isGeoJSON && layer.source.join[1];
  var limit = layer.categories.limit;
  var radiusRange = layer['radius-range'];

  for (var i = 0; i < rows.length; i += 1) {
    if (isGeoJSON) {
      data.push(Number(rows[i].properties[layer.property]));
      if (geoJSONWithOSMKey) {
        osmIDs.push(rows[i].properties[layer.source.join[1]]);
      }
    } else {
      periods.push(rows[i][timefield]);
      data.push(Number(rows[i][layer.property]));
      osmIDs.push(rows[i][layer.source.join[1]]);
    }
  }

  return getStops({ data: data, colors: colors, osmIDs: osmIDs, periods: periods, limit: limit, clusters: clusters, radiusRange: radiusRange });
};

var _colorbrewer = require('colorbrewer');

var _colorbrewer2 = _interopRequireDefault(_colorbrewer);

var _simpleStatistics = require('simple-statistics');

var _simpleStatistics2 = _interopRequireDefault(_simpleStatistics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultRadiusRange = ['3', '6', '9', '12', '15', '18', '21', '24', '27', '30'];

var getColorBrewerColor = function getColorBrewerColor(c, numColors) {
  if (_colorbrewer2.default[c]) {
    return _colorbrewer2.default[c][numColors];
  }
  return c;
};
var getColor = function getColor(c, i) {
  if (c instanceof Array) {
    return c[i];
  }
  return c;
};

function getStops(layer) {
  var colorsStops = [];
  var radiusStops = [];
  var radius = layer.radiusRange || defaultRadiusRange;
  var breaks = [];

  // Sort data based on data value
  var list = layer.data.map(function (x, i) {
    return {
      data: x,
      osmIDs: layer.osmIDs[i],
      periods: layer.periods[i]
    };
  }, this);
  list.sort(function (a, b) {
    return a.data < b.data ? -1 : a.data === b.data ? 0 : 1;
  });
  var sortedData = list.map(function (items) {
    return items.data;
  });
  var osmID = list.map(function (items) {
    return items.osmIDs;
  });
  var period = list.map(function (items) {
    return items.periods;
  });

  // Sort for limit data based on osmIDs
  var dataList = layer.osmIDs.map(function (x, i) {
    return {
      osmIDs: x,
      data: layer.data[i],
      periods: layer.periods[i]
    };
  }, this);
  dataList.sort(function (a, b) {
    return a.osmIDs < b.osmIDs ? -1 : a.osmIDs === b.osmIDs ? 0 : 1;
  });
  var rangeData = dataList.map(function (l) {
    return l.data;
  });
  var rangeID = dataList.map(function (l) {
    return l.osmIDs;
  });
  var rangePeriod = dataList.map(function (l) {
    return l.periods;
  });

  // Split the data into nClusters
  var cluster = layer.clusters ? _simpleStatistics2.default.ckmeans(sortedData, layer.clusters) : null;
  breaks = layer.limit ? layer.limit : cluster.map(function (cl) {
    return cl[cl.length - 1];
  });
  var OSMIDsExist = layer.osmIDs && layer.osmIDs.length !== 0;
  var data = layer.limit ? rangeData : sortedData;
  var osmIDs = layer.limit ? rangeID : osmID;

  // Assign colors and radius to osmId or data value
  for (var k = 0; k < data.length; k += 1) {
    for (var i = 0; i < breaks.length; i += 1) {
      if (data[k] <= breaks[i]) {
        colorsStops.push([OSMIDsExist ? osmIDs[k] : data[k], getColor(layer.colors, i)]);
        radiusStops.push([OSMIDsExist ? osmIDs[k] : data[k], Number(radius[i])]);
        break;
      }
    }
  }

  if (layer.periods) {
    var uniqPeriods = [].concat(_toConsumableArray(new Set(layer.periods)));
    var periodStops = [];
    var periodRadius = [];
    var periodStroke = [];
    for (var j = 0; j < uniqPeriods.length; j += 1) {
      periodStops[j] = [];
      periodRadius[j] = [];
      periodStroke[j] = [];
    }
    var periodProp = layer.limit ? rangePeriod : period;
    for (var m = 0; m < periodProp.length; m += 1) {
      for (var n = 0; n < uniqPeriods.length; n += 1) {
        if (periodProp[m] === uniqPeriods[n]) {
          periodStops[n].push(colorsStops[m]);
          periodRadius[n].push(radiusStops[m]);
          periodStroke[n].push([radiusStops[m][0], 1]);
        }
      }
    }
    return [periodStops, periodRadius, uniqPeriods, breaks, layer.colors, periodStroke];
  }
  return [];
}


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/includes/generateStops.js