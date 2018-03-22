'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _LineChart = require('./../Charts/LineChart');

var _LineChart2 = _interopRequireDefault(_LineChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReportingPeriodNav = function (_React$Component) {
  _inherits(ReportingPeriodNav, _React$Component);

  _createClass(ReportingPeriodNav, null, [{
    key: 'buildSeries',
    value: function buildSeries(indicator, profileData) {
      var rpIndex = profileData.rpIndex,
          services = profileData.services;

      var reportingPeriods = profileData.reportingPeriods.reportingPeriods;
      var servicesKeys = [];
      var i = void 0; // iterator for reporting periods
      var k = void 0; // iterator for service keys
      var sKeys = void 0; // array of service keys
      var rp = void 0; // map of services per reporting period
      // let rpService; // service item within rp
      var categories = []; // reporting periods

      // loop through all reporting periods and define all services offered throughout
      if (services && reportingPeriods) {
        for (i = 0; i < reportingPeriods.length; i += 1) {
          rp = Object.assign({}, services[reportingPeriods[i]]);
          // add the reporting period to the categories array
          categories.push(reportingPeriods[i].replace(/_/g, ' '));
          sKeys = Object.keys(rp);
          // loop through the reporting period's service keys
          for (k = 0; k < sKeys.length; k += 1) {
            // if a service key doesn't exist in the array, add it
            if (servicesKeys.indexOf(sKeys[k]) === -1) {
              servicesKeys.push(sKeys[k]);
            }
          }
        }
      }

      var seriesDataMap = {};
      var sKey = void 0; // string for iterating upon the service keys
      var datum = void 0; // object for series data points

      // loop through all reporting periods
      if (reportingPeriods) {
        for (i = 0; i < reportingPeriods.length; i += 1) {
          rp = Object.assign({}, services[reportingPeriods[i]]);

          // loop through all service keys
          for (k = 0; k < servicesKeys.length; k += 1) {
            sKey = servicesKeys[k];
            // if service key isn't on the map, add it
            if (!seriesDataMap[sKey]) {
              seriesDataMap[sKey] = {
                name: sKey + ' ' + indicator,
                data: []
              };
            }

            // if this reporting period is missing this service key add null
            if (!rp[sKey]) {
              datum = null;
              // otherwise define the data point using the indicator total
            } else {
              datum = {
                y: Number(rp[sKey][indicator].total),
                marker: { enabled: true }
              };
              // if this reporting period is the active reporting period
              if (i === rpIndex) {
                // style the marker differently
                datum.marker.radius = 7;
              }
            }
            // push null or the data point to the correct seires array
            seriesDataMap[sKey].data.push(datum);
          }
        }
      }

      // return an array of series and an array of categories
      return {
        series: Object.keys(seriesDataMap).map(function (series) {
          return seriesDataMap[series];
        }),
        categories: categories
      };
    }
  }]);

  function ReportingPeriodNav(props) {
    _classCallCheck(this, ReportingPeriodNav);

    var _this = _possibleConstructorReturn(this, (ReportingPeriodNav.__proto__ || Object.getPrototypeOf(ReportingPeriodNav)).call(this, props));

    var _this$props = _this.props,
        reportingPeriods = _this$props.reportingPeriods,
        rpIndex = _this$props.rpIndex,
        services = _this$props.services;


    _this.state = {
      reportingPeriods: reportingPeriods.reportingPeriods,
      rpIndex: rpIndex,
      services: services,
      indicator: 'Admitted',
      seriesData: ReportingPeriodNav.buildSeries('Admitted', _this.props)
    };
    return _this;
  }

  _createClass(ReportingPeriodNav, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var reportingPeriods = nextProps.reportingPeriods,
          rpIndex = nextProps.rpIndex,
          services = nextProps.services;


      this.setState({
        reportingPeriods: reportingPeriods.reportingPeriods,
        rpIndex: rpIndex,
        services: services,
        seriesData: ReportingPeriodNav.buildSeries(this.state.indicator, nextProps)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          seriesData = _state.seriesData,
          indicator = _state.indicator,
          rpIndex = _state.rpIndex,
          reportingPeriods = _state.reportingPeriods;

      var rpOptions = reportingPeriods ? reportingPeriods.map(function (rp, i) {
        return _react2.default.createElement(
          'option',
          { value: i, key: i, selected: i === rpIndex },
          rp.replace(/_/g, ' ')
        );
      }) : '';

      return _react2.default.createElement(
        'div',
        { className: 'indicators-section-header' },
        _react2.default.createElement(
          'span',
          null,
          'Reporting Period:'
        ),
        _react2.default.createElement('i', {
          className: 'rpNav glyphicon glyphicon-triangle-left\n            ' + (rpIndex === 0 ? ' disabled' : ''),
          onClick: function onClick(e) {
            _this2.props.rpNavClick(e, 'prev');
          },
          role: 'button',
          tabIndex: '-1'
        }),
        _react2.default.createElement(
          'select',
          { className: 'rpSelect', onChange: function onChange(e) {
              _this2.props.rpNavClick(e);
            }, role: 'button' },
          rpOptions
        ),
        _react2.default.createElement('i', {
          className: 'rpNav glyphicon glyphicon-triangle-right\n            ' + (reportingPeriods && rpIndex === reportingPeriods.length - 1 ? ' disabled' : ''),
          onClick: function onClick(e) {
            _this2.props.rpNavClick(e, 'next');
          },
          role: 'button',
          tabIndex: '-1'
        }),
        _react2.default.createElement(_LineChart2.default, {
          categories: { categories: seriesData.categories },
          series: { series: seriesData.series },
          indicator: indicator,
          verticalMark: reportingPeriods[rpIndex] ? reportingPeriods[rpIndex].replace(/_/g, ' ') : '',
          pointClickCallback: this.props.updateReportingPeriod
        })
      );
    }
  }]);

  return ReportingPeriodNav;
}(_react2.default.Component);

ReportingPeriodNav.propTypes = {
  reportingPeriods: _propTypes2.default.objectOf(_propTypes2.default.array).isRequired,
  rpIndex: _propTypes2.default.number.isRequired,
  rpNavClick: _propTypes2.default.func.isRequired,
  services: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  updateReportingPeriod: _propTypes2.default.func.isRequired
};

exports.default = ReportingPeriodNav;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/ProfileView/ReportingPeriodNav.jsx