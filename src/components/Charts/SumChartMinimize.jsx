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

var SumChartMinimize = function (_React$Component) {
  _inherits(SumChartMinimize, _React$Component);

  function SumChartMinimize(props) {
    _classCallCheck(this, SumChartMinimize);

    var _this = _possibleConstructorReturn(this, (SumChartMinimize.__proto__ || Object.getPrototypeOf(SumChartMinimize)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    _this.state = {
      isMin: false,
      bottom: _this.props.bottom,
      label: _this.props.label
    };
    return _this;
  }

  _createClass(SumChartMinimize, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ bottom: nextProps.bottom });
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      this.props.toggleChart();
      this.setState({ isMin: !this.state.isMin });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'a',
        {
          className: 'toggleChart',
          role: 'button',
          tabIndex: '-1',
          onClick: function onClick(e) {
            _this2.handleClick(e);
          },
          title: (this.state.isMin ? 'Show' : 'Hide') + ' Summary Charts',
          style: { bottom: this.state.bottom },
          'data-icon-credit': 'Created by Barracuda from the Noun Project',
          'data-icon-credit-url': 'https://thenounproject.com/barracuda/collection/chart/?i=1217547'
        },
        _react2.default.createElement('span', null)
      );
    }
  }]);

  return SumChartMinimize;
}(_react2.default.Component);

SumChartMinimize.propTypes = {
  toggleChart: _propTypes2.default.func.isRequired,
  label: _propTypes2.default.string.isRequired,
  bottom: _propTypes2.default.number.isRequired
};

exports.default = SumChartMinimize;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Charts/SumChartMinimize.jsx