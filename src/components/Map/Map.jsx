'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _simpleStatistics = require('simple-statistics');

var _simpleStatistics2 = _interopRequireDefault(_simpleStatistics);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _generateStops = require('../../includes/generateStops');

var _generateStops2 = _interopRequireDefault(_generateStops);

var _fetchData = require('../../includes/fetchData');

var _fetchData2 = _interopRequireDefault(_fetchData);

var _utils = require('../../includes/utils');

var _aggregateData = require('../../includes/aggregateData');

var _aggregateData2 = _interopRequireDefault(_aggregateData);

var _filterUtils = require('../../includes/filterUtils');

var _TimeSeriesSlider = require('../Controls/TimeSeriesSlider/TimeSeriesSlider');

var _TimeSeriesSlider2 = _interopRequireDefault(_TimeSeriesSlider);

var _FilterModal = require('../Controls/FilterSelector/FilterModal');

var _FilterModal2 = _interopRequireDefault(_FilterModal);

var _FilterSelectorPrev = require('../Controls/FilterSelectorPrev/FilterSelectorPrev');

var _FilterSelectorPrev2 = _interopRequireDefault(_FilterSelectorPrev);

var _StyleSelector = require('../Controls/StyleSelector/StyleSelector');

var _StyleSelector2 = _interopRequireDefault(_StyleSelector);

var _Spinner = require('../Spinner/Spinner');

var _Spinner2 = _interopRequireDefault(_Spinner);

var _Export = require('../Export/Export');

var _Export2 = _interopRequireDefault(_Export);

var _SummaryChart = require('../Charts/SummaryChart');

var _SummaryChart2 = _interopRequireDefault(_SummaryChart);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global mapboxgl */


require('./Map.scss');

var isDebug = window.location.search.indexOf('debug') !== -1;

