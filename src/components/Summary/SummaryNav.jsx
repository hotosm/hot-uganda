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

require('./SummaryNav.scss');

var SummaryNav = function (_React$Component) {
  _inherits(SummaryNav, _React$Component);

  function SummaryNav(props) {
    _classCallCheck(this, SummaryNav);

    var _this = _possibleConstructorReturn(this, (SummaryNav.__proto__ || Object.getPrototypeOf(SummaryNav)).call(this, props));

    var _this$props = _this.props,
        currentSector = _this$props.currentSector,
        navItems = _this$props.navItems;


    _this.state = {
      currentSector: currentSector,
      navItems: navItems.items
    };
    _this.handleChangeSector = _this.handleChangeSector.bind(_this);
    return _this;
  }

  _createClass(SummaryNav, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currentSector = nextProps.currentSector,
          navItems = nextProps.navItems;


      this.setState({
        currentSector: currentSector,
        navItems: navItems.items
      });
    }
  }, {
    key: 'handleChangeSector',
    value: function handleChangeSector(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.changeSector(e);
    }
  }, {
    key: 'render',
    value: function render() {
      var currentSector = this.state.currentSector;
      var handleChangeSector = this.handleChangeSector;


      var navItems = this.state.navItems.map(function (item) {
        return _react2.default.createElement(
          'li',
          { key: item, className: currentSector === item ? 'active' : '' },
          _react2.default.createElement(
            'a',
            { id: item.replace(/ /g, '-'), href: '#', onClick: handleChangeSector },
            item
          )
        );
      });

      return _react2.default.createElement(
        'div',
        { className: 'summary-nav' },
        _react2.default.createElement(
          'ul',
          null,
          navItems
        )
      );
    }
  }]);

  return SummaryNav;
}(_react2.default.Component);

SummaryNav.propTypes = {
  currentSector: _propTypes2.default.string.isRequired,
  navItems: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  changeSector: _propTypes2.default.func.isRequired
};

exports.default = SummaryNav;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Summary/SummaryNav.jsx