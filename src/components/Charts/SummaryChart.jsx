'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _SumPieChart = require('./SumPieChart');

var _SumPieChart2 = _interopRequireDefault(_SumPieChart);

var _SumColumnChart = require('./SumColumnChart');

var _SumColumnChart2 = _interopRequireDefault(_SumColumnChart);

var _SumChartMinimize = require('./SumChartMinimize');

var _SumChartMinimize2 = _interopRequireDefault(_SumChartMinimize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./SummaryChart.scss');

var SummaryChart = function (_React$Component) {
  _inherits(SummaryChart, _React$Component);

  _createClass(SummaryChart, null, [{
    key: 'defineCharts',
    value: function defineCharts(chartSpec) {
      var chartKeys = Object.keys(chartSpec);
      var charts = [];
      var primaryChart = null;

      for (var c = 0; c < chartKeys.length; c += 1) {
        if (chartKeys[c] === 'primary') {
          primaryChart = chartSpec[chartKeys[c]];
        } else if (chartSpec[chartKeys[c]] instanceof Array) {
          for (var i = 0; i < chartSpec[chartKeys[c]].length; i += 1) {
            charts.push({
              type: chartKeys[c],
              spec: chartSpec[chartKeys[c]][i]
            });
          }
        } else {
          charts.push({
            type: chartKeys[c],
            spec: chartSpec[chartKeys[c]]
          });
        }
      }

      // todo - add array.sort according to order prop set in MapSpec

      return { charts: charts, primaryChart: primaryChart };
    }
  }, {
    key: 'calcChartWidth',
    value: function calcChartWidth(sectorsId) {
      var windowWidth = $(window).outerWidth();
      var $sectors = $('#' + sectorsId + ' .sectors-menu');
      var sectorsMenuWidth = $sectors.css('display') === 'block' ? $sectors.outerWidth() : 0;
      var menuIsFixedLeft = $(window).outerHeight() === $('#menu').outerHeight() && !$('#menu').offset().top && !$('#menu').offset().left;
      var menuWidth = (menuIsFixedLeft ? $('#menu').outerWidth() : 0) + 20;
      var availbleWidth = windowWidth - sectorsMenuWidth - menuWidth;
      var minChartWidth = 650;
      var legendWidth = availbleWidth >= minChartWidth ? 340 : 0;

      return {
        chartWidth: availbleWidth - legendWidth,
        isFullBleed: !(availbleWidth >= minChartWidth)
      };
    }
  }, {
    key: 'calcLegendPosition',
    value: function calcLegendPosition(mapId) {
      var $legend = $('.legend.' + mapId);
      var legendHeight = $('.legend-row.primary', $legend).innerHeight(); // bottom of 40
      var legendBottom = $legend.innerHeight() - legendHeight + 40 + 12; // padding of 12

      return {
        height: legendHeight + 40,
        bottom: legendBottom
      };
    }
  }]);

  function SummaryChart(props) {
    _classCallCheck(this, SummaryChart);

    var _this = _possibleConstructorReturn(this, (SummaryChart.__proto__ || Object.getPrototypeOf(SummaryChart)).call(this, props));

    var _this$props = _this.props,
        layerId = _this$props.layerId,
        layer = _this$props.layer,
        mapId = _this$props.mapId,
        isChartMin = _this$props.isChartMin,
        legendBottom = _this$props.legendBottom,
        locations = _this$props.locations;

    var locationMap = {};
    var locationKeys = Object.keys(locations);
    for (var l = 0; l < locationKeys.length; l += 1) {
      locationMap[locations[locationKeys[l]]] = locationKeys[l];
    }

    var legendPosition = SummaryChart.calcLegendPosition(mapId);
    var chartSpecs = SummaryChart.defineCharts(layer.charts);
    var primaryChartPosition = chartSpecs && !chartSpecs.primaryChart ? { chartWidth: 0, isFullBleed: false } : SummaryChart.calcChartWidth('sector-menu-' + mapId.replace('map-', '') + '-wrapper');

    $('.legend.' + _this.props.mapId).css('bottom', legendBottom);

    _this.state = {
      layerId: layerId,
      layer: layer,
      chartHeight: legendPosition.height,
      buttonBottom: legendPosition.bottom,
      isChartMin: isChartMin,
      doShowModal: false,
      layerData: layer.layerObj ? layer.data : layer.mergedData,
      charts: chartSpecs.charts,
      primaryChart: chartSpecs.primaryChart,
      chartWidth: primaryChartPosition.chartWidth,
      isFullBleed: primaryChartPosition.isFullBleed,
      locations: locationMap
    };

    _this.moveMapLedgend = _this.moveMapLedgend.bind(_this);
    _this.onOpenModalClick = _this.onOpenModalClick.bind(_this);
    _this.onCloseModalClick = _this.onCloseModalClick.bind(_this);
    _this.toggleChart = _this.toggleChart.bind(_this);
    return _this;
  }

  _createClass(SummaryChart, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var layerId = nextProps.layerId,
          layer = nextProps.layer,
          mapId = nextProps.mapId,
          isChartMin = nextProps.isChartMin,
          legendBottom = nextProps.legendBottom;

      var legendPosition = SummaryChart.calcLegendPosition(mapId);
      var chartSpecs = SummaryChart.defineCharts(layer.charts);
      var primaryChartPosition = chartSpecs && !chartSpecs.primaryChart ? { chartWidth: 0, isFullBleed: false } : SummaryChart.calcChartWidth('sector-menu-' + mapId.replace('map-', '') + '-wrapper');

      $('.legend.' + this.props.mapId).css('bottom', legendBottom);

      this.setState({
        layerId: layerId,
        layer: layer,
        chartHeight: legendPosition.height,
        buttonBottom: legendPosition.bottom,
        layerData: layer.layerObj ? layer.data : layer.mergedData,
        charts: chartSpecs.charts,
        primaryChart: chartSpecs.primaryChart,
        isChartMin: isChartMin,
        doShowModal: layerId === this.state.layerId ? this.state.doShowModal : false,
        chartWidth: primaryChartPosition.chartWidth,
        isFullBleed: primaryChartPosition.isFullBleed
      });
    }
  }, {
    key: 'onOpenModalClick',
    value: function onOpenModalClick(e) {
      if (e) e.preventDefault();
      this.setState({ doShowModal: !this.state.doShowModal });
    }
  }, {
    key: 'onCloseModalClick',
    value: function onCloseModalClick(e) {
      e.preventDefault();
      this.setState({ doShowModal: false });
    }
  }, {
    key: 'moveMapLedgend',
    value: function moveMapLedgend() {
      var _this2 = this;

      var isChartMin = this.state.isChartMin;

      var sectorsId = 'sector-menu-' + this.props.mapId.replace('map-', '') + '-wrapper';
      var legendPosition = SummaryChart.calcLegendPosition(this.props.mapId);
      var primaryChartPosition = SummaryChart.calcChartWidth(sectorsId);
      var legendBottom = !isChartMin ? primaryChartPosition.isFullBleed ? legendPosition.height + 20 : 40 : 40;

      $('.legend.' + this.props.mapId).css('bottom', legendBottom);
      this.setState({
        buttonBottom: legendBottom + 12,
        chartWidth: primaryChartPosition.chartWidth,
        isFullBleed: primaryChartPosition.isFullBleed
      }, function () {
        _this2.props.saveChartState(_this2.props.layerId, _this2.state.isChartMin, legendBottom);
      });
    }
  }, {
    key: 'toggleChart',
    value: function toggleChart() {
      var _this3 = this;

      var _state = this.state,
          isChartMin = _state.isChartMin,
          primaryChart = _state.primaryChart;

      if (primaryChart) {
        this.setState({
          isChartMin: !isChartMin,
          doShowModal: false
        }, function () {
          _this3.moveMapLedgend();
        });
      } else {
        this.onOpenModalClick();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state2 = this.state,
          layerId = _state2.layerId,
          layerData = _state2.layerData,
          layer = _state2.layer,
          charts = _state2.charts,
          primaryChart = _state2.primaryChart,
          locations = _state2.locations;
      var _state3 = this.state,
          doShowModal = _state3.doShowModal,
          chartHeight = _state3.chartHeight,
          buttonBottom = _state3.buttonBottom,
          isFullBleed = _state3.isFullBleed,
          chartWidth = _state3.chartWidth;

      var chartKey = '';
      var sumCharts = [];
      var primarySumChart = null;
      var c = void 0;

      for (c = 0; c < charts.length; c += 1) {
        chartKey = charts[c].type + '-' + c;
        switch (charts[c].type) {
          case 'pie':
            sumCharts.push(_react2.default.createElement(_SumPieChart2.default, {
              key: chartKey,
              layerId: layerId,
              layer: layer,
              layerData: layerData,
              chartSpec: charts[c].spec,
              mapId: this.props.mapId
            }));
            break;
          case 'column':
            sumCharts.push(_react2.default.createElement(_SumColumnChart2.default, {
              key: chartKey,
              layer: layer,
              layerId: layerId,
              layerData: layerData,
              mapId: this.props.mapId,
              chartSpec: charts[c].spec,
              isPrimary: false,
              locations: locations
            }));
            break;
          default:
            console.error('Unexpected type of summary chart: ' + charts[c].type);
            break;
        }
      }

      if (primaryChart) {
        var primaryChartHeight = chartHeight >= 180 ? chartHeight : 180;
        switch (primaryChart.type) {
          case 'column':
          default:
            primarySumChart = _react2.default.createElement(
              _SumColumnChart2.default,
              {
                layerId: layerId,
                layer: layer,
                layerData: layerData,
                mapId: this.props.mapId,
                chartSpec: primaryChart.spec,
                moveMapLedgend: this.moveMapLedgend,
                onOpenModalClick: this.onOpenModalClick,
                doShowModal: doShowModal,
                saveChartState: this.props.saveChartState,
                isChartMin: this.state.isChartMin,
                chartHeight: primaryChartHeight,
                chartWidth: chartWidth,
                isFullBleed: isFullBleed,
                calcChartWidth: SummaryChart.calcChartWidth,
                locations: locations,
                isPrimary: true
              },
              sumCharts.length ? _react2.default.createElement('button', {
                className: 'toggleBtn glyphicon glyphicon-' + (doShowModal ? 'resize-small isOpen' : 'option-horizontal'),
                onClick: function onClick(e) {
                  _this4.onOpenModalClick(e);
                },
                alt: 'More Summary Charts',
                title: 'More Summary Charts'
              }) : null
            );
            break;
        }
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_SumChartMinimize2.default, { toggleChart: this.toggleChart, bottom: buttonBottom }),
        !this.state.isChartMin && primarySumChart ? primarySumChart : '',
        doShowModal && sumCharts.length ? _react2.default.createElement(
          'div',
          { className: 'sumChartModal ' + this.props.mapId },
          _react2.default.createElement(
            'div',
            { className: 'sumChartModalHeader' },
            _react2.default.createElement(
              'h4',
              null,
              this.state.layer.label || this.state.layer.layerObj.label
            ),
            _react2.default.createElement('span', {
              role: 'button',
              className: 'glyphicon glyphicon-remove closeBtn',
              onClick: function onClick(e) {
                _this4.onCloseModalClick(e);
              },
              tabIndex: -1
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'sumChartModalBody' },
            sumCharts
          )
        ) : '',
        doShowModal && sumCharts.length ? _react2.default.createElement('div', {
          className: 'sumChartsOverlay',
          role: 'button',
          onClick: function onClick(e) {
            _this4.onCloseModalClick(e);
          },
          tabIndex: -1
        }) : ''
      );
    }
  }]);

  return SummaryChart;
}(_react2.default.Component);

SummaryChart.propTypes = {
  layer: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  locations: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  layerId: _propTypes2.default.string.isRequired,
  mapId: _propTypes2.default.string.isRequired,
  saveChartState: _propTypes2.default.func.isRequired,
  isChartMin: _propTypes2.default.bool.isRequired,
  legendBottom: _propTypes2.default.number.isRequired
};

exports.default = SummaryChart;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/SummaryChart.jsx