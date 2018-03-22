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

var PieChart = function (_React$Component) {
  _inherits(PieChart, _React$Component);

  _createClass(PieChart, null, [{
    key: 'tootltipPointFormatter',
    value: function tootltipPointFormatter() {
      return '' + this.y.toLocaleString();
    }
  }, {
    key: 'dataLabelFormatter',
    value: function dataLabelFormatter() {
      return Math.round(this.percentage) + '%';
    }
  }]);

  function PieChart(props) {
    _classCallCheck(this, PieChart);

    var _this = _possibleConstructorReturn(this, (PieChart.__proto__ || Object.getPrototypeOf(PieChart)).call(this, props));

    var _this$props = _this.props,
        seriesName = _this$props.seriesName,
        seriesData = _this$props.seriesData,
        seriesTitle = _this$props.seriesTitle,
        chartHeight = _this$props.chartHeight,
        chartWidth = _this$props.chartWidth,
        donut = _this$props.donut,
        tooltipOptions = _this$props.tooltipOptions,
        dataLabelOptions = _this$props.dataLabelOptions,
        legendOptions = _this$props.legendOptions,
        showInLegend = _this$props.showInLegend,
        chartSpacing = _this$props.chartSpacing,
        titleOptions = _this$props.titleOptions;


    _this.state = {
      chart: {
        type: 'pie',
        width: chartWidth,
        height: chartHeight,
        backgroundColor: 'rgba(255,255,255,0)',
        spacing: chartSpacing && chartSpacing.spacing || [10, 10, 15, 10]
      },
      title: titleOptions || {
        text: seriesTitle || null
      },
      tooltip: tooltipOptions || {},
      plotOptions: {
        pie: {
          cursor: 'pointer',
          hover: {
            enabled: true
          },
          states: {
            hover: {
              halo: false
            }
          },
          dataLabels: dataLabelOptions || {
            enabled: true,
            inside: true,
            formatter: function dataLabelFormatter() {
              if (this.y !== 0) {
                return Math.round(this.percentage) + '%';
              }
              return null;
            },
            distance: -24,
            style: {
              color: 'black',
              fontFamily: '\'Montserrat\', sans-serif'
            }
          },
          showInLegend: showInLegend || false
        }
      },
      legend: legendOptions || {
        enabled: false
      },
      series: [{
        name: seriesName,
        colorByPoint: true,
        innerSize: donut ? donut + '%' : '0%',
        data: seriesData
      }],
      credits: {
        enabled: false
      }
    };
    return _this;
  }

  _createClass(PieChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.chart = _highcharts2.default.chart(this.chartEl, this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var seriesName = nextProps.seriesName,
          seriesData = nextProps.seriesData,
          seriesTitle = nextProps.seriesTitle,
          chartHeight = nextProps.chartHeight,
          chartWidth = nextProps.chartWidth,
          titleOptions = nextProps.titleOptions,
          donut = nextProps.donut;


      if ((0, _utils.isNewSeriesData)(this.state.series[0].data, seriesData)) {
        this.chart.destroy();

        this.setState({
          chart: Object.assign({}, this.state.chart, {
            height: chartHeight,
            width: chartWidth
          }),
          title: titleOptions || {
            text: seriesTitle || null
          },
          series: [{
            name: seriesName,
            colorByPoint: true,
            innerSize: donut ? donut + '%' : '0%',
            data: nextProps.seriesData
          }]
        }, function () {
          _this2.chart = _highcharts2.default.chart(_this2.chartEl, _this2.state);
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.chart.destroy();
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

  return PieChart;
}(_react2.default.Component);

PieChart.propTypes = {
  seriesName: _propTypes2.default.string.isRequired,
  seriesData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  seriesTitle: _propTypes2.default.string.isRequired,
  chartWidth: _propTypes2.default.number.isRequired,
  chartHeight: _propTypes2.default.number.isRequired,
  donut: _propTypes2.default.number.isRequired,
  tooltipOptions: _propTypes2.default.objectOf(_propTypes2.default.any),
  dataLabelOptions: _propTypes2.default.objectOf(_propTypes2.default.any),
  legendOptions: _propTypes2.default.objectOf(_propTypes2.default.any),
  chartSpacing: _propTypes2.default.objectOf(_propTypes2.default.any),
  titleOptions: _propTypes2.default.objectOf(_propTypes2.default.any),
  showInLegend: _propTypes2.default.bool
};

PieChart.defaultProps = {
  tooltipOptions: false,
  dataLabelOptions: false,
  legendOptions: false,
  chartSpacing: false,
  titleOptions: false,
  showInLegend: false
};

exports.default = PieChart;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/PieChart.jsx