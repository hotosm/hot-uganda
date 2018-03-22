'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./ThemeSwitcher.scss');

var ThemeSwitcher = function (_React$Component) {
  _inherits(ThemeSwitcher, _React$Component);

  function ThemeSwitcher(props) {
    _classCallCheck(this, ThemeSwitcher);

    var _this = _possibleConstructorReturn(this, (ThemeSwitcher.__proto__ || Object.getPrototypeOf(ThemeSwitcher)).call(this, props));

    _this.state = {
      active: false
    };

    _this.toggleThemeSwitcher = _this.toggleThemeSwitcher.bind(_this);
    _this.store = typeof sessionStorage === 'undefined' ? null : sessionStorage;

    // todo - move this into stylesheet, have this component update a
    // className to cascade the theme styles
    _this.css = '\n    .filter-container {\n      background: #eae3bc !important;\n    }\n    .filter-section-options {\n      background: #f5f3e9 !important;\n    }\n    .filter-section-options .filter-item {\n      background-color: initial;\n    }\n    .filter-section-options .filter-item a.filter-option {\n      background: #f5f3e9;\n      color: #1d1c1c !important;\n    }\n    .filter-section-options .filterGroup {\n      background: #f5f3e9;\n      color: #000;\n    }\n    .filter-section-options .searchBtn,\n    .filter-section-options .clearSearch {\n      color: #000 !important;\n    }\n    .filter-container .filter-header-section {\n      background: rgba(255, 255, 255, 0.8) !important;\n      color: #000;\n    }\n    .filter-footer {\n      background: #f5f3e9 !important;\n      color: #000;\n    }\n    .filter-footer  button:hover {\n      box-shadow: 0 0 0 1px #4a4747 !important;\n    }\n    .filter-close,\n    .filter-container .filter-search {\n      color: #000 !important;\n    }\n    .filterSearch {\n      color: #000 !important;\n    }';
    return _this;
  }

  _createClass(ThemeSwitcher, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.store && this.store.ThemeSwitch) {
        var isTrue = this.store.getItem('ThemeSwitch') === 'true';
        this.setState({
          active: isTrue || false
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.store) {
        this.store.setItem('ThemeSwitch', this.state.active.toString());
      }
    }
  }, {
    key: 'toggleThemeSwitcher',
    value: function toggleThemeSwitcher() {
      this.setState({
        active: !this.state.active
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'wrap' },
          _react2.default.createElement(
            'div',
            {
              role: 'button',
              tabIndex: '0',
              className: 'btn-group btn-toggle',
              onClick: function onClick() {
                return _this2.toggleThemeSwitcher();
              }
            },
            _react2.default.createElement('button', {
              className: 'glyphicon glyphicon-list-alt theme-toggle-btn ' + (!this.state.active ? 'light' : 'dark'),
              alt: 'Theme: ' + (!this.state.active ? 'light' : 'dark')
            })
          )
        ),
        _react2.default.createElement(
          'style',
          { media: !this.state.active ? 'screen' : 'none' },
          this.state.active ? this.css.trim() : this.css
        )
      );
    }
  }]);

  return ThemeSwitcher;
}(_react2.default.Component);

exports.default = ThemeSwitcher;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/ThemeSwitcher/ThemeSwitcher.jsx