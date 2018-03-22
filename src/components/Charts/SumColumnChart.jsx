'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ColumnChart = require('./ColumnChart');

var _ColumnChart2 = _interopRequireDefault(_ColumnChart);

var _utils = require('./../../includes/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SumColumnChart = function (_React$Component) {
  _inherits(SumColumnChart, _React$Component);

  _createClass(SumColumnChart, null, [{
    key: 'buildColData',
    value: function buildColData(layerData, chartSpec, layer, locations) {
      if (!chartSpec) return [];

      var breaks = layer.breaks,
          colors = layer.colors;


      var dataMap = {};
      var categories = [];
      var i = 0;
      var datum = null;
      var column = chartSpec.column; // column name definied by host
      var catCol = '';
      var mapCol = false; // bool for whether or not to use the "locations" map

      // deifine which break each datum falls into
      var dataBreaks = void 0;
      if (breaks) {
        dataBreaks = layerData.map(function (d) {
          for (var b = 0; b < breaks.length; b += 1) {
            if (Number(d[column]) <= Number(breaks[b])) return b;
          }
          return breaks.length - 1;
        });
      }

      // Push the data into categorical buckets
      catCol = chartSpec.level;
      if (catCol === 'district_id' && locations && Object.keys(locations).length) mapCol = true;
      for (i; i < layerData.length; i += 1) {
        datum = layerData[i];
        if (!dataMap[datum[catCol]]) {
          dataMap[datum[catCol]] = {
            sum: 0,
            count: 0,
            color: '',
            name: !mapCol ? datum[catCol] : locations[datum[catCol]]
          };
        }
        dataMap[datum[catCol]].count += 1;
        dataMap[datum[catCol]].sum += Number(datum[column]);
        if (dataBreaks) dataMap[datum[catCol]].color = (0, _utils.hexToRgbA)(colors[dataBreaks[i]], 0.8);
      }

      // Structure the data in a way that highcharts can use
      var data = [];
      var dataKeys = Object.keys(dataMap);
      var category = void 0;
      for (var d = 0; d < dataKeys.length; d += 1) {
        category = dataKeys[d];
        if (typeof dataMap[category].name !== 'undefined') {
          data.push({
            name: dataMap[category].name,
            y: dataMap[category].sum / dataMap[category].count,
            color: dataMap[category].color
          });
        }
      }

      // Sort the data by value (greatest to lowest)
      data = data.sort(function (a, b) {
        return b.y - a.y;
      });
      // build the categories from sorted data
      for (i = 0; i < data.length; i += 1) {
        categories.push(data[i].name);
      }

      return {
        categories: categories,
        data: data
      };
    }
  }]);

  function SumColumnChart(props) {
    _classCallCheck(this, SumColumnChart);

    var _this = _possibleConstructorReturn(this, (SumColumnChart.__proto__ || Object.getPrototypeOf(SumColumnChart)).call(this, props));

    var _this$props = _this.props,
        layerId = _this$props.layerId,
        layerData = _this$props.layerData,
        chartSpec = _this$props.chartSpec,
        layer = _this$props.layer,
        isPrimary = _this$props.isPrimary,
        locations = _this$props.locations;
    var _this$props2 = _this.props,
        chartHeight = _this$props2.chartHeight,
        chartWidth = _this$props2.chartWidth,
        isFullBleed = _this$props2.isFullBleed,
        isChartMin = _this$props2.isChartMin;


    _this.state = {
      isChartMin: isPrimary ? isChartMin : false,
      layerId: layerId,
      chartSpec: chartSpec,
      layer: layer,
      chartHeight: chartHeight,
      chartWidth: chartWidth,
      isFullBleed: isFullBleed,
      isPrimary: isPrimary,
      seriesName: layerData.label,
      seriesData: SumColumnChart.buildColData(layerData, chartSpec, layer, locations)
    };
    return _this;
  }

  _createClass(SumColumnChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.isPrimary) {
        if (this.state.isFullBleed) {
          this.props.moveMapLedgend(175);
        }
        this.d_setChartWidth = (0, _utils.debounce)(this.setChartWidth, 200);
        $(window).on('toggleSector', this.setChartWidth.bind(this));
        $(window).on('resize', {
          mapId: this.props.mapId,
          sectorsId: this.props.mapId.replace('map-', 'sector-menu-') + '-wrapper'
        }, this.d_setChartWidth.bind(this));
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var layerId = nextProps.layerId,
          layerData = nextProps.layerData,
          chartSpec = nextProps.chartSpec,
          layer = nextProps.layer,
          isPrimary = nextProps.isPrimary,
          locations = nextProps.locations;
      var chartHeight = nextProps.chartHeight,
          chartWidth = nextProps.chartWidth,
          isFullBleed = nextProps.isFullBleed,
          isChartMin = nextProps.isChartMin;


      this.setState({
        layerId: layerId,
        chartSpec: chartSpec,
        layer: layer,
        isChartMin: isPrimary ? isChartMin : false,
        chartHeight: chartHeight,
        chartWidth: chartWidth,
        isFullBleed: isFullBleed,
        seriesData: SumColumnChart.buildColData(layerData, chartSpec, layer, locations)
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.state.isPrimary) {
        this.props.moveMapLedgend();
        $(window).off('toggleSector', this.setChartWidth);
        $(window).off('resize', this.d_setChartWidth);
      }
    }
  }, {
    key: 'setChartWidth',
    value: function setChartWidth(e, payload) {
      var _ref = payload || e.data,
          mapId = _ref.mapId,
          sectorsId = _ref.sectorsId;

      if (mapId === this.props.mapId) {
        var chartPosition = this.props.calcChartWidth(sectorsId);
        if (chartPosition.isFullBleed !== this.state.isFullBleed) {
          this.props.moveMapLedgend();
        } else {
          this.setState({
            chartWidth: chartPosition.chartWidth
          });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          seriesData = _state.seriesData,
          isChartMin = _state.isChartMin,
          isFullBleed = _state.isFullBleed,
          chartSpec = _state.chartSpec,
          isPrimary = _state.isPrimary;
      var _state2 = this.state,
          chartWidth = _state2.chartWidth,
          chartHeight = _state2.chartHeight;

      var chartClass = 'sumChart column' + (isChartMin ? ' min' : '');
      var containerHeight = isChartMin ? '24px' : chartHeight + 'px';
      var containerWidth = isChartMin ? '24px' : chartWidth;
      var containerRight = isChartMin ? '32px' : isFullBleed ? '0px' : '340px';

      return this.state.isChartMin ? null : _react2.default.createElement(
        'div',
        {
          className: '' + (isPrimary ? chartClass : 'column'),
          style: {
            width: containerWidth,
            height: containerHeight,
            right: containerRight,
            bottom: '0px'
          }
        },
        !isPrimary && chartSpec.title ? _react2.default.createElement(
          'h6',
          null,
          chartSpec.title
        ) : '',
        _react2.default.createElement(_ColumnChart2.default, {
          seriesTitle: chartSpec.title,
          categories: seriesData.categories,
          seriesData: seriesData.data,
          targetMark: 1,
          chartWidth: chartWidth,
          chartHeight: chartHeight,
          yAxisLabel: chartSpec['y-axis-label']
        }),
        !isPrimary ? '' : this.props.children
      );
    }
  }]);

  return SumColumnChart;
}(_react2.default.Component);

SumColumnChart.propTypes = {
  mapId: _propTypes2.default.string.isRequired,
  layerId: _propTypes2.default.string.isRequired,
  layerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  chartSpec: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  layer: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  children: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  locations: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  chartHeight: _propTypes2.default.number.isRequired,
  chartWidth: _propTypes2.default.number.isRequired,
  isChartMin: _propTypes2.default.bool.isRequired,
  isFullBleed: _propTypes2.default.bool.isRequired,
  isPrimary: _propTypes2.default.bool.isRequired,
  calcChartWidth: _propTypes2.default.func.isRequired,
  moveMapLedgend: _propTypes2.default.func.isRequired
};

exports.default = SumColumnChart;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/SumColumnChart.jsx