var Map = function (_React$Component) {
  _inherits(Map, _React$Component);

  _createClass(Map, null, [{
    key: 'drawDoughnutChart',
    value: function drawDoughnutChart(container, data, dimension) {
      _highcharts2.default.chart(container, {
        chart: {
          type: 'pie',
          spacing: 0,
          backgroundColor: 'transparent',
          height: dimension,
          width: dimension
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        tooltip: {
          enabled: false,
          backgroundColor: 'rgba(255,255,255,0)',
          borderWidth: 0,
          shadow: false,
          useHTML: true,
          formatter: function formatter() {
            if (this.point.options.label !== undefined) {
              return '<div class="chart-Tooltip"><b>' + this.point.options.label + ': \n            ' + this.point.options.y.toFixed(0) + '%</b></div>';
            }
            return '';
          }
        },
        plotOptions: {
          series: {
            animation: true,
            states: {
              hover: {
                enabled: false
              }
            }
          },
          pie: {
            allowPointSelect: false,
            // borderWidth: 0,
            borderColor: '#fff',
            dataLabels: {
              enabled: false,
              distance: 80,
              crop: false,
              overflow: 'none',
              formatter: function formatter() {
                if (this.point.scoreLabel !== undefined) {
                  return '<b>' + this.point.label + '</b>';
                }
                return '';
              },

              style: {
                fontWeight: 'bold'
              }
            },
            center: ['50%', '50%']
          }
        },
        series: data
      });
    }
  }]);

  function Map(props) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

    _this.prepareLayer = _this.prepareLayer.bind(_this);
    _this.addLayer = _this.addLayer.bind(_this);
    _this.addChart = _this.addChart.bind(_this);
    _this.sortLayers = _this.sortLayers.bind(_this);
    _this.removeLayer = _this.removeLayer.bind(_this);
    _this.addLabels = _this.addLabels.bind(_this);
    _this.removeLabels = _this.removeLabels.bind(_this);
    _this.addLegend = _this.addLegend.bind(_this);
    _this.removeLegend = _this.removeLegend.bind(_this);
    _this.setPrimaryLayer = _this.setPrimaryLayer.bind(_this);
    _this.filterData = _this.filterData.bind(_this);

    _this.buildTimeseriesData = _this.buildTimeseriesData.bind(_this);
    _this.updateTimeseriesState = _this.updateTimeseriesState.bind(_this);
    _this.getSliderLayers = _this.getSliderLayers.bind(_this);
    _this.updateTimeseriesLayers = _this.updateTimeseriesLayers.bind(_this);

    _this.addDefaultLayers = _this.addDefaultLayers.bind(_this);
    _this.addMousemoveEvent = _this.addMousemoveEvent.bind(_this);
    _this.addFacilityClickEvent = _this.addFacilityClickEvent.bind(_this);
    _this.changeStyle = _this.changeStyle.bind(_this);
    _this.saveChartState = _this.saveChartState.bind(_this);
    _this.buildFilters = _this.buildFilters.bind(_this);
    _this.applyFilters = _this.applyFilters.bind(_this);
    _this.setLayerFilter = _this.setLayerFilter.bind(_this);
    _this.getLayerFilter = _this.getLayerFilter.bind(_this);

    _this.activeLayers = [];

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ') || ua.indexOf('Trident/');
    // MSIE is IE 10 or older
    // Trident is IE IE 11
    // Edge (12 +) supports mapboxgl

    _this.state = {
      layers: _this.props.layers.layers.filter(function (l) {
        return l.map === _this.props.mapId;
      }),
      layersObj: [],
      style: _this.props.mapConfig.mapDefaultStyle,
      styles: props.styles,
      timeseries: {},
      showFilterModal: _this.props.showFilterModal,
      filterLayer: null,
      isIE: msie !== -1
    };
    return _this;
  }

  _createClass(Map, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      mapboxgl.accessToken = this.props.mapConfig.mapAccessToken;
      var isIE = this.state.isIE;


      if (!mapboxgl.supported() || isIE) {
        var body = document.body.innerHTML;
        document.body.innerHTML = '<div class="alert alert-info">Your browser is not supported. Please open link in another browser e.g Chrome or Firefox</div>, ' + body;
      } else {
        this.map = new mapboxgl.Map({
          container: this.props.mapId,
          style: this.state.style,
          center: this.props.mapConfig.mapCenter,
          zoom: this.props.mapConfig.mapZoom,
          preserveDrawingBuffer: true
        });
        window.maps.push(this.map);
        this.map.controls = new mapboxgl.NavigationControl();
        this.map.addControl(this.map.controls);
        this.map.on('load', function () {
          _this2.addDefaultLayers();
          _this2.addMousemoveEvent();
          _this2.addFacilityClickEvent();
          _this2.props.disableSpinner(_this2.props.mapId);
        });
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      this.map.resize();
      if (nextProps.layers.layers.length > 0) {
        var i = nextProps.layers.layers.length - 1;
        var layers = nextProps.layers.layers.filter(function (l) {
          return l.map === _this3.props.mapId;
        });
        this.setState({
          layers: layers
        });
        var layer = void 0;
        if (nextProps.layers.layers[i].visible === true && nextProps.layers.layers[i].map === this.props.mapId) {
          if (!this.map.getLayer(nextProps.layers.layers[i].title)) {
            if (this.props.layerData[nextProps.layers.layers[i].title].layers) {
              for (var l = 0; l < this.props.layerData[nextProps.layers.layers[i].title].layers.length; l += 1) {
                layer = this.props.layerData[nextProps.layers.layers[i].title].layers[l];
                if (!this.map.getLayer(layer)) {
                  this.prepareLayer(nextProps.layers.layers[i]);
                  break;
                }
              }
            } else if (this.props.layerData[nextProps.layers.layers[i].title].type === 'chart' && !this.props.layerData[nextProps.layers.layers[i].title].visible) {
              this.prepareLayer(nextProps.layers.layers[i]);
            } else if (this.props.layerData[nextProps.layers.layers[i].title].type !== 'chart') {
              this.prepareLayer(nextProps.layers.layers[i]);
            }
          }
        }
        if (nextProps.layers.layers[i].visible === false && nextProps.layers.layers[i].map === this.props.mapId) {
          this.removeLayer(nextProps.layers.layers[i], nextProps);
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var self = this;
      this.map.resize();
      var doUpdateTimeseries = false;
      var i = void 0;
      var _state = this.state,
          timeseries = _state.timeseries,
          layerObj = _state.layerObj,
          layersObj = _state.layersObj;
      // if timeseries objects' keys don't match, update the timeseries

      if (prevState.timeseries && Object.keys(prevState.timeseries).length !== Object.keys(timeseries).length) {
        doUpdateTimeseries = true;
      }

      // If layerObj mapbox layer is transparent, update the timeseries
      if (!doUpdateTimeseries && layerObj && this.map.getLayer(layerObj.id) && this.map.getPaintProperty(layerObj.id, layerObj.type + '-opacity') === 0) {
        doUpdateTimeseries = true;
      }

      // if still unsure if timeseries objects match
      if (!doUpdateTimeseries) {
        var tsKeys = Object.keys(timeseries);
        var layer = void 0;
        // loop through timeseries object checking for missmatching temporalIndecies
        for (i = 0; i < tsKeys.length; i += 1) {
          layer = tsKeys[i];
          // if temporalIndecies don't match, then definitely update the timeseries
          if (timeseries[layer].temporalIndex !== prevState.timeseries[layer].temporalIndex) {
            doUpdateTimeseries = true;
            break;
          }
        }
      }

      // revert the highlight filter after closing the profile view
      if (!this.props.doShowProfile && prevProps.doShowProfile) {
        var lData = void 0;
        for (var l = 0; l < layersObj.length; l += 1) {
          lData = this.props.layerData[layersObj[l].id];
          // todo - update this conditional to look for feature-view property
          if (lData && lData['highlight-filter-property'] && this.map.getLayer(layersObj[l].id)) {
            (function () {
              var nextLayerObj = void 0;
              var featureLayerObj = void 0;
              var nextLayersObj = [];
              // loop through layerObjs to find highlighted layerObj
              for (i = 0; i < self.state.layersObj.length; i += 1) {
                nextLayerObj = self.state.layersObj[i];
                if (nextLayerObj.id === layersObj[l].id) {
                  nextLayerObj.filters.highlight[2] = '';
                  nextLayerObj.filters.rHighlight[2] = '';
                  featureLayerObj = Object.assign({}, nextLayerObj);
                }
                nextLayersObj.push(nextLayerObj);
              }
              // update highlighted layerObj to original state
              self.setState({
                layerObj: nextLayerObj,
                layersObj: nextLayersObj
              }, function () {
                // apply the new default filters
                self.buildFilters(featureLayerObj);
              });
            })();
          }
        }
      }

      if (doUpdateTimeseries) this.updateTimeseriesLayers();
    }
  }, {
    key: 'getSliderLayers',
    value: function getSliderLayers() {
      var sliderIds = [];
      Object.keys(this.props.layerData).forEach(function (key) {
        sliderIds.push(key);
      });

      var sliderLayers = [];
      for (var i = 0; i < sliderIds.length; i += 1) {
        if ('aggregate' in this.props.layerData[sliderIds[i]] && 'timeseries' in this.props.layerData[sliderIds[i]].aggregate) {
          sliderLayers.push(sliderIds[i]);
        }
      }
      return sliderLayers;
    }
  }, {
    key: 'setPrimaryLayer',
    value: function setPrimaryLayer(e) {
      e.preventDefault();
      var $target = $(e.target).hasClass('legend-row') ? $(e.target) : $(e.target).parents('.legend-row');
      if ($target.hasClass('primary')) return false;

      // $('.set-primary-layer.primary').removeClass('primary');
      $('.legend-row.primary').removeClass('primary');
      $target.addClass('primary');

      var nextLayerId = $target.data('layer');
      var nextLayerObj = this.state.layersObj.find(function (lo) {
        return lo.id === nextLayerId;
      });
      if (!nextLayerObj && this.props.layerData[nextLayerId].layers) {
        var nextLayer = void 0;
        var findNextLayer = function findNextLayer(lo) {
          return lo.id === nextLayer;
        };
        for (var l = 0; l < this.props.layerData[nextLayerId].layers.length; l += 1) {
          nextLayer = this.props.layerData[nextLayerId].layers[l];
          nextLayerObj = this.state.layersObj.find(findNextLayer);
          if (nextLayerObj) break;
        }
      }
      if (!nextLayerObj || !this.map.getLayer(nextLayerId)) {
        return false;
      }

      // Move the selected primary layer to the top of the map layers
      this.map.moveLayer(nextLayerId);
      var layerObj = void 0;
      // Loop throught all active map layers
      for (var i = this.state.layersObj.length - 1; i >= 0; i -= 1) {
        layerObj = this.state.layersObj[i];
        // If 'layerObj' is not a fill OR the selected primary layer
        if (layerObj.type !== 'fill' && layerObj.id !== nextLayerId) {
          // If 'layerObj' is not the same type as the selected
          if (layerObj.type !== nextLayerObj.type) {
            // Move 'layerObj' to the top of the map layers
            if (this.map.getLayer(layerObj.id)) {
              this.map.moveLayer(layerObj.id);
            }
          }
        }
      }

      // Re-order this.state.layersObj array
      var nextlayersObj = this.state.layersObj.filter(function (lo) {
        return lo.id !== nextLayerId;
      });
      nextlayersObj.push(nextLayerObj);

      this.setState({
        layerObj: nextLayerObj,
        layersObj: nextlayersObj
      });
      return true;
    }
  }, {
    key: 'getLayerFilter',
    value: function getLayerFilter(layerId) {
      var layerObj = void 0;
      for (var i = 0; i < this.state.layersObj.length; i += 1) {
        layerObj = this.state.layersObj[i];
        if (layerObj.id === layerId) {
          return layerObj.filters && layerObj.filters.layerFilters;
        }
      }
      return null;
    }
  }, {
    key: 'setLayerFilter',
    value: function setLayerFilter(layerId, filters) {
      var _this4 = this;

      var nextLayerObj = void 0;
      var featureLayerObj = void 0;
      var nextLayersObj = [];
      for (var i = 0; i < this.state.layersObj.length; i += 1) {
        nextLayerObj = this.state.layersObj[i];
        if (nextLayerObj.id === layerId) {
          nextLayerObj.filters.layerFilters = filters;
          featureLayerObj = Object.assign({}, nextLayerObj);
        }
        nextLayersObj.push(nextLayerObj);
      }
      this.setState({
        layerObj: nextLayerObj,
        layersObj: nextLayersObj
      }, function () {
        _this4.buildFilters(featureLayerObj);
      });
    }
  }, {
    key: 'applyFilters',
    value: function applyFilters(layerId, filters) {
      if (this.map.getLayer(layerId)) {
        this.map.setFilter(layerId, filters);
      }
    }
  }, {
    key: 'prepareLayer',
    value: function prepareLayer(layer) {
      var _this5 = this;

      var filterOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var self = this;
      var layerId = layer.title || layer.id;
      var layerData = this.props.layerData[layerId];
      layerData.id = layerId;

      if (layerData.popup && layerData.type !== 'chart') {
        this.activeLayers.push(layerData.id);
      }

      function renderData(layerProp) {
        if (!layerProp.labels) {
          self.addLayer(layerProp);
        } else {
          d3.csv(layerProp.labels.data, function (labels) {
            layerProp.labels.data = labels;
            self.addLayer(layerProp);
          });
        }
      }

      function readData(layerProp, source) {
        var fileType = source.split('.').pop();
        if (fileType === 'csv') {
          d3.csv(layerProp.source.data, function (data) {
            var parsedData = void 0;
            if (layerProp.source.type === 'geojson') {
              var featureType = layerProp.source.featureType || 'Point';
              var features = [];
              var propertiesMap = void 0;
              var datum = void 0;
              var prop = void 0;
              var longProp = layerProp['geo-columns'] && layerProp['geo-columns'][0] || 'Longitude';
              var latProp = layerProp['geo-columns'] && layerProp['geo-columns'][1] || 'Latitude';

              for (var d = 0; d < data.length; d += 1) {
                datum = data[d];
                propertiesMap = layerProp.properties ? {} : Object.assign({}, datum);
                if (layerProp.properties) {
                  for (var p = 0; p < layerProp.properties.length; p += 1) {
                    prop = layerProp.properties[p];
                    propertiesMap[prop] = isNaN(datum[prop]) ? datum[prop] : Number(d[prop]);
                  }
                }

                features.push({
                  type: 'Feature',
                  properties: propertiesMap,
                  geometry: {
                    type: featureType,
                    coordinates: [Number(datum[longProp]), Number(datum[latProp])]
                  }
                });
              }

              parsedData = {
                type: 'FeatureCollection',
                features: features
              };
            } else {
              parsedData = data;
            }

            layerProp.source.data = parsedData;
            layerProp.mergedData = parsedData;
            if (layerProp.aggregate && layerProp.aggregate.filter) {
              layerProp.filterOptions = layerProp.aggregate.filterIsPrev ? (0, _filterUtils.generateFilterOptionsPrev)(layerProp) : (0, _filterUtils.generateFilterOptions)(layerProp);
            }
            renderData(layerProp);
          });
        }
        if (fileType === 'geojson') {
          d3.json(layerProp.source.data, function (data) {
            layerProp.source.data = data;
            if (layerProp.aggregate && layerProp.aggregate.filter) {
              layerProp.filterOptions = layerProp.aggregate.filterIsPrev ? (0, _filterUtils.generateFilterOptionsPrev)(layerProp) : (0, _filterUtils.generateFilterOptions)(layerProp);
            }
            renderData(layerProp);
          });
        }
      }

      // if layer has source
      if (layerData.source) {
        // if not processed, grab the csv or geojson data
        if (typeof layerData.source.data === 'string') {
          readData(layerData, layerData.source.data);
        } else if (layerData.source.data instanceof Array && !(layerData.source.data[0] instanceof Object) && layerData.source.data.length >= 1 && !layerData.loaded) {
          var q = d3.queue();
          var filePaths = layerData.source.data;
          filePaths.forEach(function (filePath) {
            if (Number.isInteger(filePath)) {
              q = q.defer(_fetchData2.default, self, filePath, layerData.properties);
            } else q = q.defer(d3.csv, filePath);
          });
          q.awaitAll(function (error, data) {
            var _ref;

            var mergedData = (_ref = []).concat.apply(_ref, _toConsumableArray(data));
            layerData.mergedData = mergedData;
            if (layerData.aggregate && layerData.aggregate.filter) {
              layerData.filterOptions = layerData.aggregate.filterIsPrev ? (0, _filterUtils.generateFilterOptionsPrev)(layerData) : (0, _filterUtils.generateFilterOptions)(layerData);
            }
            layerData.source.data = layerData.aggregate.type ? (0, _aggregateData2.default)(layerData, _this5.props.locations) : mergedData;
            layerData.loaded = true;
            renderData(layerData);
          });
        } else if (filterOptions) {
          layerData.filterOptions = filterOptions;
          layerData.source.data = layerData.aggregate.type ? (0, _aggregateData2.default)(layerData, this.props.locations, filterOptions) : (0, _filterUtils.processFilters)(layerData, filterOptions);
          self.addLayer(layerData);
        } else {
          // add the already processed layer
          self.addLayer(layerData);
        }
      } else if (layerData.layers) {
        // if layer has sublayers, add all sublayers
        if (!$('#legend-' + layerData.id + '-' + this.props.mapId)[0]) {
          self.addLegend(layerData);
        }
        layerData.layers.forEach(function (sublayer) {
          var subLayer = _this5.props.layerData[sublayer];
          if (layerData.aggregate) {
            subLayer.aggregate = layerData.aggregate;
          }
          subLayer.id = sublayer;
          subLayer.parent = layerData.id;
          if (typeof subLayer.source.data === 'string') {
            readData(subLayer, subLayer.source.data);
          } else {
            self.addLayer(subLayer);
          }
        });
      }
    }
  }, {
    key: 'addLayer',
    value: function addLayer(layerProp) {
      var _this6 = this;

      var layer = Object.assign({}, layerProp);
      var self = this;
      var timefield = layer.aggregate && layer.aggregate.timeseries ? layer.aggregate.timeseries.field : '';
      var stops = void 0;
      var newStops = void 0;
      var circleLayer = void 0;
      var fillLayer = void 0;
      var lineLayer = void 0;
      var symbolLayer = void 0;

      if (layer === undefined) {
        return null;
      }

      var layerObj = layer;
      layer.visible = true;
      layer.filters = layerObj.filters || {};
      if (typeof layerObj.isChartMin === 'undefined') {
        layerObj.isChartMin = true;
        layerObj.legendBottom = 40;
      }

      var layersObj = [];
      for (var lo = 0; lo < this.state.layersObj.length; lo += 1) {
        if (this.state.layersObj[lo].id !== layer.id) {
          layersObj.push(this.state.layersObj[lo]);
        }
      }
      layersObj.push(layer);

      if (layer.property) {
        stops = (0, _generateStops2.default)(layer, timefield);
      }

      if (stops) {
        newStops = { stops: stops, id: layer.id };
        var colorStops = timefield ? stops[0][stops[0].length - 1] : stops[0][0];
        var radiusStops = stops[1][0];
        var stopsData = layer.type === 'circle' ? radiusStops : colorStops;
        var breaks = stops[3];
        var colors = stops[4];
        var currPeriod = stops[2][stops[2].length - 1];
        var currData = layer.source.data.filter(function (data) {
          return data[timefield] === currPeriod;
        });
        var Data = timefield ? currData : layer.source.data;

        this.addLegend(layer, stopsData, Data, breaks, colors);
        this.addLabels(layer, Data);
      } else if (layer.credit && layer.categories && layer.categories.breaks === 'no') {
        this.addLegend(layer);
      } else if (!layer.parent) {
        $('.legend-row.primary').removeClass('primary');
      }

      /*
       * CIRCLE ==========================================================
       */
      if (layer.type === 'circle') {
        circleLayer = {
          id: layer.id,
          type: 'circle',
          source: {
            type: layer.source.type
          },
          layout: {},
          paint: {
            'circle-color': layer.categories.color instanceof Array && !layer.paint ? {
              property: layer.source.join[0],
              stops: timefield ? stops[0][stops[0].length - 1] : stops[0][0],
              type: 'categorical'
            } : layer.categories.color,
            'circle-opacity': 0.8,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': layer.categories.color instanceof Array && !layer.paint ? {
              property: layer.source.join[0],
              stops: timefield ? stops[5][stops[5].length - 1] : stops[5][0],
              type: 'categorical',
              default: 0
            } : 1,
            'circle-stroke-opacity': 1
          }
        };

        // override from layers.json
        if (layer.paint) {
          circleLayer.paint = layer.paint;
        }

        if (layer.source.minZoom) {
          circleLayer.minZoom = layer.source.minZoom;
        }
        if (layer.source.maxZoom) {
          circleLayer.maxZoom = layer.source.maxZoom;
        }

        if (layer.source.data) {
          if (layer.source.type === 'vector') {
            var layerStops = stops ? timefield ? stops[1][stops[1].length - 1] : stops[1][0] : [[0, 0]];
            circleLayer.paint['circle-radius'] = {
              property: layer.source.join[0],
              stops: layerStops,
              type: 'categorical',
              default: stops ? 0 : 3
            };
            circleLayer.source.url = layer.source.url;
            circleLayer['source-layer'] = layer.source.layer;
          } else if (layer.source.type === 'geojson') {
            if (stops) {
              circleLayer.paint['circle-radius'] = {
                property: layer.source.join[0],
                stops: stops[1][0]
              };
            }
            circleLayer.source.data = layer.source.data;
          }
        }
        // add filter
        if (layer.filter) {
          circleLayer.filter = layer.filter;
        }

        if (!this.map.getLayer(circleLayer.id)) this.map.addLayer(circleLayer);
      }

      /*
       * FILL ==========================================================
       */
      if (layer.type === 'fill') {
        fillLayer = {
          id: layer.id,
          type: 'fill',
          source: {
            type: layer.source.type
          },
          layout: {},
          paint: {
            'fill-color': '#f00',
            'fill-opacity': 0.7
          }
        };

        // override from layers.json
        if (layer.paint) {
          fillLayer.paint = layer.paint;
        }
        if (layer.source.minZoom) {
          fillLayer.minZoom = layer.source.minZoom;
        }
        if (layer.maxZoom) {
          fillLayer.maxZoom = layer.maxZoom;
        }

        if (!layer['no-outline']) {
          fillLayer.paint['fill-outline-color'] = '#fff';
        }

        if (layer.source.type === 'geojson') {
          fillLayer.source.data = layer.source.data;
        } else {
          fillLayer.source.url = layer.source.url;
          fillLayer['source-layer'] = layer.source.layer;
        }

        if (layer.source.data && !layer.paint) {
          var _layerStops = timefield ? stops[0][stops[1].length - 1] : stops[0][0];

          fillLayer.paint['fill-color'] = {
            property: layer.source.join[0],
            stops: _layerStops,
            type: 'categorical',
            default: 'rgba(0,0,0,0)'
          };
        }
        // add filter
        if (layer.filter) {
          fillLayer.filter = layer.filter;
        }

        // disallow multiple fill layers on the map (todo - convert filters to nested for loops)
        var id = void 0;
        var filterLayerObjs = function filterLayerObjs(lo) {
          return lo.id !== id;
        };
        var filterActiveLayers = function filterActiveLayers(lo) {
          return lo !== id;
        };
        for (var l = 0; l < this.state.layersObj.length; l += 1) {
          if (this.state.layersObj[l].type === 'fill') {
            id = this.state.layersObj[l].id;
            if (this.map.getLayer(id)) {
              this.map.removeLayer(id);
              if (this.map.getSource(id)) {
                this.map.removeSource(id);
              }
              this.removeLabels(this.state.layersObj[l]);
              this.removeLegend(this.state.layersObj[l]);
              layersObj = layersObj.filter(filterLayerObjs);
              self.activeLayers = self.activeLayers.filter(filterActiveLayers);
            }
          }
        }

        if (!this.map.getLayer(fillLayer.id) && (!layer.source.data || layer.source.data.length)) this.map.addLayer(fillLayer);
      }

      /*
       * LINE ==========================================================
       */
      if (layer.type === 'line') {
        lineLayer = {
          id: layer.id,
          type: 'line',
          source: {
            type: layer.source.type
          },
          layout: {},
          paint: {
            'line-color': '#f00',
            'line-width': 1
          }
        };
        if (layer.paint) {
          lineLayer.paint = layer.paint;
        }
        if (layer.source.minZoom) {
          lineLayer.minZoom = layer.source.minZoom;
        }
        if (layer.maxZoom) {
          lineLayer.maxZoom = layer.maxZoom;
        }
        if (layer.source.type === 'geojson') {
          lineLayer.source.data = layer.source.data;
        } else {
          lineLayer.source.url = layer.source.url;
          lineLayer['source-layer'] = layer.source.layer;
        }
        if (!this.map.getLayer(lineLayer.id)) this.map.addLayer(lineLayer);
      }

      /*
       * SYMBOL ==========================================================
       */
      if (layer.type === 'symbol') {
        symbolLayer = {
          id: layer.id,
          type: 'symbol',
          source: {
            type: layer.source.type
          },
          minZoom: layer.source.minZoom ? layer.source.minZoom : this.props.mapConfig.mapZoom,
          maxZoom: layer.source.maxZoom ? layer.source.maxZoom : 22,
          layout: layer.layout,
          paint: layer.paint
        };

        // add filter
        if (layer.filter) {
          layer.filters.base = layer.filter;
        }

        if (layer.source.type === 'geojson') {
          if (layer.source.data.features && layer.source.data.features[0] && layer.source.data.features[0].geometry) {
            symbolLayer.source.data = layer.source.data;
          } else if (layer.properties && layer.properties.length) {
            symbolLayer.source.data = {
              type: 'FeatureCollection',
              features: layer.source.data.map(function (d) {
                var propertiesMap = {};
                layer.properties.forEach(function (prop) {
                  propertiesMap[prop] = isNaN(d[prop]) ? d[prop] : Number(d[prop]);
                });
                return {
                  type: 'Feature',
                  properties: propertiesMap,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(d.Longitude), Number(d.Latitude)]
                  }
                };
              })
            };
          }
        } else {
          symbolLayer.source.url = layer.source.url;
          symbolLayer['source-layer'] = layer.source.layer;
        }

        if (layer.categories && layer.categories.shape) {
          var iconStops = [];
          layer.categories.type.forEach(function (type, index) {
            iconStops.push([type, layer.categories.shape[index]]);
          });
          symbolLayer.layout['icon-image'].stops = iconStops;
        }

        if (!this.map.getLayer(symbolLayer.id)) {
          if (layer['highlight-filter-property'] && layer['highlight-layout'] || layer['highlight-paint']) {
            var highlightLayer = Object.assign({}, symbolLayer);

            if (layer['highlight-layout']) {
              highlightLayer.layout = Object.assign({}, highlightLayer.layout, layer['highlight-layout']);
            }
            if (layer['highlight-paint']) {
              highlightLayer.paint = Object.assign({}, highlightLayer.paint, layer['highlight-paint']);
            }

            layer.filters.rHighlight = ['!=', layer['highlight-filter-property'], ''];
            layer.filters.highlight = ['==', layer['highlight-filter-property'], ''];

            highlightLayer.id += '-highlight';
            this.map.addLayer(highlightLayer);
          }

          this.map.addLayer(symbolLayer);
        }
      }

      // sort the layers
      self.sortLayers();

      // build and handle timeseries data
      var timeseriesMap = this.buildTimeseriesData(newStops);
      if (timeseriesMap[layer.id]) {
        var mbLayer = void 0;
        switch (layer.type) {
          case 'circle':
            mbLayer = circleLayer;
            break;
          case 'fill':
            mbLayer = fillLayer;
            break;
          case 'line':
            mbLayer = lineLayer;
            break;
          case 'symbol':
            mbLayer = symbolLayer;
            break;
          default:
            mbLayer = null;
        }
        timeseriesMap[layer.id].mapBoxLayer = mbLayer;
      }

      var layerHasFilters = false;
      if (layer.filterOptions) {
        layerHasFilters = true;
      }
      if (layer.filters && Object.keys(layer.filters).length) {
        this.buildFilters(layerObj);
      }

      /*
       * CHART ==========================================================
       */
      if (layer.type === 'chart') {
        var data = timeseriesMap[layer.id] ? timeseriesMap[layer.id].periodData[timeseriesMap[layer.id].period[timeseriesMap[layer.id].temporalIndex]].data : layer.source.data;
        if (timefield) {
          var period = [].concat(_toConsumableArray(new Set(layer.source.data.map(function (p) {
            return p[timefield];
          }))));
          newStops = { id: layer.id, period: period, timefield: timefield };
          data = layer.source.data.filter(function (d) {
            return d[timefield] === period[period.length - 1];
          });
        }
        this.addChart(layer, data);
      }

      // Update the component state
      this.setState({
        layerObj: layerObj,
        layersObj: layersObj,
        filterLayer: layerHasFilters ? layer.id : this.state.filterLayer,
        stops: newStops,
        timeseries: Object.assign({}, this.state.timeseries, timeseriesMap)
      }, function () {
        if (_this6.props.isEnabled) {
          _this6.props.disableSpinner(_this6.props.mapId);
        }
      });
      return null;
    }
  }, {
    key: 'addChart',
    value: function addChart(layer, data) {
      var _this7 = this;

      var population = data.map(function (d) {
        return d[layer.categories.total];
      });
      var clusters = _simpleStatistics2.default.ckmeans(population, layer.categories.clusters);

      // create a DOM element for the marker
      data.forEach(function (district) {
        var total = district[layer.categories.total];
        var chartArr = [];
        var chartProp = '';
        var propTotal = 0;
        var dimension = void 0;

        if (layer.categories.title) {
          chartProp += '<div><b>' + district[layer.categories.title] + '</b></div>';
        }

        if (layer.categories['total-label']) {
          chartProp += '<div>' + layer.categories['total-label'] + ': <b>' + total + '</b></div>';
        }

        for (var i = 0; i < layer.categories.property.length; i += 1) {
          chartArr.push({
            color: layer.categories.color[i],
            y: parseInt(district[layer.categories.property[i]] / total * 100, 10),
            label: layer.categories.label[i]
          });
          propTotal += parseInt(district[layer.categories.property[i]] / total * 100, 10);
          chartProp += '<div><span class="swatch" style="background: ' + layer.categories.color[i] + ';"></span>\n          ' + layer.categories.label[i] + ':\n          <b>' + (district[layer.categories.property[i]] / total * 100).toFixed(1) + '%</b></div>';
        }

        if (layer.categories.difference) {
          chartProp += '<div><span class="swatch" style="background: ' + layer.categories.difference[1] + ';"></span>\n            ' + layer.categories.difference[0] + ': <b>' + (100 - propTotal).toFixed(1) + '%</b></div>';
          chartArr.splice(0, 0, {
            color: layer.categories.difference[1],
            y: 100 - propTotal,
            label: layer.categories.difference[0]
          });
        }

        for (var _i = 0; _i < clusters.length; _i += 1) {
          if (clusters[_i].includes(total)) {
            dimension = layer.categories.dimension[_i];
          }
        }

        var chartData = [{
          data: chartArr,
          size: layer.chart.size,
          innerSize: layer.chart.innerSize
        }];

        var content = '<div><b>' + district[layer.source.join[1]] + '</b></div>' + chartProp;

        var el = document.createElement('div');
        el.id = 'chart-' + district[layer.source.join[1]] + '-' + layer.id + '-' + _this7.props.mapId;
        el.className = 'marker-chart marker-chart-' + layer.id + '-' + _this7.props.mapId;
        el.style.width = layer.chart.width;
        el.style.height = layer.chart.height;
        $(el).attr('data-map', _this7.props.mapId);
        $(el).attr('data-lng', district[layer.chart.coordinates[0]]);
        $(el).attr('data-lat', district[layer.chart.coordinates[1]]);
        $(el).attr('data-popup', content);

        // add marker to map
        new mapboxgl.Marker(el, {
          offset: layer.chart.offset
        }).setLngLat([district[layer.chart.coordinates[0]], district[layer.chart.coordinates[1]]]).addTo(_this7.map);

        var container = $('#chart-' + district[layer.source.join[1]] + '-' + layer.id + '-' + _this7.props.mapId)[0];
        Map.drawDoughnutChart(container, chartData, dimension);
      });
      this.props.layerData[layer.id].visible = true;
    }
  }, {
    key: 'sortLayers',
    value: function sortLayers() {
      var self = this;
      var layerData = this.props.layerData;

      Object.keys(layerData).forEach(function (key) {
        if (layerData[key].type === 'line') {
          if (self.map.getLayer(key)) {
            self.map.moveLayer(key);
          }
        }
      });

      Object.keys(layerData).forEach(function (key) {
        if (layerData[key].type === 'circle') {
          if (self.map.getLayer(key)) {
            self.map.moveLayer(key);
          }
        }
      });

      Object.keys(layerData).forEach(function (key) {
        if (layerData[key].type === 'symbol') {
          if (self.map.getLayer(key)) {
            self.map.moveLayer(key);
          }
        }
      });
    }
  }, {
    key: 'removeLayer',
    value: function removeLayer(layer, nextProps) {
      var _this8 = this;

      var filterIsPrev = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var layerId = layer.title || layer.id;
      var layerData = this.props.layerData[layerId];
      var layersObj = [];
      var loId = void 0;
      var doHideFilterSidebar = false;
      for (var lo = 0; lo < this.state.layersObj.length; lo += 1) {
        loId = this.state.layersObj[lo].title || this.state.layersObj[lo].id;
        if (loId !== layerId) {
          layersObj.push(this.state.layersObj[lo]);
        } else if (loId === this.state.filterLayer) {
          doHideFilterSidebar = !filterIsPrev;
        }
      }

      var facilityLayers = ['nutrition-sites-fixed', 'educational-facilities', 'health-sites', 'sara-sites', 'unicef-sites'];

      if (facilityLayers.indexOf(layerId) !== -1) {
        this.map.easeTo({
          center: {
            lng: this.props.mapConfig.mapCenter[0],
            lat: this.props.mapConfig.mapCenter[1]
          },
          zoom: this.props.mapConfig.mapZoom
        });
      }
      if (layerData.layers) {
        layerData.layers.forEach(function (sublayer) {
          if (_this8.map.getLayer(sublayer)) _this8.map.removeLayer(sublayer);
          if (_this8.map.getSource(sublayer)) _this8.map.removeSource(sublayer);
          layersObj = layersObj.filter(function (l) {
            return l.id !== layer.id;
          });
        });
      }
      if (layerData.popup && layerData.type !== 'chart') {
        var index = this.activeLayers.indexOf(layerData.id);
        this.activeLayers.splice(index, 1);
      }
      if (layerData.type === 'chart') {
        this.props.layerData[layerId].visible = false;
      }
      if (layerData.labels) {
        $('.marker-label-' + layerId + '-' + this.props.mapId).remove();
      }
      if (layerData.type === 'chart') {
        $('.marker-chart-' + layerId + '-' + this.props.mapId).remove();
      } else {
        if (this.map.getLayer(layerId)) {
          this.map.removeLayer(layerId);
        }
        if (this.map.getSource(layerId)) {
          this.map.removeSource(layerId);
        }
        if (layerData['highlight-layout'] || layerData['highlight-paint']) {
          if (this.map.getLayer(layerId + '-highlight')) {
            this.map.removeLayer(layerId + '-highlight');
          }
          if (this.map.getSource(layerId + '-highlight')) {
            this.map.removeSource(layerId + '-highlight');
          }
        }
      }

      // determine if layer obj should be visible or not
      var layers = typeof nextProps === 'undefined' ? this.props.layers.layers : nextProps.layers.layers;

      var nextLayerObj = void 0;
      var nextLayer = null;
      var i = layersObj.length - 1;

      var findLayer = function findLayer(l) {
        return l.title === layersObj[i].id;
      };

      for (i; i >= 0; i -= 1) {
        nextLayer = layers.find(findLayer);
        if (nextLayer && nextLayer.visible) {
          nextLayerObj = layersObj[i];
          break;
        }
      }

      $('#legend-' + nextLayerObj.id + '-' + this.props.mapId).addClass('primary');

      this.setState({
        layersObj: layersObj,
        layerObj: nextLayerObj
      }, function () {
        if (doHideFilterSidebar) _this8.props.handleCloseClick();
      });

      this.removeLabels(layer);
      this.removeLegend(layer);
    }
  }, {
    key: 'addLabels',
    value: function addLabels(layer, data) {
      var _this9 = this;

      if (layer.labels && layer.labels.data && layer.labels.join) {
        var labels = [];

        data.forEach(function (row) {
          var el = document.createElement('div');
          el.className = 'marker-label marker-label-' + layer.id + '-' + _this9.props.mapId;
          el.style.width = layer.labels.width;
          el.style.height = layer.labels.height;
          el.style['font-size'] = '12px';
          el.style['font-weight'] = 'normal';
          $(el).html(_mustache2.default.render(layer.labels.label, row));
          layer.labels.data.forEach(function (label) {
            if (label[layer.labels.join[0]] === row[layer.labels.join[1]]) {
              labels.push({
                el: el,
                offset: layer.labels.offset,
                coordinates: [label[layer.labels.coordinates[0]], label[layer.labels.coordinates[1]]]
              });
            }
          });
        });

        if (this.map.getZoom() > layer.labels.minZoom) {
          labels.forEach(function (row) {
            new mapboxgl.Marker(row.el, {
              offset: row.offset
            }).setLngLat(row.coordinates).addTo(_this9.map);
          });
        }

        if (typeof layer.labels.maxZoom === 'undefined') {
          layer.labels.maxZoom = 22;
        }
        this.map.on('zoom', function () {
          if (_this9.map.getZoom() > layer.labels.minZoom && _this9.map.getZoom() < layer.labels.maxZoom && _this9.map.getLayer(layer.id) !== undefined) {
            _this9.removeLabels(layer);

            labels.forEach(function (row) {
              new mapboxgl.Marker(row.el, {
                offset: row.offset
              }).setLngLat(row.coordinates).addTo(_this9.map);
            });
          } else {
            _this9.removeLabels(layer);
          }
        });
      }
    }
  }, {
    key: 'removeLabels',
    value: function removeLabels(layer) {
      var classItems = document.getElementsByClassName('marker-label-' + layer.id + '-' + this.props.mapId);
      while (classItems[0]) {
        classItems[0].parentNode.removeChild(classItems[0]);
      }
    }
  }, {
    key: 'addLegend',
    value: function addLegend(layer, stops, data, breaks, colors) {
      var mapId = this.props.mapId;
      var background = '';
      // legends for circle layers
      if (layer.credit && layer.type === 'circle' && !layer.categories.shape) {
        $('.legend.' + mapId).prepend('<div id="legend-' + layer.id + '-' + mapId + '"\n          class="legend-shapes legend-row" data-layer="' + layer.id + '">\n          <b>' + layer.label + '</b>\n          <div class="legend-symbols">\n            <span class="circle-sm" style="background:' + layer.categories.color + ';"></span>\n            <span class="circle-md" style="background:' + layer.categories.color + ';"></span>\n            <span class="circle-lg" style="background:' + layer.categories.color + ';"></span>\n          </div>\n          <span>' + layer.credit + '</span>\n        </div>');

        // legends for symbol layers
      } else if (layer.credit && layer.categories.shape && layer.type !== 'circle') {
        layer.categories.color.forEach(function (color, index) {
          var style = layer.categories.shape[index] === 'triangle-stroked-11' || layer.categories.shape[index] === 'triangle-15' ? 'border-bottom-color:' : 'display: inline-block; height: 12px; width: 12px;' + 'position: relative; top: 1px; margin-right: 6px; background:';

          background += '<li class="layer-symbols"> <span class="' + layer.categories.shape[index] + '" style="' + style + color + ';"></span>' + layer.categories.label[index] + '</li>';
        });

        $('.legend.' + mapId).prepend('<div id="legend-' + layer.id + '-' + mapId + '" class="legend-row" data-layer="' + layer.id + '">\n          <b>' + layer.label + '</b>\n          <div class="legend-shapes">\n            <ul style="left: 0;">' + background + '</ul>\n          </div>\n          <span>' + layer.credit + '</span>\n        </div>');

        // legends for fill layers with no breaks
      } else if (layer.credit && layer.categories.breaks === 'no') {
        layer.categories.color.forEach(function (color, index) {
          background += '<li style="background:' + color + '; width:' + 100 / layer.categories.color.length + '%;">' + layer.categories.label[index] + '</li>';
        });

        $('.legend.' + mapId).prepend('<div id="legend-' + layer.id + '-' + mapId + '" class="legend-row" data-layer="' + layer.id + '">\n          <b>' + layer.label + '</b>\n          <div class="legend-fill ' + (layer.categories ? 'legend-label' : '') + '">\n            <ul>' + background + '</ul>\n          </div>\n          <span>' + layer.credit + '</span>\n        </div>');

        // legends for fill layrs with breaks
      } else if (layer.credit && layer.type !== 'circle' && layer.type !== 'chart') {
        var dataValues = data.map(function (values) {
          return values[layer.property];
        });
        var colorLegend = [].concat(_toConsumableArray(new Set(stops.map(function (stop) {
          return stop[1];
        }))));
        var legendSuffix = layer.categories.suffix ? layer.categories.suffix : '';

        if (colorLegend.includes('transparent') && !colors.includes('transparent')) {
          colors.splice(0, 0, 'transparent');
          breaks.splice(1, 0, breaks[0]);
        }

        colorLegend.forEach(function (color, index) {
          var firstVal = breaks[index - 1] !== undefined ? breaks[index - 1] : 0;
          var lastVal = color === colorLegend[colorLegend.length - 1] || breaks[index] === undefined ? Math.max.apply(Math, _toConsumableArray(dataValues)) : breaks[index];
          background += '<li class="background-block-' + layer.id + '-' + mapId + '"' + ('data-tooltip="' + (0, _utils.formatNum)(firstVal, 1) + '-' + (0, _utils.formatNum)(lastVal, 1) + legendSuffix + '"') + ('style="background:' + (0, _utils.hexToRgbA)(color, 0.9) + '; width:' + 100 / colorLegend.length + '%;"></li > ');
        });

        $('.legend.' + mapId).prepend('<div id="legend-' + layer.id + '-' + mapId + '" class="legend-row" data-layer="' + layer.id + '">\n          <b>' + layer.label + '</b>\n          <ul class="legend-limit" style="padding: 0% 0% 3% 0%;"> \n            <li id="first-limit-' + layer.id + '" class="' + mapId + '"\n              style="position: absolute; list-style: none; display: inline; left: 3%;">\n              ' + 0 + legendSuffix + '\n            </li>\n            <li id="last-limit-' + layer.id + '" class="' + mapId + ' \n              "style="position: absolute; list-style: none; display: inline; right: 3%;">\n              ' + (0, _utils.formatNum)(Math.max.apply(Math, _toConsumableArray(dataValues)), 1) + legendSuffix + '\n            </li>\n          </ul>\n          <div class="legend-fill">\n            <ul id="legend-background">' + background + '</ul>\n          </div>\n          <span>' + layer.credit + '</span>\n        </div>');

        $('.background-block-' + layer.id + '-' + mapId).hover(function () {
          $('#first-limit-' + layer.id + '.' + mapId).text($('first-limit').text());
          $('#last-limit-' + layer.id + '.' + mapId).text($('last-limit').text());
        }, function () {
          $('#first-limit-' + layer.id + '.' + mapId).text(0 + legendSuffix);
          $('#last-limit-' + layer.id + '.' + mapId).text((0, _utils.formatNum)(Math.max.apply(Math, _toConsumableArray(dataValues)), 1) + legendSuffix);
        });

        // no legend
      } else {}
        // $('.set-primary-layer.primary').removeClass('primary');


        // $('.set-primary-layer.primary').removeClass('primary');
        //   $(`#legend-${layer.id}-${mapId} .set-primary-layer`)
        //     .on('click', this.setPrimaryLayer)
        //     .addClass('primary');

      $('.legend-row.primary').removeClass('primary');
      $('#legend-' + layer.id + '-' + mapId).addClass('primary').on('click', this.setPrimaryLayer);
    }
  }, {
    key: 'removeLegend',
    value: function removeLegend(layer) {
      var layerId = layer.title || layer.id;
      var mapId = this.props.mapId;

      $('#legend-' + layerId + '-' + mapId + ' .set-primary-layer').off('click', this.setPrimaryLayer);
      $('#legend-' + layerId + '-' + mapId).remove();
    }
  }, {
    key: 'filterData',
    value: function filterData(filterOptions) {
      // const { layerObj, layersObj } = this.state;
      // const nextLayersObj = []
      // for (let l = 0; l < layersObj.length; l += 1) {
      //   nextLayersObj.push(layersObj[l]);
      //   if (layersObj[l].id === layerObj.id) {
      //     nextLayersObj[l].filterOptionsPref = filterOptions
      //   }
      // }
      this.removeLayer(this.state.layerObj, undefined, true);
      this.prepareLayer(this.state.layerObj, filterOptions);
    }
  }, {
    key: 'buildTimeseriesData',
    value: function buildTimeseriesData(Stops) {
      var timeSeriesLayers = this.getSliderLayers();
      var activeLayers = this.state.layers.map(function (layer) {
        return layer.title;
      });
      var timeseriesMap = {};

      var layerId = void 0;
      var index = void 0;
      var layerObj = void 0;
      var temporalIndex = void 0;
      var data = void 0;
      var datum = void 0;
      var layerProperty = void 0;
      var periodData = void 0;
      var charts = void 0;

      var period = void 0;
      var colorStops = void 0;
      var radiusStops = void 0;
      var breaks = void 0;
      var colors = void 0;
      var stops = Stops;
      var strokeWidthStops = void 0;

      var chartDataFilter = function chartDataFilter(d) {
        return d.properties && d.properties[stops.timefield] === period[temporalIndex] || d[stops.timefield] === period[temporalIndex];
      };

      var periodHasDataReducer = function periodHasDataReducer(sum, d) {
        if (d.properties && isNaN(d.properties[layerProperty]) || isNaN(d[layerProperty])) {
          return sum + 1;
        }
        return d.properties && sum + Number(d.properties[layerProperty]) || sum + Number(d[layerProperty]);
      };

      var periodDataFilter = function periodDataFilter(p) {
        var dataToFilter = layerObj.source.data.features && layerObj.source.data.features || layerObj.source.data;
        // define actual period data
        periodData[p] = {
          data: dataToFilter.filter(function (d) {
            return d.properties && d.properties[layerObj.aggregate.timeseries.field] === p || d[layerObj.aggregate.timeseries.field] === p;
          })
        };
        // determine if period data has any non-zero values
        periodData[p].hasData = !!periodData[p].data.reduce(periodHasDataReducer, 0);
      };

      for (var i = 0; i < timeSeriesLayers.length; i += 1) {
        layerId = timeSeriesLayers[i];

        // todo - check for different layerObj.filterOptions to see if existing tsLayer needs new periodData
        // if (activeLayers.includes(layerId) && !this.state.timeseries[layerId]) {
        if (activeLayers.includes(layerId)) {
          index = (0, _utils.getLastIndex)(activeLayers, layerId);
          layerObj = this.props.layerData[layerId];
          charts = layerObj && !!layerObj.charts ? layerObj.charts : null;

          if (this.state && this.state.layers[index] && this.state.layers[index].visible === true && layerObj.source.data instanceof Object) {

            if (stops && layerObj.id === stops.id) {
              var paintStops = stops.stops;
              colorStops = paintStops[0];
              radiusStops = paintStops[1];
              period = paintStops[2];
              breaks = paintStops[3];
              colors = paintStops[4];
              strokeWidthStops = paintStops[5];
              stops = layerObj.type === 'circle' ? radiusStops : colorStops;
            } else if (layerObj.aggregate && layerObj.aggregate.timeseries) {
              // if no stops, get periods from data
              period = [];
              data = layerObj.source.data.features || layerObj.source.data;
              for (var d = 0; d < data.length; d += 1) {
                datum = data[d].properties && data[d].properties[layerObj.aggregate.timeseries.field] || data[d][layerObj.aggregate.timeseries.field];

                if (period.indexOf(datum) === -1) {
                  period.push(datum);
                }
              }
            }

            if (!period.length) {
              continue;
            }
            temporalIndex = period.length - 1;

            if (layerObj.aggregate && layerObj.aggregate.timeseries) {
              // define period data for each period
              layerProperty = layerObj.property || layerObj.source.join && layerObj.source.join[0];
              periodData = {};
              period.forEach(periodDataFilter);

              data = periodData[period[temporalIndex]].data;
            } else {
              data = layerObj.source.data;
            }

            timeseriesMap[layerId] = {
              layerId: layerId,
              index: index,
              layerObj: layerObj,
              temporalIndex: temporalIndex,
              data: data,
              charts: charts,
              periodData: periodData,
              colors: colors,
              colorStops: colorStops,
              radiusStops: radiusStops,
              period: period,
              breaks: breaks,
              strokeWidthStops: strokeWidthStops,
              stops: stops,
              layerProperty: layerProperty
            };
          }
        }
      }

      return timeseriesMap;
    }
  }, {
    key: 'updateTimeseriesState',
    value: function updateTimeseriesState(nextIndex, sliderLayerObj) {
      var nextTimeseriesLayer = void 0;
      var layerId = void 0;
      var temporalIndex = void 0;
      var stops = void 0;
      var period = void 0;
      var nextTimeseries = Object.assign({}, this.state.timeseries);

      var timeSeriesLayers = this.getSliderLayers();
      var activeLayers = this.state.layers.map(function (layer) {
        return layer.title;
      });

      var stopsFilter = function stopsFilter(d) {
        return d[stops.timefield] === period[temporalIndex];
      };

      for (var i = 0; i < timeSeriesLayers.length; i += 1) {
        layerId = timeSeriesLayers[i];
        if (activeLayers.includes(layerId) && nextTimeseries[layerId]) {
          nextTimeseriesLayer = nextTimeseries[layerId];
          var _nextTimeseriesLayer = nextTimeseriesLayer,
              layerObj = _nextTimeseriesLayer.layerObj,
              periodData = _nextTimeseriesLayer.periodData;

          stops = nextTimeseriesLayer.stops;
          period = nextTimeseriesLayer.period;

          if (layerId === sliderLayerObj.layerId) {
            temporalIndex = nextIndex;
          } else {
            temporalIndex = period ? period.indexOf(sliderLayerObj.period[nextIndex]) : -1;
          }

          if (temporalIndex !== -1) {
            nextTimeseries[layerId] = Object.assign({}, nextTimeseriesLayer, {
              temporalIndex: temporalIndex,
              data: periodData[period[temporalIndex]].data
            });
          }
        }
      }

      this.setState({
        timeseries: nextTimeseries
      });
    }
  }, {
    key: 'updateTimeseriesLayers',
    value: function updateTimeseriesLayers() {
      var _this10 = this;

      if (!this.map || !this.state.layerObj || !this.state.timeseries[this.state.layerObj.id]) {
        return;
      }
      var timeSeriesLayers = Object.keys(this.state.timeseries);

      var _state2 = this.state,
          timeseries = _state2.timeseries,
          layersObj = _state2.layersObj;
      // determine what the currently timeperiod to see if layers should be hidden

      var currTsLayer = timeseries[this.state.layerObj.id];
      var currPeriod = currTsLayer.period[currTsLayer.temporalIndex];

      var layer = void 0;
      var tsLayer = void 0;
      var tsFilter = void 0;
      var layerObj = void 0;
      var id = void 0;
      var doUpdateStateForFilters = false;
      var nextLayerObj = void 0;
      var featureLayerObj = void 0;
      var nextLayersObj = [].concat(_toConsumableArray(this.state.layersObj));

      var pIndex = void 0;
      var hasData = void 0;
      var type = void 0;

      var index = void 0;
      var defaultValue = void 0;
      var paintProperty = void 0;
      var newStops = void 0;
      var newColorStops = void 0;
      var newStrokeStops = void 0;

      var findLayer = function findLayer(l) {
        return l.title === id;
      };

      for (var i = 0; i < layersObj.length; i += 1) {
        layerObj = layersObj[i];
        id = layerObj.id;

        if (timeSeriesLayers.includes(id)) {
          layer = this.state.layers.find(findLayer);
          tsLayer = this.state.timeseries[id];

          var _tsLayer = tsLayer,
              temporalIndex = _tsLayer.temporalIndex,
              data = _tsLayer.data,
              stops = _tsLayer.stops,
              colorStops = _tsLayer.colorStops,
              strokeWidthStops = _tsLayer.strokeWidthStops,
              breaks = _tsLayer.breaks,
              colors = _tsLayer.colors;


          index = parseInt(temporalIndex, 10);

          if (layerObj.type === 'chart') {
            $('.marker-chart-' + id + '-' + this.props.mapId).remove();
            this.addChart(layerObj, data);

            // if not a chart, layer is on the map, and layer is visible
          } else if (this.map.getLayer(id) && layer && layer.visible) {
            // look through the layer periods for a match
            pIndex = timeseries[id].period.indexOf(currPeriod);
            hasData = pIndex !== -1 ? timeseries[id].periodData[currPeriod].hasData : false;
            type = this.props.layerData[id].type !== 'symbol' ? this.props.layerData[id].type : 'icon';

            // if the layer is in the map and has no period match, hide it
            if (this.map.getLayer(id) && (!hasData || pIndex === -1)) {
              switch (type) {
                case 'circle':
                  this.map.setPaintProperty(id, 'circle-opacity', 0);
                  this.map.setPaintProperty(id, 'circle-stroke-opacity', 0);
                  break;
                case 'fill':
                  this.map.setPaintProperty(id, 'fill-opacity', 0);
                  break;
                case 'line':
                  this.map.setPaintProperty(id, 'line-opacity', 0);
                  break;
                case 'symbol':
                  this.map.setPaintProperty(id, 'icon-opacity', 0);
                  break;
                default:
                  break;
              }

              // if the layer is not in the map and does have a match, handle it
            } else if (this.map.getLayer(id) && hasData && pIndex !== -1) {
              // if layer has opacity of 0, reveal it
              if (this.map.getPaintProperty(id, type + '-opacity') === 0) {
                switch (type) {
                  case 'circle':
                    this.map.setPaintProperty(id, 'circle-opacity', 0.8);
                    this.map.setPaintProperty(id, 'circle-stroke-opacity', 0.8);
                    break;
                  case 'fill':
                    this.map.setPaintProperty(id, 'fill-opacity', 0.7);
                    break;
                  case 'line':
                    this.map.setPaintProperty(id, 'line-opacity', 1);
                    break;
                  case 'symbol':
                    this.map.setPaintProperty(id, 'icon-opacity', 1);
                    break;
                  default:
                    break;
                }
              }

              // if layer has stops, update them
              if (stops && stops[index] !== undefined && stops[index][0][0] !== undefined) {
                defaultValue = layerObj.type === 'circle' ? 0 : 'rgba(0,0,0,0)';
                paintProperty = layerObj.type === 'circle' ? 'circle-radius' : 'fill-color';
                newStops = {
                  property: layerObj.source.join[0],
                  stops: stops[index],
                  type: 'categorical',
                  default: defaultValue
                };

                if (layerObj.type === 'circle' && layerObj.categories.color instanceof Array) {
                  newColorStops = {
                    property: layerObj.source.join[0],
                    stops: colorStops[index],
                    type: 'categorical'
                  };
                  newStrokeStops = {
                    property: layerObj.source.join[0],
                    stops: strokeWidthStops[index],
                    type: 'categorical'
                  };
                  this.map.setPaintProperty(id, 'circle-color', newColorStops);
                  this.map.setPaintProperty(id, 'circle-stroke-width', newStrokeStops);
                }

                this.map.setPaintProperty(id, paintProperty, newStops);
                this.removeLabels(layerObj);
                this.addLabels(layerObj, data);
                this.removeLegend(layerObj);
                this.addLegend(layerObj, stops[index], data, breaks, colors);
              } else {
                for (var _i2 = 0; _i2 < nextLayersObj.length; _i2 += 1) {
                  nextLayerObj = Object.assign({}, nextLayersObj[_i2]);
                  if (nextLayerObj.id === id) {
                    nextLayerObj.filters.tsFilter = ['==', layerObj.aggregate.timeseries.field, currPeriod];
                    nextLayersObj[_i2] = Object.assign({}, nextLayerObj);
                  }
                }
                doUpdateStateForFilters = true;
              }
            }
          }
        }
      }

      if (doUpdateStateForFilters) {
        this.setState({
          layerObj: nextLayersObj[nextLayersObj.length - 1],
          layersObj: nextLayersObj
        }, function () {
          for (var lo = 0; lo < nextLayersObj.length; lo += 1) {
            if (nextLayersObj[lo].filters && typeof nextLayersObj[lo].filters.tsFilter !== 'undefined') {
              _this10.buildFilters(nextLayersObj[lo]);
            }
          }
        });
      }
    }
  }, {
    key: 'addDefaultLayers',
    value: function addDefaultLayers() {
      var _this11 = this;

      var layerData = this.props.layerData;

      Object.keys(layerData).forEach(function (key) {
        if (layerData[key].visible === true) {
          $('.layer.' + _this11.props.mapId + ' > [data-layer="' + key + '"]').trigger('click');
        }
      });
    }
  }, {
    key: 'addFacilityClickEvent',
    value: function addFacilityClickEvent() {
      var _this12 = this;

      var self = this;
      // todo - add hasFeatureView prop in layer config
      // const facilityLayers = [
      //   'nutrition-sites-fixed',
      //   'educational-facilities',
      //   'health-sites',
      //   'sara-sites',
      //   'unicef-sites',
      // ];

      self.map.on('click', function (e) {
        var features = _this12.map.queryRenderedFeatures(e.point);
        var feature = features.find(function (f) {
          return self.props.layerData[f.layer.id] && self.props.layerData[f.layer.id]['feature-detail'];
        });
        if (!feature) {
          return false;
        }

        var nextLayerObj = void 0;
        var featureLayerObj = void 0;
        var nextLayersObj = [];
        for (var i = 0; i < self.state.layersObj.length; i += 1) {
          nextLayerObj = self.state.layersObj[i];
          if (nextLayerObj.id === feature.layer.id && nextLayerObj['highlight-filter-property']) {
            nextLayerObj.filters.highlight[2] = feature.properties[nextLayerObj['highlight-filter-property']];
            nextLayerObj.filters.rHighlight[2] = feature.properties[nextLayerObj['highlight-filter-property']];
          }
          featureLayerObj = Object.assign({}, nextLayerObj);
          nextLayersObj.push(nextLayerObj);
        }
        self.setState({
          layerObj: nextLayerObj,
          layersObj: nextLayersObj
        }, function () {
          if (featureLayerObj['highlight-filter-property']) {
            self.buildFilters(featureLayerObj);
          }
          var data = featureLayerObj.mergedData ? featureLayerObj.mergedData.features || featureLayerObj.mergedData : featureLayerObj.source && featureLayerObj.source.data && featureLayerObj.source.data.features || featureLayerObj.source.data;

          var join0 = self.props.layerData[feature.layer.id].source.join[0];
          var join1 = self.props.layerData[feature.layer.id].source.join[1];
          var datum = void 0;
          if (data) {
            for (var d = 0; d < data.length; d += 1) {
              if (data[d].properties && data[d].properties[join1] === feature.properties[join0] || data[d][join1] === feature.properties[join0]) {
                datum = data[d].properties || data[d];
              }
            }
          }

          self.props.handleFacilityClick(e, feature, nextLayerObj, datum);
          var newZoom = _this12.map.getZoom() < 7.5 ? 7.5 : _this12.map.getZoom();
          self.map.easeTo({ center: e.lngLat, zoom: newZoom });
        });

        return true;
      });

      self.map.on('mousemove', function (e) {
        var features = _this12.map.queryRenderedFeatures(e.point);
        var feature = features.find(function (f) {
          return self.props.layerData[f.layer.id] && self.props.layerData[f.layer.id]['feature-detail'];
        });
        if (!feature) {
          return false;
        }
        self.map.getCanvas().style.cursor = self.props.layerData[feature.layer.id] && self.props.layerData[feature.layer.id]['feature-detail'] ? 'pointer' : '';
        return true;
      });
    }
  }, {
    key: 'addMousemoveEvent',
    value: function addMousemoveEvent() {
      var self = this;
      var layerData = this.props.layerData;
      self.popup = self.popup || new mapboxgl.Popup({
        closeOnClick: true,
        closeButton: false
      });
      self.popupFeature = null;
      self.popupFeatureId = '';

      if (isDebug) {
        self.map.on('click', function (e) {
          var features = self.map.queryRenderedFeatures(e.point, {
            layers: self.activeLayers
          });
          if (!features || !features[0]) {
            return false;
          }
          console.log('Feature Data - ', features[0].properties);

          if (self.props.layerData[features[0].layer.id].source.data) {
            var t0 = window.performance.now();
            var join0 = self.props.layerData[features[0].layer.id].source.join[0];
            var join1 = self.props.layerData[features[0].layer.id].source.join[1];
            // const data = self.props.layerData[features[0].layer.id].source.data;
            var data = self.props.layerData[features[0].layer.id].mergedData ? self.props.layerData[features[0].layer.id].mergedData.features || self.props.layerData[features[0].layer.id].mergedData : self.props.layerData[features[0].layer.id].source && self.props.layerData[features[0].layer.id].source.data && self.props.layerData[features[0].layer.id].source.data.features || self.props.layerData[features[0].layer.id].source.data;
            var datum = void 0;
            var dI = 0;
            if (data) {
              for (var d = 0; d < data.length; d += 1) {
                if (data[d].properties && data[d].properties[join1] === features[0].properties[join0] || data[d][join1] === features[0].properties[join0]) {
                  datum = data[d].properties || data[d];
                  dI += 1;
                }
              }
              // const t1 = window.performance.now();
              console.log('Joined Data - ', datum);
              // console.log('matches: ', dI);
              // console.log('timing:', t1 - t0)
            }
          }
        });
      }

      self.map.on('mousemove', function (e) {
        var featureId = '';
        var features = self.map.queryRenderedFeatures(e.point, {
          layers: self.activeLayers
        });

        if (!features) {
          return false;
        }

        // Change the cursor style as a UI indicator.
        self.map.getCanvas().style.cursor = features.length ? 'pointer' : '';

        if (!features.length || !layerData[features[0].layer.id] || !layerData[features[0].layer.id].popup) {
          self.popupFeature = null;
          self.popupFeatureId = '';
          self.popup.remove();
          return false;
        } else if (self.popupFeature && self.popupFeature.layer.id === features[0].layer.id) {
          featureId = features[0].properties[layerData[features[0].layer.id].source.join[0]];

          if (featureId === self.featureId) {
            self.popup.setLngLat(self.map.unproject(e.point));
            return false;
          }
        }

        var feature = features[0];
        self.popupFeature = feature;
        self.popupFeatureId = feature.properties[layerData[features[0].layer.id].source.join[0]];
        var content = 'Unknown';
        var activeLayerId = feature.layer.id;
        var layer = layerData[activeLayerId];

        if (layer.type !== 'chart' && layer.popup) {
          var periodData = [];
          if (layer.aggregate && layer.aggregate.timeseries) {
            var tsLayer = self.state.timeseries[self.state.layerObj.id];
            if (tsLayer) {
              var currPeriod = Object.keys(tsLayer.periodData)[tsLayer.temporalIndex];
              periodData = tsLayer.periodData[currPeriod].data;
            }
          }

          var data = layer.aggregate && layer.aggregate.timeseries ? periodData : layer.source.data;
          if (data && data.length) {
            var row = void 0;
            for (var r = 0; r < data.length; r += 1) {
              row = data[r];
              if (row[layer.source.join[1]] === feature.properties[layer.source.join[0]]) {
                if (row[layer.popup.header]) {
                  content = '<div><b>' + row[layer.popup.header] + '</b></div>' + ('<div><center>' + _mustache2.default.render(layer.popup.body, row) + '</center></div>');
                } else {
                  content = _mustache2.default.render(layer.popup.body, row);
                }
              }
            }
          } else {
            content = _mustache2.default.render(layer.popup.body, feature.properties);
          }
          if (content !== 'Unknown') {
            self.popup.setLngLat(self.map.unproject(e.point)).setHTML(content).addTo(self.map);
          }
        }
        return true;
      });

      // add popups for marker charts
      $(document).on('mousemove', '.marker-chart', function (e) {
        var map = $(e.currentTarget).data('map');
        var lng = $(e.currentTarget).data('lng');
        var lat = $(e.currentTarget).data('lat');
        var content = $(e.currentTarget).data('popup');
        if (map === self.props.mapId) {
          self.popup.setLngLat([parseFloat(lng), parseFloat(lat)]).setHTML(content).addTo(self.map);
        }
      });
    }
  }, {
    key: 'changeStyle',
    value: function changeStyle(style) {
      var _this13 = this;

      var mapLayers = this.props.layers.layers.filter(function (layer) {
        return layer.map === _this13.props.mapId;
      });
      var layers = mapLayers.map(function (layer) {
        return layer.title;
      });
      var layerProp = [];

      var _loop = function _loop(i) {
        var index = (0, _utils.getLastIndex)(layers, layers[i]);
        if (mapLayers[index].visible === true) {
          layerProp.push(_this13.state.layersObj.filter(function (layer) {
            return layer.id === layers[i];
          }));
        }
      };

      for (var i = 0; i < layers.length; i += 1) {
        _loop(i);
      }

      this.map.setStyle(style);
      this.map.on('style.load', function () {
        layers.forEach(function (id) {
          var prop = _this13.state.layersObj.filter(function (layer) {
            return layer.id === id;
          });
          _this13.removeLayer(prop[0]);
        });
        for (var j = 0; j < layerProp.length; j += 1) {
          if (!_this13.map.getSource(layerProp[j][0].id)) {
            _this13.addLayer(layerProp[j][0]);
          }
        }
      });
      this.setState({ style: style });
    }
  }, {
    key: 'saveChartState',
    value: function saveChartState(layerId, isChartMin, legendBottom) {
      var _state3 = this.state,
          layerObj = _state3.layerObj,
          layersObj = _state3.layersObj;

      var newLayersObj = [];
      var doUpdateLayersObj = false;

      if (layerObj.id === layerId && layerObj.isChartMin !== isChartMin) {
        layerObj.isChartMin = isChartMin;
        layerObj.legendBottom = legendBottom;
        layersObj[layersObj.length - 1].isChartMin = isChartMin;
        layersObj[layersObj.length - 1].legendBottom = legendBottom;

        this.setState({
          layerObj: layerObj,
          layersObj: layersObj
        });
      } else {
        for (var lo = 0; lo < layersObj.length; lo += 1) {
          if (layersObj[lo].id === layerId && layersObj[lo].isChartMin !== isChartMin) {
            layersObj[lo].isChartMin = isChartMin;
            layersObj[lo].legendBottom = legendBottom;
            doUpdateLayersObj = true;
          }
          newLayersObj.push(layersObj[lo]);
        }
      }

      if (doUpdateLayersObj) {
        this.setState({
          layersObj: newLayersObj
        });
      }
    }
  }, {
    key: 'buildFilters',
    value: function buildFilters(layerObj) {
      var layerId = layerObj.id;
      var filterKeys = Object.keys(layerObj.filters);
      var filter = void 0;
      var combinedFilters = ['all'];

      // loop through filters object
      for (var f = 0; f < filterKeys.length; f += 1) {
        filter = layerObj.filters[filterKeys[f]];

        if (filterKeys[f] === 'highlight') {
          // handle highlight filter seperately
          this.applyFilters(layerId + '-highlight', filter);
        } else if (filter) {
          // build out combined filters
          combinedFilters.push(filter);
        }
      }

      if (combinedFilters.length > 2) {
        // if there are multiple filters apply as is
        this.applyFilters(layerId, combinedFilters);
      } else if (combinedFilters.length === 2) {
        // if there is only one filter, apply the only one
        this.applyFilters(layerId, combinedFilters[1]);
      } else {
        // if filters were null
        this.applyFilters(layerId, null);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state4 = this.state,
          layerObj = _state4.layerObj,
          layersObj = _state4.layersObj,
          timeseries = _state4.timeseries,
          filterLayer = _state4.filterLayer;
      var _props = this.props,
          mapId = _props.mapId,
          showFilterModal = _props.showFilterModal,
          facility = _props.facility;
      var _props2 = this.props,
          handleFilterClick = _props2.handleFilterClick,
          handleCloseClick = _props2.handleCloseClick;


      var sumChartObj = void 0;
      var isChartMin = void 0;
      var legendBottom = void 0;

      if (layerObj && !!layerObj.charts) {
        sumChartObj = timeseries[layerObj.id] ? timeseries[layerObj.id] : layerObj;
        isChartMin = layerObj.isChartMin;
        legendBottom = layerObj.legendBottom;
      }

      var filterLayerObj = null;
      if (filterLayer) {
        for (var lo = 0; lo < layersObj.length; lo += 1) {
          if (layersObj[lo].id === filterLayer) {
            filterLayerObj = layersObj[lo];
          }
        }
      }
      var filterIsPrev = filterLayerObj && filterLayerObj.aggregate && filterLayerObj.aggregate.filterIsPrev;
      var showPrevFilter = showFilterModal && filterIsPrev;

      var doShowProfile = this.props.doShowProfile && !!facility;
      var containerWidth = this.props.isSplitScreen ? mapId === 'map-1' ? '52%' : '48%' : doShowProfile || filterLayerObj && showFilterModal && !showPrevFilter ? 'calc(100% - 350px)' : '100%';

      var filterBtnPos = facility && this.props.doShowProfile || showFilterModal && !showPrevFilter ? '360px' : '10px';

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          {
            id: this.props.mapId,
            style: { width: showFilterModal && !showPrevFilter ? 'calc(100% - 250px)' : containerWidth }
          },
          layerObj && this.props.styles ? _react2.default.createElement(
            'div',
            null,
            sumChartObj ? _react2.default.createElement(_SummaryChart2.default, {
              layerId: layerObj.id,
              layer: sumChartObj,
              mapId: this.props.mapId,
              isChartMin: isChartMin,
              legendBottom: legendBottom,
              saveChartState: this.saveChartState,
              locations: this.props.locations
            }) : '',
            timeseries && layerObj && timeseries[layerObj.id] ? _react2.default.createElement(_TimeSeriesSlider2.default, {
              mapId: this.props.mapId,
              updateTimeseriesState: this.updateTimeseriesState,
              timeSeriesObj: timeseries[layerObj.id]
            }) : '',
            _react2.default.createElement('div', { className: 'legend ' + this.props.mapId }),
            _react2.default.createElement(_StyleSelector2.default, {
              changeStyle: this.changeStyle,
              style: this.state.style,
              styles: this.state.styles
            })
          ) : '',
          this.props.showSpinner ? _react2.default.createElement(_Spinner2.default, { isEnabled: this.props.showSpinner }) : ''
        ),
        filterLayerObj ? _react2.default.createElement('button', {
          className: 'filterButton glyphicon glyphicon-filter' + (showFilterModal && !showPrevFilter ? ' open' : ''),
          onClick: function onClick() {
            handleFilterClick(filterIsPrev);
          },
          style: { right: showFilterModal && !showPrevFilter ? '260px' : filterBtnPos }
        }) : '',
        showFilterModal && filterLayerObj && !showPrevFilter ? _react2.default.createElement(_FilterModal2.default, {
          layerObj: filterLayerObj,
          setLayerFilter: this.setLayerFilter,
          getLayerFilter: this.getLayerFilter,
          facility: facility,
          doShowProfile: this.props.doShowProfile,
          handleCloseClick: handleCloseClick
        }) : filterLayerObj && showPrevFilter ? _react2.default.createElement(_FilterSelectorPrev2.default, {
          filterData: this.filterData,
          layerObj: this.state.layerObj
        }) : '',
        _react2.default.createElement(_Export2.default, {
          mapId: this.props.mapId,
          map: this.map,
          config: this.props.mapConfig,
          btnStyle: { right: showFilterModal && !showPrevFilter ? '260px' : filterBtnPos }
        })
      );
    }
  }]);

  return Map;
}(_react2.default.Component);

exports.default = Map;


Map.propTypes = {
  layers: _propTypes2.default.objectOf(_propTypes2.default.array).isRequired,
  mapConfig: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  styles: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
  mapId: _propTypes2.default.string.isRequired,
  layerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  locations: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  isSplitScreen: _propTypes2.default.bool.isRequired,
  isEnabled: _propTypes2.default.bool.isRequired,
  showFilterModal: _propTypes2.default.bool.isRequired,
  doShowProfile: _propTypes2.default.bool.isRequired,
  handleFilterClick: _propTypes2.default.func.isRequired,
  handleCloseClick: _propTypes2.default.func.isRequired,
  facility: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Map/Map.jsx