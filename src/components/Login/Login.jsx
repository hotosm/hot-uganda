'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./Login.scss');

var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login(props) {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ') || ua.indexOf('Trident/');

    _this.state = {
      loginError: false,
      isIE: msie !== -1
    };
    return _this;
  }

  _createClass(Login, [{
    key: 'handleLogin',
    value: function handleLogin(password) {
      if (this.props.appConfig.password.includes(password)) {
        _jsCookie2.default.set('dsauth', true);
        location.reload();
      } else {
        this.setState({ loginError: true });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'login' },
        this.state.isIE ? _react2.default.createElement(
          'div',
          { className: 'alert alert-info fade in alert-dismissable ie-alert' },
          _react2.default.createElement(
            'a',
            { href: '#', className: 'close', 'data-dismiss': 'alert', 'aria-label': 'close', title: 'close' },
            '\xD7'
          ),
          'Your browser is not supported. Please open link in another browser e.g Chrome or Firefox'
        ) : '',
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'form',
            { className: 'login-form', onSubmit: function onSubmit(e) {
                e.preventDefault();_this2.handleLogin(_this2.password.value);
              } },
            _react2.default.createElement(
              'div',
              { className: 'form-group' },
              _react2.default.createElement('div', { className: 'brand-login' }),
              this.state.loginError === true ? _react2.default.createElement(
                'div',
                { className: 'alert alert-danger' },
                'Incorrect password.'
              ) : null,
              _react2.default.createElement(
                'label',
                { htmlFor: 'password' },
                'Enter your Password'
              ),
              _react2.default.createElement('input', { className: 'form-control', type: 'password', ref: function ref(input) {
                  _this2.password = input;
                }, autoFocus: true })
            ),
            _react2.default.createElement(
              'button',
              { className: 'btn btn-default center-block', type: 'submit' },
              'Log In'
            )
          )
        )
      );
    }
  }]);

  return Login;
}(_react2.default.Component);

exports.default = Login;


Login.propTypes = {
  appConfig: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Login/Login.jsx