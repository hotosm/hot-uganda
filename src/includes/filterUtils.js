'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processFilters = processFilters;
exports.generateFilterOptionsPrev = generateFilterOptionsPrev;
exports.generateFilterOptions = generateFilterOptions;
exports.filterDataByPeriod = filterDataByPeriod;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isDebug = window.location.search.indexOf('debug') !== -1 && window.location.search.indexOf('filter') !== -1;

function processFilters(layerData, filterOptions) {
  var data = layerData.mergedData || layerData.source.data;
  if (isDebug) {
    console.log('full data count: ' + data.length);
  }
  var acceptedFilterValues = layerData.aggregate['accepted-filter-values'].map(function (f) {
    return f.trim().toLowerCase();
  });
  var acceptedSubFilterValues = layerData.aggregate['accepted-sub-filter-values'].map(function (f) {
    return f.trim().toLowerCase();
  });
  var filters = [];
  var failedFilter = {};
  var failedSubFil = {};

  if (layerData.aggregate.filter && filterOptions) {
    // Get array of disabled filters
    Object.keys(filterOptions).forEach(function (opt) {
      if (filterOptions[opt] === false) {
        filters.push(opt.trim().toLowerCase());
      }
    });

    var filterVal = void 0;
    var subFilterVal = void 0;

    // apply filters
    data = data.filter(function (datum) {
      filterVal = datum[layerData.aggregate.filter] && datum[layerData.aggregate.filter].trim().toLowerCase();
      subFilterVal = datum[layerData.aggregate['sub-filter']] && datum[layerData.aggregate['sub-filter']].trim().toLowerCase();

      // Previous filtering functionality
      // if (acceptedFilterValues
      //   && acceptedSubFilterValues
      //   && !acceptedSubFilterValues.includes(subFilterVal)) {
      //   // remove rows that should be filtered out, ignore rows with values from second filter field
      //   return !filters.includes(filterVal);

      // } else if (acceptedSubFilterValues
      //   && acceptedSubFilterValues.includes(subFilterVal)) {
      //   // remove rows that should be filtered out, ignore rows with values from first filter field
      //   return !filters.includes(subFilterVal);

      // } else if (!acceptedFilterValues && !acceptedSubFilterValues) {
      //   return !filters.includes(filterVal);
      // }

      // return true
      // if no accepted-(sub)filters are defined, only check if filter val is not excluded
      if (!acceptedFilterValues && !acceptedSubFilterValues && !filters.includes(filterVal) && !filters.includes(subFilterVal)) {
        return true;

        // if datum subfilter val is not accepted and filter val is accepted and is not excluded
      } else if (acceptedFilterValues && acceptedSubFilterValues && !acceptedSubFilterValues.includes(subFilterVal) && acceptedFilterValues.includes(filterVal) && !filters.includes(filterVal)) {
        return true;

        // if datum subfilter val is accepted and not excluded
      } else if (acceptedSubFilterValues && acceptedSubFilterValues.includes(subFilterVal) && !filters.includes(subFilterVal)) {
        return true;
      }

      if (isDebug) {
        if (!failedFilter[datum[layerData.aggregate.filter]]) {
          failedFilter[datum[layerData.aggregate.filter]] = 0;
        }
        if (!failedSubFil[datum[layerData.aggregate['sub-filter']]]) {
          failedSubFil[datum[layerData.aggregate['sub-filter']]] = 0;
        }

        failedFilter[datum[layerData.aggregate.filter]] += 1;
        failedSubFil[datum[layerData.aggregate['sub-filter']]] += 1;
      }

      return false;
    });
  }
  if (isDebug) {
    console.log('filtered data count: ' + data.length);
    console.log('failed filters', failedFilter);
    console.log('failed sub filters', failedSubFil);
  }
  return data;
}

