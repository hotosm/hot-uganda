'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (layerData, locations, filterOptions) {
  var data = layerData.mergedData;
  var aggregatedData = [];
  // merge OSM Ids
  if (layerData['merge-locations']) {
    data.map(function (datum) {
      var row = datum;
      if (!datum.district_id) {
        // add district_id if not defined
        row.district_id = locations[datum.District];
        if (!datum.district_id) {
          // Use alternative district field
          row.district_id = locations[datum['survey_intro/District_miss']];
        }
        if (!datum.district_id) {
          // Use alternative region miss field
          row.district_id = locations[datum['survey_intro/Region_miss']];
        }
      }
      return row;
    });
  }
  layerData.mergedData = data.filter(function (datum) {
    return datum.district_id !== undefined;
  });

  // Process filters with filterOptions
  data = (0, _filterUtils.processFilters)(layerData, filterOptions);
  // aggregate raw data
  aggregatedData = milia.stats.aggregate_data(data, layerData.property, layerData.aggregate);
  return aggregatedData;
};

var _filterUtils = require('./filterUtils');


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/includes/aggregateData.js