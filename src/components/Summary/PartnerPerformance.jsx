'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _BarChartStacked = require('./../Charts/BarChartStacked');

var _BarChartStacked2 = _interopRequireDefault(_BarChartStacked);

var _PieChart = require('./../Charts/PieChart');

var _PieChart2 = _interopRequireDefault(_PieChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./PartnerPerformance.scss');

var PartnerPerformance = function (_React$Component) {
  _inherits(PartnerPerformance, _React$Component);

  _createClass(PartnerPerformance, null, [{
    key: 'buildPieData',
    value: function buildPieData(partnerData, label) {
      var thisPartner = null;
      var thisMetric = null;
      var pieSeriesData = [];

      // loop through partners to build chart options
      Object.keys(partnerData).forEach(function (partnerProp) {
        if (partnerProp === 'dataDate') return false;

        thisPartner = partnerData[partnerProp];
        thisMetric = thisPartner.metrics[label];

        if (!thisMetric) return false;

        // build pie chart series data
        if (thisMetric.actual) {
          pieSeriesData.push({
            name: partnerProp,
            y: thisPartner.metrics[label].actual,
            color: thisPartner.options.color
          });
        }

        return true;
      });

      return pieSeriesData;
    }
  }, {
    key: 'buildBarData',
    value: function buildBarData(partnerData, label) {
      var thisPartner = null;
      var thisMetric = null;

      var barCategories = [];
      var actualDataSeries = [];
      var plannedDataSeries = [];
      var overDataSeries = [];
      var actual = 0;
      var plan = 0;
      var over = 0;

      // loop through partners to build chart options
      Object.keys(partnerData).forEach(function (partnerProp) {
        if (partnerProp === 'dataDate') return false;

        thisPartner = partnerData[partnerProp];
        thisMetric = thisPartner.metrics[label];

        if (!thisMetric) return false;

        // how much of the bar stack should be blue
        actual = thisMetric.actual >= thisMetric.planned ? thisMetric.planned : thisMetric.actual;
        // how much of the bar stack should be green
        over = thisMetric.actual >= thisMetric.planned ? thisMetric.actual - thisMetric.planned : 0;
        // how much of the bar stack should be gray
        plan = thisMetric.actual <= thisMetric.planned ? thisMetric.planned - thisMetric.actual : 0;

        // if all values are 0, don't add it to the series
        // to avoid empty bars (resulting from empty data)
        if (actual || plan || over) {
          // push the partner name to the categories list
          barCategories.push(partnerProp);
          // push the blue stack to the 'Actual' series data
          actualDataSeries.push(actual);
          // push the gray stack to the 'Planned' series data
          plannedDataSeries.push(plan);
          // push the green stsack to the 'Over' series data
          overDataSeries.push(over);
        }

        return true;
      });

      return {
        barCategories: barCategories,
        barSeries: [{
          name: 'Over',
          data: overDataSeries,
          color: '#66ba4b'
        }, {
          name: 'Planned',
          data: plannedDataSeries,
          color: '#dcdcdc'
        }, {
          name: 'Actual',
          data: actualDataSeries,
          color: '#349ac4'
        }]
      };
    }
  }, {
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

  function PartnerPerformance(props) {
    _classCallCheck(this, PartnerPerformance);

    var _this = _possibleConstructorReturn(this, (PartnerPerformance.__proto__ || Object.getPrototypeOf(PartnerPerformance)).call(this, props));

    var _this$props = _this.props,
        label = _this$props.label,
        metricData = _this$props.metricData,
        partnerData = _this$props.partnerData;
    var values = metricData.values;


    _this.state = {
      label: label,
      actual: values[values.length - 3],
      metricData: metricData,
      partnerData: partnerData,

      pieSeriesData: PartnerPerformance.buildPieData(partnerData, label),
      barData: PartnerPerformance.buildBarData(partnerData, label),
      tooltipOptions: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormatter: PartnerPerformance.tootltipPointFormatter
      },
      dataLabelOptions: {
        enabled: true,
        inside: true,
        formatter: PartnerPerformance.dataLabelFormatter,
        distance: 10,
        style: {
          color: 'black',
          fontFamily: '\'Montserrat\', sans-serif'
        }
      }
    };
    return _this;
  }

  _createClass(PartnerPerformance, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var label = nextProps.label,
          metricData = nextProps.metricData,
          partnerData = nextProps.partnerData;
      var values = metricData.values;


      this.setState({
        label: label,
        actual: values[values.length - 3],
        metricData: metricData,
        partnerData: partnerData,

        pieSeriesData: PartnerPerformance.buildPieData(partnerData, label),
        barData: PartnerPerformance.buildBarData(partnerData, label)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          label = _state.label,
          actual = _state.actual,
          pieSeriesData = _state.pieSeriesData,
          barData = _state.barData,
          tooltipOptions = _state.tooltipOptions,
          dataLabelOptions = _state.dataLabelOptions;
      var barCategories = barData.barCategories,
          barSeries = barData.barSeries;


      return _react2.default.createElement(
        'div',
        { className: 'summary-card partner-performance' },
        _react2.default.createElement(
          'h5',
          null,
          label + ' Partner Performance'
        ),
        _react2.default.createElement(
          'div',
          { className: 'partner-performance-wrapper' },
          _react2.default.createElement(
            'div',
            { className: 'actual-planned' },
            _react2.default.createElement(
              'span',
              { className: 'actual-planned-label' },
              'Actual vs Planned ' + label + ' (people)'
            ),
            barCategories.length ? _react2.default.createElement(_BarChartStacked2.default, {
              barCategories: { categories: barCategories },
              barSeries: { series: barSeries }
            }) : _react2.default.createElement(
              'p',
              null,
              'Insufficient Data for this bar chart, sorry!'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'partner-percent' },
            _react2.default.createElement(
              'span',
              { className: 'partner-percent-label' },
              'Partner Percent of Total (Actual): ' + actual.toLocaleString()
            ),
            pieSeriesData.length ? _react2.default.createElement(_PieChart2.default, {
              seriesName: label,
              seriesData: pieSeriesData,
              tooltipOptions: tooltipOptions,
              dataLabelOptions: dataLabelOptions,
              showInLegend: true
            }) : _react2.default.createElement(
              'p',
              null,
              'Insufficient Data for this pie chart, sorry!'
            )
          )
        )
      );
    }
  }]);

  return PartnerPerformance;
}(_react2.default.Component);

PartnerPerformance.propTypes = {
  label: _propTypes2.default.string.isRequired,
  partnerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  metricData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = PartnerPerformance;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Summary/PartnerPerformance.jsx