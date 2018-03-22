'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

var _utils = require('./../../includes/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ColumnChart = function (_React$Component) {
  _inherits(ColumnChart, _React$Component);

  _createClass(ColumnChart, null, [{
    key: 'pointFormatterFunc',
    value: function pointFormatterFunc() {
      return '<span>' + this.name + ': ' + this.y + '%</span>';
    }
  }]);

  function ColumnChart(props) {
    _classCallCheck(this, ColumnChart);

    var _this = _possibleConstructorReturn(this, (ColumnChart.__proto__ || Object.getPrototypeOf(ColumnChart)).call(this, props));

    var _this$props = _this.props,
        seriesTitle = _this$props.seriesTitle,
        seriesData = _this$props.seriesData,
        chartHeight = _this$props.chartHeight,
        chartWidth = _this$props.chartWidth,
        categories = _this$props.categories,
        yAxisLabel = _this$props.yAxisLabel;


    _this.state = {
      chart: {
        type: 'column',
        height: chartHeight || 225,
        width: chartWidth || 600,
        backgroundColor: 'rgba(255,255,255,0)',
        spacingTop: 15,
        spacintRight: 10
      },
      xAxis: {
        categories: categories,
        labels: {
          style: {
            fontSize: 9
          }
        }
      },
      yAxis: [{
        title: {
          text: yAxisLabel && yAxisLabel || 'Target Percentage (%)',
          y: 10
        },
        endOnTick: false
      }, {
        linkedTo: 0,
        opposite: true,
        title: {
          text: yAxisLabel && yAxisLabel || 'Target Percentage (%)',
          y: 10,
          x: -10
        }
      }],
      tooltip: {
        useHTML: false,
        headerFormat: '',
        pointForamt: '',
        shadow: false,
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0
      },
      title: {
        text: seriesTitle || null
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          showInLegend: false,
          pointPadding: 0,
          tooltip: {
            distance: 0,
            padding: 0,
            pointFormatter: ColumnChart.pointFormatterFunc
          }
        }
      },
      series: [{
        name: seriesTitle,
        data: seriesData
      }]
    };
    return _this;
  }

  _createClass(ColumnChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      setTimeout(function () {
        self.chart = _highcharts2.default.chart(self.chartEl, self.state);
      }, 300);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var seriesTitle = nextProps.seriesTitle,
          seriesData = nextProps.seriesData,
          chartHeight = nextProps.chartHeight,
          chartWidth = nextProps.chartWidth,
          categories = nextProps.categories;


      if ((0, _utils.isNewSeriesData)(this.state.series[0].data, seriesData)) {
        this.chart.destroy();

        this.setState({
          chart: Object.assign({}, this.state.chart, {
            height: chartHeight || 250,
            width: chartWidth || 600
          }),
          title: {
            text: seriesTitle || null
          },
          xAxis: {
            categories: categories,
            labels: {
              style: {
                fontSize: 9
              }
            }
          },
          series: [{
            name: seriesTitle,
            data: seriesData
          }]
        }, function () {
          _this2.chart = _highcharts2.default.chart(_this2.chartEl, _this2.state);
        });
      } else if (this.chart && (chartWidth !== this.chart.chartWidth || this.chart.chartHeight)) {
        this.chart.setSize(chartWidth, chartHeight);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.chart) this.chart.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', { ref: function ref(el) {
          _this3.chartEl = el;
        } });
    }
  }]);

  return ColumnChart;
}(_react2.default.Component);

ColumnChart.propTypes = {
  seriesData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  seriesTitle: _propTypes2.default.string.isRequired,
  chartWidth: _propTypes2.default.number.isRequired,
  chartHeight: _propTypes2.default.number.isRequired,
  categories: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  yAxisLabel: _propTypes2.default.string.isRequired
};

exports.default = ColumnChart;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/ColumnChart.jsx