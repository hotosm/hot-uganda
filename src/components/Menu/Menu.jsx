'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./Menu.scss');

var Menu = function (_React$Component) {
  _inherits(Menu, _React$Component);

  _createClass(Menu, null, [{
    key: 'logOut',
    value: function logOut(e) {
      e.preventDefault();
      _jsCookie2.default.set('dsauth', false);
      location.reload();
    }
  }]);

  function Menu(props) {
    _classCallCheck(this, Menu);

    var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Menu, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          toggleSingleScreen = _props.toggleSingleScreen,
          toggleSplitScreen = _props.toggleSplitScreen,
          appConfig = _props.appConfig,
          isSplitScreen = _props.isSplitScreen,
          hasSummary = _props.hasSummary,
          toggleSummary = _props.toggleSummary;

      return _react2.default.createElement(
        'div',
        { className: 'menu', id: 'menu', style: { background: appConfig.appColor } },
        _react2.default.createElement(
          'div',
          { className: 'brand' },
          _react2.default.createElement('img', { src: appConfig.appIcon, alt: 'UKAID', className: 'brand-icon' }),
          _react2.default.createElement(
            'div',
            { className: 'brand-title' },
            _react2.default.createElement(
              'span',
              { className: 'white' },
              appConfig.appName
            ),
            '\xA0\xA0 ',
            appConfig.appNameDesc
          )
        ),
        _react2.default.createElement(
          'ul',
          null,
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'a',
              { href: '#', onClick: toggleSingleScreen, alt: 'Home', title: 'Home' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-home' })
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'a',
              {
                href: '#',
                onClick: toggleSplitScreen,
                className: '' + (isSplitScreen ? 'active' : ''),
                alt: 'Split Screen',
                title: 'Split Screen'
              },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-th-large' })
            )
          ),
          hasSummary ? _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'a',
              { href: '#', onClick: toggleSummary, alt: 'Summary Page', title: 'Summary Page' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-stats' })
            )
          ) : ''
        ),
        _react2.default.createElement(
          'a',
          {
            className: 'sign-out',
            onClick: function onClick(e) {
              Menu.logOut(e);
            },
            role: 'button',
            tabIndex: 0,
            title: 'Sign Out',
            alt: 'Sign Out'
          },
          _react2.default.createElement('span', { className: 'glyphicon glyphicon-log-out' })
        ),
        _react2.default.createElement(
          'a',
          {
            className: 'ona-logo',
            href: 'http://www.ona.io/',
            alt: 'Powered by ONA',
            title: 'Powered by ONA',
            target: '_blank',
            rel: 'noopener noreferrer'
          },
          'Powered by'
        )
      );
    }
  }]);

  return Menu;
}(_react2.default.Component);

Menu.propTypes = {
  toggleSingleScreen: _propTypes2.default.func.isRequired,
  toggleSplitScreen: _propTypes2.default.func.isRequired,
  toggleSummary: _propTypes2.default.func.isRequired,
  appConfig: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  hasSummary: _propTypes2.default.bool.isRequired,
  isSplitScreen: _propTypes2.default.bool.isRequired
};

exports.default = Menu;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Menu/Menu.jsx