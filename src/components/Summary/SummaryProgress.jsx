'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ProgressMetric = require('./ProgressMetric');

var _ProgressMetric2 = _interopRequireDefault(_ProgressMetric);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SummaryProgress = function (_React$Component) {
  _inherits(SummaryProgress, _React$Component);

  _createClass(SummaryProgress, null, [{
    key: 'parseSectorTotals',
    value: function parseSectorTotals(currentSectorData, sectorConfig) {
      var rawSectorValues = currentSectorData.values;
      var summaryTotals = {
        target: rawSectorValues[rawSectorValues.length - 2],
        actual: rawSectorValues[rawSectorValues.length - 3],
        iconFilename: sectorConfig.iconFilename,
        description: sectorConfig.description
      };

      return summaryTotals;
    }
  }, {
    key: 'parseMetricTotals',
    value: function parseMetricTotals(currentSectorData, sectorConfig) {
      var metrics = currentSectorData.metrics;

      if (!metrics) return [];
      var i = 0;
      var metricProp = '';
      var thisMetric = null;
      var metricTotals = [];

      for (i; i < metrics.length; i += 1) {
        metricProp = metrics[i];
        thisMetric = currentSectorData[metricProp];
        if (thisMetric) {
          metricTotals.push({
            label: metricProp,
            description: sectorConfig[metricProp].description,
            target: thisMetric.values[thisMetric.values.length - 4],
            actual: thisMetric.values[thisMetric.values.length - 3],
            iconFilename: sectorConfig[metricProp].iconFilename
          });
        }
      }

      return metricTotals;
    }
  }]);

  function SummaryProgress(props) {
    _classCallCheck(this, SummaryProgress);

    var _this = _possibleConstructorReturn(this, (SummaryProgress.__proto__ || Object.getPrototypeOf(SummaryProgress)).call(this, props));

    var _this$props = _this.props,
        currentSectorData = _this$props.currentSectorData,
        currentSector = _this$props.currentSector,
        sectorConfig = _this$props.sectorConfig,
        iconDir = _this$props.iconDir;


    _this.state = {
      currentSector: currentSector,
      currentSectorData: currentSectorData,
      sectorConfig: sectorConfig,
      iconDir: iconDir,

      sectorTotals: SummaryProgress.parseSectorTotals(currentSectorData, sectorConfig),
      metricTotals: SummaryProgress.parseMetricTotals(currentSectorData, sectorConfig)
    };
    return _this;
  }

  _createClass(SummaryProgress, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currentSectorData = nextProps.currentSectorData,
          currentSector = nextProps.currentSector,
          sectorConfig = nextProps.sectorConfig,
          iconDir = nextProps.iconDir;

      this.setState({
        currentSector: currentSector,
        currentSectorData: currentSectorData,
        sectorConfig: sectorConfig,
        iconDir: iconDir,

        sectorTotals: SummaryProgress.parseSectorTotals(currentSectorData, sectorConfig),
        metricTotals: SummaryProgress.parseMetricTotals(currentSectorData, sectorConfig)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          currentSector = _state.currentSector,
          sectorTotals = _state.sectorTotals,
          metricTotals = _state.metricTotals,
          iconDir = _state.iconDir;

      sectorTotals.label = currentSector;

      var Metrics = metricTotals.map(function (metric) {
        return _react2.default.createElement(_ProgressMetric2.default, {
          key: metric.label,
          type: 'metric-progress',
          iconDir: iconDir,
          metricData: metric
        });
      });

      return _react2.default.createElement(
        'div',
        { className: 'summary-card metric-aggregates', 'data-currentsector': currentSector },
        _react2.default.createElement(
          'h5',
          null,
          'Progress Towards Target'
        ),
        _react2.default.createElement(_ProgressMetric2.default, {
          type: 'total-progress',
          iconDir: iconDir,
          metricData: sectorTotals
        }),
        _react2.default.createElement(
          'div',
          { className: 'metrics clearfix' },
          Metrics
        )
      );
    }
  }]);

  return SummaryProgress;
}(_react2.default.Component);

SummaryProgress.propTypes = {
  currentSector: _propTypes2.default.string.isRequired,
  currentSectorData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  sectorConfig: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  iconDir: _propTypes2.default.string.isRequired
};

exports.default = SummaryProgress;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Summary/SummaryProgress.jsx