function generateFilterOptionsPrev(layerData) {
  var _ref;

  var data = layerData.mergedData || layerData.source.data;
  var acceptedFilterValues = layerData.aggregate['accepted-filter-values'];
  var acceptedSubFilterValues = layerData.aggregate['accepted-sub-filter-values'];
  var filters = (_ref = []).concat.apply(_ref, [acceptedFilterValues, acceptedSubFilterValues]);
  return [].concat(_toConsumableArray(new Set(filters)));
  // get filter options from filter field
  // if (layerData.aggregate.filter) {
  //   const filterValues = data.map(datum => datum[layerData.aggregate.filter] && datum[layerData.aggregate.filter].trim().toLowerCase());
  //   const subfilterValues = data.map(datum => datum[layerData.aggregate['sub-filter']] && datum[layerData.aggregate['sub-filter']].trim().toLowerCase());
  //   let allFilters = [].concat(...[filterValues, subfilterValues]);

  //   allFilters = allFilters.filter(datum => datum !== undefined);
  //   // check filter values are in accepted values lists, remove those that are not
  //   let acceptedFilters = [];
  //   if (acceptedFilterValues || acceptedSubFilterValues) {
  //     acceptedFilters = allFilters.filter(datum =>
  //       (datum !== undefined &&
  //         [].concat(...[acceptedFilterValues, acceptedSubFilterValues]).includes(datum)));
  //   } else acceptedFilters = allFilters;
  //   return [...new Set(acceptedFilters)];
  // }
}

function generateFilterOptions(layerData) {
  var data = layerData.mergedData || layerData.source.data;
  // if it's geojson data, set use features array
  if (data.type) {
    data = data.features;
  }
  var filterOptions = {};
  var filter = void 0;
  var filterLabel = void 0;
  var acceptedFilterValues = void 0;
  var d = void 0;
  var datum = void 0;

  // loop through all filters
  for (var f = 0; f < layerData.aggregate.filter.length; f += 1) {
    // define filter, subFilter, and filter label
    filter = layerData.aggregate.filter[f];
    filterLabel = layerData.aggregate['filter-label'][f] && layerData.aggregate['filter-label'][f].length ? layerData.aggregate['filter-label'][f] : filter;

    // define unique filter and sub-filter values on filterOptions object
    filterOptions[filter] = {
      label: filterLabel,
      filterValues: {}
    };
  }

  var doPushDatum = void 0;
  for (d = 0; d < data.length; d += 1) {
    datum = data[d].geometry && data[d].properties ? data[d].properties : data[d];
    doPushDatum = true;

    // loop through the fiters and see if datum passes filter requirements
    for (var _f = 0; _f < layerData.aggregate.filter.length; _f += 1) {
      filter = layerData.aggregate.filter[_f];
      acceptedFilterValues = layerData.aggregate['accepted-filter-values'] && layerData.aggregate['accepted-filter-values'][_f];

      if (!!acceptedFilterValues && typeof acceptedFilterValues !== 'string') {
        if (acceptedFilterValues.indexOf(datum[filter]) === -1) {
          doPushDatum = false;
          break;
        }
      }
    }

    if (doPushDatum) {
      for (var _f2 = 0; _f2 < layerData.aggregate.filter.length; _f2 += 1) {
        filter = layerData.aggregate.filter[_f2];
        if (datum[filter] !== '') {
          if (!filterOptions[filter].filterValues[datum[filter]]) {
            filterOptions[filter].filterValues[datum[filter]] = 0;
          }
          filterOptions[filter].filterValues[datum[filter]] += 1;
        }
      }
    }
  }

  return filterOptions;
}

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function filterDataByPeriod(layerData, periodField, period) {
  var periods = period ? [period] : layerData.map(function (datum) {
    return datum[periodField];
  });
  if (!period) periods = Array.from(new Set(periods));

  if (months.indexOf(periods[0]) !== false) {
    periods.sort(function (a, b) {
      return months.indexOf(a) - months.indexOf(b);
    });
  } else if (periods[0].indexOf('/') !== -1) {
    periods.sort(function (a, b) {
      return Number(a.split('/')[1]) - Number(b.split('/')[1]);
    });
  }

  var periodFilter = periods[periods.length - 1];

  return layerData.filter(function (datum) {
    return datum[periodField] === periodFilter;
  });
}


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/includes/filterUtils.js