'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./TimeSeriesSlider.scss');

var TimeSeriesSlider = function (_React$Component) {
  _inherits(TimeSeriesSlider, _React$Component);

  function TimeSeriesSlider(props) {
    _classCallCheck(this, TimeSeriesSlider);

    var _this = _possibleConstructorReturn(this, (TimeSeriesSlider.__proto__ || Object.getPrototypeOf(TimeSeriesSlider)).call(this, props));

    _this.handleMouseUp = _this.handleMouseUp.bind(_this);

    var _this$props$timeSerie = _this.props.timeSeriesObj,
        period = _this$props$timeSerie.period,
        temporalIndex = _this$props$timeSerie.temporalIndex;

    _this.state = {
      periods: period,
      index: temporalIndex,
      period: period[temporalIndex]
    };
    return _this;
  }

  _createClass(TimeSeriesSlider, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _nextProps$timeSeries = nextProps.timeSeriesObj,
          period = _nextProps$timeSeries.period,
          temporalIndex = _nextProps$timeSeries.temporalIndex;

      this.setState({
        periods: period,
        index: temporalIndex,
        period: period[temporalIndex]
      });
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp(e) {
      var nextIndex = parseInt(e.target.value, 10);
      var index = this.state.index;


      if (nextIndex !== index) {
        this.props.updateTimeseriesState(e.target.value, this.props.timeSeriesObj);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'series' },
        _react2.default.createElement(
          'label',
          {
            id: this.props.mapId + '-label',
            className: 'label',
            htmlFor: 'slider'
          },
          this.state.period
        ),
        _react2.default.createElement('input', {
          id: this.props.mapId + '-slider',
          className: 'slider',
          type: 'range',
          list: this.props.mapId + '-datalist',
          max: this.state.periods.length - 1,
          value: this.state.index,
          onInput: function onInput(e) {
            _this2.handleMouseUp(e);
          },
          'data-html2canvas-ignore': true
        }),
        _react2.default.createElement(
          'datalist',
          { id: this.props.mapId + '-datalist' },
          this.state.periods.map(function (p, i) {
            return _react2.default.createElement(
              'option',
              { key: i },
              i
            );
          })
        )
      );
    }
  }]);

  return TimeSeriesSlider;
}(_react2.default.Component);

TimeSeriesSlider.propTypes = {
  mapId: _propTypes2.default.string.isRequired,
  timeSeriesObj: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  updateTimeseriesState: _propTypes2.default.func.isRequired
};

exports.default = TimeSeriesSlider;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Controls/TimeSeriesSlider/TimeSeriesSlider.jsx