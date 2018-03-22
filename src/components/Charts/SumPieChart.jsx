'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _PieChart = require('./PieChart');

var _PieChart2 = _interopRequireDefault(_PieChart);

var _utils = require('./../../includes/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SumPieChart = function (_React$Component) {
  _inherits(SumPieChart, _React$Component);

  _createClass(SumPieChart, null, [{
    key: 'tooltipFormatter',
    value: function tooltipFormatter() {
      return '<div style="text-align:center;">\n              <b style="font-size:30px">' + this.y + '</b>\n              <br>\n              <span style="font-size:12px">' + this.point.options.x + '</span>\n            </div>';
    }
  }, {
    key: 'tooltipPositioner',
    value: function tooltipPositioner(labelWidth, labelHeight) {
      var chartHeight = this.chart.options.chart.height;

      return {
        x: chartHeight / 2 - labelWidth / 2,
        y: chartHeight / 2 - labelHeight / 2
      };
    }
  }, {
    key: 'buildPieData',
    value: function buildPieData(layerData, chartSpec, layer) {
      if (!chartSpec) return [];

      var breaks = layer.breaks,
          colors = layer.colors;


      var dataMap = {};
      var i = 0;
      var datum = null;
      var dBreak = void 0;
      var isLastbreak = void 0;
      var column = chartSpec.column; // column name definied by host
      var layerObj = layer.layerObj ? layer.layerObj : layer;

      var dataBreaks = void 0;
      if (breaks) {
        dataBreaks = layerData.map(function (d) {
          for (var b = 0; b < breaks.length; b += 1) {
            if (Number(d[column]) <= Number(breaks[b])) return b;
          }
          return breaks.length - 1;
        });
      }

      // Aggregate data
      if (chartSpec.type === 'status') {
        // loop through dataset
        for (i; i < layerData.length; i += 1) {
          datum = layerData[i];
          // check for status category in dataMap
          if (!dataMap[datum[column]]) {
            // create it if it doesn't exist
            dataMap[datum[column]] = {
              count: 0, // start with a count of 0
              color: layerObj.categories.color[datum[column] - 1], // define the color to use
              label: layerObj.categories.label[datum[column] - 1]
            };
          }
          // increment the count of the datum category
          dataMap[datum[column]].count += 1;
        }
      } else if (chartSpec.type === 'breaks') {
        for (i; i < layerData.length; i += 1) {
          datum = layerData[i];
          dBreak = dataBreaks[i];
          isLastbreak = dBreak === breaks.length - 1;
          if (!dataMap[dBreak]) {
            dataMap[dBreak] = {
              count: 0,
              color: colors[dBreak],
              label: !isLastbreak ? (!dBreak ? 0 : breaks[dBreak - 1]) + ' - ' + breaks[dBreak] : '+' + breaks[dBreak - 1]
            };
          }
          dataMap[dBreak].count += 1;
        }
      }

      // return an array suitable for Highcharts
      return Object.keys(dataMap).map(function (category) {
        return {
          name: dataMap[category].label,
          y: dataMap[category].count,
          x: chartSpec.level,
          color: (0, _utils.hexToRgbA)(dataMap[category].color, 0.8)
        };
      });
    }
  }]);

  function SumPieChart(props) {
    _classCallCheck(this, SumPieChart);

    var _this = _possibleConstructorReturn(this, (SumPieChart.__proto__ || Object.getPrototypeOf(SumPieChart)).call(this, props));

    var _this$props = _this.props,
        layerId = _this$props.layerId,
        layerData = _this$props.layerData,
        layer = _this$props.layer,
        chartSpec = _this$props.chartSpec;
    var prefix = chartSpec.prefix,
        suffix = chartSpec.suffix;

    _this.toggleChart = _this.toggleChart.bind(_this);

    _this.state = {
      isChartMin: false,
      layerId: layerId,
      chartSpec: chartSpec,
      seriesData: SumPieChart.buildPieData(layerData, chartSpec, layer),
      tooltipOptions: {
        backgroundColor: 'rgba(255,255,255,0)',
        borderWidth: 0,
        shadow: false,
        useHTML: true,
        formatter: SumPieChart.tooltipFormatter,
        positioner: SumPieChart.tooltipPositioner
      },
      legendOptions: {
        align: 'right',
        layout: 'vertical',
        floating: true,
        itemStyle: {
          lineHeight: 21
        },
        labelFormat: (prefix || '') + '{name}' + (suffix || ''),
        verticalAlign: 'middle',
        x: 110,
        y: 0
      },
      chartSpacing: {
        spacing: [10, 100, 10, 0]
      }
    };
    return _this;
  }

  _createClass(SumPieChart, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var layerId = nextProps.layerId,
          layerData = nextProps.layerData,
          layer = nextProps.layer,
          chartSpec = nextProps.chartSpec;


      this.setState({
        layerId: layerId,
        chartSpec: chartSpec,
        seriesData: SumPieChart.buildPieData(layerData, chartSpec, layer)
      });
    }
  }, {
    key: 'toggleChart',
    value: function toggleChart() {
      this.setState({
        isChartMin: !this.state.isChartMin
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          seriesName = _state.seriesName,
          seriesData = _state.seriesData,
          tooltipOptions = _state.tooltipOptions,
          legendOptions = _state.legendOptions,
          chartSpacing = _state.chartSpacing;
      var chartSpec = this.state.chartSpec;


      var chartClass = 'pie' + (this.state.isChartMin ? ' min' : '');

      return _react2.default.createElement(
        'div',
        { className: chartClass },
        chartSpec.title ? _react2.default.createElement(
          'h6',
          null,
          chartSpec.title
        ) : '',
        _react2.default.createElement(_PieChart2.default, {
          seriesName: seriesName,
          seriesData: seriesData,
          chartWidth: 325,
          chartHeight: 225,
          donut: 50,
          tooltipOptions: tooltipOptions,
          legendOptions: legendOptions,
          showInLegend: true,
          chartSpacing: chartSpacing
        })
      );
    }
  }]);

  return SumPieChart;
}(_react2.default.Component);

SumPieChart.propTypes = {
  layerId: _propTypes2.default.string.isRequired,
  layerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  chartSpec: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  layer: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = SumPieChart;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/SumPieChart.jsx