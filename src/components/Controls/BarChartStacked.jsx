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

var BarChartStacked = function (_React$Component) {
  _inherits(BarChartStacked, _React$Component);

  _createClass(BarChartStacked, null, [{
    key: 'tooltipPointFormatter',
    value: function tooltipPointFormatter() {
      return '<b>' + this.series.name + ':</b> ' + this.y.toLocaleString();
    }
  }, {
    key: 'stackLabelsFormatter',
    value: function stackLabelsFormatter() {
      // Custom formatting to get the label below the bar as designed
      var over = this.axis.series[0].yData[this.x];
      var actual = this.axis.series[2].yData[this.x] + over;
      var planned = this.axis.series[1].yData[this.x] + this.axis.series[2].yData[this.x];
      var percent = 0;

      // Color to be used in styling the resulting percentage
      var color = actual > planned ? '#66ba4b' : '#349ac4';

      // Handle missing / zero data situations
      if (planned !== 0) {
        percent = Math.floor(actual / planned * 100).toLocaleString();
      } else if (planned === 0 && actual !== 0) {
        percent = 'NaN';
      }

      return actual.toLocaleString() + ' of ' + planned.toLocaleString() + ' planned <span style="color:' + color + ';">(' + percent + '%)</span>';
    }
  }]);

  function BarChartStacked(props) {
    _classCallCheck(this, BarChartStacked);

    var _this = _possibleConstructorReturn(this, (BarChartStacked.__proto__ || Object.getPrototypeOf(BarChartStacked)).call(this, props));

    var _this$props = _this.props,
        barCategories = _this$props.barCategories,
        barSeries = _this$props.barSeries;


    _this.state = {
      chart: {
        type: 'bar'
      },
      title: {
        text: null
      },
      tooltip: {
        headerFormat: '',
        pointFormatter: BarChartStacked.tooltipPointFormatter
      },
      xAxis: {
        categories: barCategories.categories,
        labels: {
          align: 'right'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        },
        stackLabels: {
          enabled: true,
          align: 'left',
          verticalAlign: 'bottom',
          y: 15,
          formatter: BarChartStacked.stackLabelsFormatter
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        bar: {
          cursor: 'pointer',
          stacking: 'normal',
          dataLabels: {
            enabled: false
          }
        }
      },
      series: barSeries.series,
      credits: {
        enabled: false
      }
    };
    return _this;
  }

  _createClass(BarChartStacked, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.chart = _highcharts2.default.chart(this.chartEl, this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.chart.destroy();
      var barSeries = nextProps.barSeries,
          barCategories = nextProps.barCategories;

      this.setState({
        series: barSeries.series,
        xAxis: {
          categories: barCategories.categories,
          labels: {
            align: 'right'
          }
        }
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.chart = _highcharts2.default.chart(this.chartEl, this.state);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.chart.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('div', { ref: function ref(el) {
          _this2.chartEl = el;
        } });
    }
  }]);

  return BarChartStacked;
}(_react2.default.Component);

BarChartStacked.propTypes = {
  barCategories: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  barSeries: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = BarChartStacked;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/BarChartStacked.jsx