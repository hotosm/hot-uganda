'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _PieChart = require('../Charts/PieChart');

var _PieChart2 = _interopRequireDefault(_PieChart);

var _utils = require('./../../includes/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./ProfileView.scss');

var IndicatorRow = function (_React$Component) {
  _inherits(IndicatorRow, _React$Component);

  _createClass(IndicatorRow, null, [{
    key: 'buildPieData',
    value: function buildPieData(indicators) {
      var indicatorKeys = ['Recovered', 'Non-recovered', 'Defaulted', 'Died'];
      var populationKeys = ['boys', 'girls', 'pregnant'];
      var pieMap = {};
      var indicatorData = void 0;
      var datum = {};

      for (var i = 0; i < indicatorKeys.length; i += 1) {
        indicatorData = Object.assign({}, indicators[indicatorKeys[i]]);
        if (indicators[indicatorKeys[i]]) {
          pieMap[indicatorKeys[i]] = [];
        }

        for (var p = 0; p < populationKeys.length; p += 1) {
          if (indicatorData[populationKeys[p]]) {
            datum = {
              name: indicatorData[populationKeys[p]].label,
              y: indicatorData[populationKeys[p]].count,
              color: (0, _utils.hexToRgbA)(indicatorData[populationKeys[p]].color, 0.8),
              indicator: indicatorKeys[i]
            };

            if (datum.y === indicatorData.total) {
              datum.dataLabels = { distance: -65 };
            }

            pieMap[indicatorKeys[i]].push(datum);
          }
        }
      }

      return pieMap;
    }
  }, {
    key: 'pointFormatter',
    value: function pointFormatter() {
      return '<small>' + this.point.indicator + '</small>\n      <br/><span style={{color: ' + this.point.color + '}}>\u25CF</span>\n      ' + this.point.name + ': <b>' + this.y + '</b><br/>';
    }
  }, {
    key: 'headerFormatter',
    value: function headerFormatter() {
      return '<span>' + this.y + '</span><br/>';
    }
  }]);

  function IndicatorRow(props) {
    _classCallCheck(this, IndicatorRow);

    var _this = _possibleConstructorReturn(this, (IndicatorRow.__proto__ || Object.getPrototypeOf(IndicatorRow)).call(this, props));

    var services = _this.props.services;


    _this.state = {
      services: services,
      seriesData: IndicatorRow.buildPieData(services)
    };

    _this.showIndicators = _this.showIndicators.bind(_this);
    _this.showIndicatorBar = _this.showIndicatorBar.bind(_this);
    return _this;
  }

  _createClass(IndicatorRow, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        services: nextProps.services,
        facility: nextProps.facility,
        seriesData: IndicatorRow.buildPieData(nextProps.services)
      });
    }
  }, {
    key: 'showIndicators',
    value: function showIndicators(e) {
      e.preventDefault();
      this.setState({
        services: Object.assign({}, this.state.services, { isOpen: !this.state.services.isOpen })
      });
    }
  }, {
    key: 'showIndicatorBar',
    value: function showIndicatorBar(e, indicator) {
      e.preventDefault();
      this.setState({
        services: Object.assign({}, this.state.services, _defineProperty({}, indicator, Object.assign({}, this.state.services[indicator], { isOpen: !this.state.services[indicator].isOpen })))
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          seriesData = _state.seriesData,
          services = _state.services;

      var indicatorKeys = ['Recovered', 'Non-recovered', 'Defaulted', 'Died'];
      var indicatorRows = [];
      var indicatorData = void 0;
      var indicator = void 0;

      var populationKeys = ['boys', 'girls', 'pregnant'];
      var populationRows = [];
      var populationData = void 0;
      var population = void 0;

      var barStacks = [];
      var stack = void 0;

      // Build out actual elements based on the data
      // Loop through indicators of the actual service

      var _loop = function _loop(i) {
        if (services[indicatorKeys[i]]) {
          indicatorData = services[indicatorKeys[i]];

          // Push stack elements for the stacked bar chart (breaking down total admissions)
          stack = _react2.default.createElement('span', {
            'data-balloon': indicatorKeys[i] + ': ' + services[indicatorKeys[i]].percentage.toString() + '%',
            'data-balloon-pos': 'up',
            style: {
              width: services.totals === 'NaN%' || services.totals === 0 ? '0%' : services[indicatorKeys[i]].percentage.toString() + '%',
              background: services[indicatorKeys[i]].color
            }
          });
          barStacks.push(stack);

          // Loop through population breakdowns of the indicator
          for (var _p = 0; _p < populationKeys.length; _p += 1) {
            if (indicatorData[populationKeys[_p]]) {
              populationData = indicatorData[populationKeys[_p]];
              // Push expandable population breakdown elements to an array for the indicator
              population = populationData.count !== 0 ? _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                  'td',
                  null,
                  populationData.count
                ),
                _react2.default.createElement(
                  'td',
                  null,
                  _react2.default.createElement('img', { alt: populationKeys[_p] + ' icon', src: populationData.icon })
                ),
                _react2.default.createElement(
                  'td',
                  null,
                  populationData.label
                )
              ) : null;
              populationRows.push(population);
            }
          }

          if (Number(indicatorData.total)) {
            // Define each indicator element (including population breakdowns)
            indicator = _react2.default.createElement(
              'li',
              null,
              _react2.default.createElement(
                'a',
                {
                  className: 'indicator-label indicator-item ' + indicatorKeys[i],
                  href: '#',
                  onClick: function onClick(e) {
                    _this2.showIndicatorBar(e, indicatorKeys[i]);
                  }
                },
                indicatorKeys[i],
                _react2.default.createElement(
                  'span',
                  { className: 'indicator-value' },
                  indicatorData.total
                ),
                _react2.default.createElement('span', { className: 'caret caret-' + (services[indicatorKeys[i]].isOpen ? 'down' : 'right') })
              ),
              services[indicatorKeys[i]].isOpen ? _react2.default.createElement(
                'ul',
                { className: 'indicator-bar' },
                _react2.default.createElement(
                  'li',
                  { className: 'indicators-section-header' },
                  _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement(
                      'table',
                      { className: 'pie-chart-legend' },
                      populationRows.map(function (p) {
                        return p;
                      })
                    ),
                    _react2.default.createElement(_PieChart2.default, {
                      seriesName: '',
                      seriesData: indicatorData.Recovered ? seriesData[indicatorKeys[i]].filter(function (x) {
                        return x.y > 0 && x.y !== null;
                      }) : seriesData[indicatorKeys[i]],
                      chartWidth: 170,
                      chartHeight: 170,
                      donut: 0,
                      chartLevel: indicatorKeys[i],
                      tooltipOptions: {
                        headerFormat: IndicatorRow.headerFormatter,
                        formatter: IndicatorRow.pointFormatter
                      }
                    })
                  )
                )
              ) : ''
            );
            indicatorRows.push(indicator);
          }
        }

        // Empty the population array before next iteration
        populationRows.length = 0;
      };

      for (var i = 0; i < indicatorKeys.length; i += 1) {
        _loop(i);
      }

      if (!barStacks.length) {
        for (var p = 0; p < populationKeys.length; p += 1) {
          if (services.Admitted && services.Admitted[populationKeys[p]]) {
            populationData = services.Admitted[populationKeys[p]];
            stack = _react2.default.createElement('span', {
              'data-balloon': services.Admitted[populationKeys[p]].label.replace('Number of ', '') + ': ' + services.Admitted[populationKeys[p]].percent.toString() + '%',
              'data-balloon-pos': 'up',
              style: {
                width: services.totals === 'NaN%' || services.totals === 0 ? '0%' : services.Admitted[populationKeys[p]].percent.toString() + '%',
                background: services.Admitted[populationKeys[p]].color
              }
            });
            barStacks.push(stack);
          }
        }
      }

      return services.totals !== 0 ? _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            'a',
            { className: 'service-name indicator-label', href: '#', onClick: function onClick(e) {
                return _this2.showIndicators(e);
              } },
            services.type,
            _react2.default.createElement(
              'div',
              { className: 'totals' },
              'Total Admitted'
            ),
            _react2.default.createElement(
              'span',
              { className: 'indicator-totals indicator-value' },
              services.totals
            ),
            _react2.default.createElement('span', { className: 'total ' + (services.Recovered ? 'caret' : '') + ' caret-' + (services.isOpen ? 'down' : 'right') }),
            _react2.default.createElement(
              'div',
              { className: 'progress progress-stacked' },
              barStacks
            )
          ),
          services.isOpen ? _react2.default.createElement(
            'ul',
            { className: 'indicators-list' },
            indicatorRows
          ) : ''
        )
      ) : null;
    }
  }]);

  return IndicatorRow;
}(_react2.default.Component);

IndicatorRow.propTypes = {
  services: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  facility: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = IndicatorRow;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/ProfileView/IndicatorRow.jsx