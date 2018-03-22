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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineChart = function (_React$Component) {
  _inherits(LineChart, _React$Component);

  _createClass(LineChart, null, [{
    key: 'tooltipPointFormatter',
    value: function tooltipPointFormatter() {
      var dateStr = _highcharts2.default.dateFormat('%b %Y', new Date(this.x));
      var valueStr = this.y.toLocaleString();
      return '<b>' + dateStr + '</b>: ' + valueStr;
    }
  }, {
    key: 'yAxisLabelFormatter',
    value: function yAxisLabelFormatter() {
      // console.log('LineChart.props.target?', LineChart.props.target);
      return '' + this.value.toLocaleString();
    }
  }, {
    key: 'renderTargetPlotLine',
    value: function renderTargetPlotLine(chart, target) {
      // check to see if the plotline will fall within the min and max
      var yExtremes = chart.yAxis[0].getExtremes();
      if (target > yExtremes.max) {
        // if not, set the max extreme to the target to garauntee rendering
        chart.yAxis[0].setExtremes(0, target);
      }

      // render the target plot line
      chart.yAxis[0].addPlotLine({
        value: target,
        color: '#66ba4b',
        width: 2,
        id: 'targetPlotLine'
      });

      // render the text label for the plot line
      var text = chart.renderer.text('<b>Target</b> ' + target.toLocaleString(), 10, chart.yAxis[0].toPixels(target) + 15).attr({
        fill: '#66ba4b',
        fontFamily: '\'Montserrat\', sans-serif',
        zIndex: 8
      }).add();

      // render a white rectangle behind the text in case of overlapping elements
      chart.renderer.rect(text.getBBox().x, text.getBBox().y, text.getBBox().width, text.getBBox().height).attr({
        fill: '#fff',
        zIndex: 7
      }).add();
    }
  }]);

  function LineChart(props) {
    _classCallCheck(this, LineChart);

    var _this = _possibleConstructorReturn(this, (LineChart.__proto__ || Object.getPrototypeOf(LineChart)).call(this, props));

    _this.renderCustomElements = _this.renderCustomElements.bind(_this);
    var _this$props = _this.props,
        categories = _this$props.categories,
        series = _this$props.series,
        indicator = _this$props.indicator,
        pointClickCallback = _this$props.pointClickCallback,
        chartTitle = _this$props.chartTitle,
        chartHeight = _this$props.chartHeight;


    _this.state = {
      chart: {
        type: 'line',
        height: chartHeight || 200,
        backgroundColor: 'rgba(255,255,255,0)'
      },
      title: {
        text: chartTitle || null
      },
      plotOptions: {
        line: {
          showInLegend: series.length > 1
        }
        // from service-mapping
        // dataLabels: {
        //   enabled: false,
        // },
        // series: {
        //   cursor: 'pointer',
        //   animation: false,
        //   events: {
        //     click: (e) => {
        //       pointClickCallback(e);
        //     },
        //   },
        // },
      },
      tooltip: {
        headerFormat: '',
        pointFormatter: LineChart.tooltipPointFormatter
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%b %y',
          week: '%d %b %y',
          month: '%b %Y',
          year: '%b %Y'
        }
        // from service-mapping
        // categories: categories.categories,
      },
      yAxis: {
        title: {
          text: indicator || null
        },
        min: 0,
        tickAmount: 4,
        endOnTick: false,
        labels: {
          formatter: LineChart.yAxisLabelFormatter,
          y: 12,
          x: 0,
          align: 'left',
          style: {
            zIndex: -20
          }
        }
      },
      legend: {
        enabled: false
      },
      series: series.series,
      credits: {
        enabled: false
      }
    };
    return _this;
  }

  _createClass(LineChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var self = this;
      setTimeout(function () {
        self.chart = _highcharts2.default.chart(self.chartEl, self.state, _this2.renderCustomElements);
      }, 300);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (this.chart) {
        this.chart.destroy();
      }
      var categories = nextProps.categories,
          series = nextProps.series,
          indicator = nextProps.indicator;


      this.setState({
        // xAxis: {
        //   categories: categories.categories,
        // },
        yAxis: {
          title: {
            text: indicator || null
          }
        },
        series: series.series
      }, function () {
        _this3.chart = _highcharts2.default.chart(_this3.chartEl, _this3.state, _this3.renderCustomElements);
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.chart = _highcharts2.default.chart(this.chartEl, this.state, this.renderCustomElements);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    }

    // a callback function to render custom SVG elements
    // after chart is rendered from options. This is akin to D3

  }, {
    key: 'renderCustomElements',
    value: function renderCustomElements(chart) {
      var target = this.props.target;

      if (typeof target !== 'undefined' && target) {
        LineChart.renderTargetPlotLine(chart, target);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement('div', { ref: function ref(el) {
          _this4.chartEl = el;
        } });
    }
  }]);

  return LineChart;
}(_react2.default.Component);

LineChart.propTypes = {
  target: _propTypes2.default.number.isRequired,
  categories: _propTypes2.default.objectOf(_propTypes2.default.array).isRequired,
  series: _propTypes2.default.objectOf(_propTypes2.default.array).isRequired,
  indicator: _propTypes2.default.string.isRequired,
  pointClickCallback: _propTypes2.default.func.isRequired,
  chartTitle: _propTypes2.default.string.isRequired,
  chartHeight: _propTypes2.default.number.isRequired
};

exports.default = LineChart;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/LineChart.jsx