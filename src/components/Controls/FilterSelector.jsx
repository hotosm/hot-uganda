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

var FilterSelector = function (_React$Component) {
  _inherits(FilterSelector, _React$Component);

  _createClass(FilterSelector, null, [{
    key: 'catchZeroCountClicks',
    value: function catchZeroCountClicks(e) {
      if (e.currentTarget && e.currentTarget.dataset && !Number(e.currentTarget.dataset.count)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }]);

  function FilterSelector(props) {
    _classCallCheck(this, FilterSelector);

    var _this = _possibleConstructorReturn(this, (FilterSelector.__proto__ || Object.getPrototypeOf(FilterSelector)).call(this, props));

    _this.state = Object.assign({}, _this.props.filter, {
      isLinux: window.navigator.platform.indexOf('Linux') !== -1
    });
    _this.onSearchClear = _this.onSearchClear.bind(_this);
    return _this;
  }

  _createClass(FilterSelector, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(nextProps.filter);
    }
  }, {
    key: 'onSearchClear',
    value: function onSearchClear(e, filterKey) {
      this.searchEl.value = '';
      this.props.searchFilterOptions(e, filterKey);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          options = _state.options,
          isLinux = _state.isLinux;
      var _props = this.props,
          filterKey = _props.filterKey,
          toggleAllOn = _props.toggleAllOn;

      if (!options || !Object.keys(options).length) {
        return null;
      }

      var selectedOptions = [];
      var filterOptions = [];
      var inactiveOptions = [];
      var optionKeys = Object.keys(options);
      var option = void 0;
      var optionEl = void 0;
      var totals = [];

      for (var i = 0; i < optionKeys.length; i += 1) {
        option = options[optionKeys[i]];
        optionEl = _react2.default.createElement(
          'li',
          { key: i, className: 'optionItem' + (option.count ? '' : ' inactive') },
          _react2.default.createElement('input', {
            type: 'checkbox',
            id: optionKeys[i],
            value: optionKeys[i],
            checked: option.enabled,
            onChange: function onChange(e) {
              _this2.props.onFilterOptionClick(e, filterKey);
            }
          }),
          _react2.default.createElement(
            'label',
            {
              htmlFor: optionKeys[i],
              key: optionKeys[i],
              'data-count': option.count,
              className: 'optionLabel' + (option.enabled ? ' enabled' : ''),
              onClick: function onClick(e) {
                FilterSelector.catchZeroCountClicks(e);
              },
              role: 'presentation',
              tabIndex: '-1'
            },
            _react2.default.createElement(
              'span',
              {
                className: 'filter-option-label' + (isLinux ? ' linux' : ''),
                title: optionKeys[i]
              },
              optionKeys[i]
            ),
            _react2.default.createElement(
              'span',
              null,
              option.count
            )
          )
        );
        if (option.count && !option.hidden) {
          totals.push(option.count);
          filterOptions.push(optionEl);
        }
      }

      var totalOptions = totals.reduce(function (a, b) {
        return a + b;
      }, 0);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'search-column' },
          _react2.default.createElement(
            'span',
            { className: 'searchBtn', role: 'button' },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-search' })
          ),
          _react2.default.createElement('input', {
            ref: function ref(el) {
              _this2.searchEl = el;
            },
            type: 'text',
            className: 'filterSearch',
            placeholder: 'Search Options',
            onChange: function onChange(e) {
              _this2.props.searchFilterOptions(e, filterKey);
            }
          }),
          this.searchEl && this.searchEl.value !== '' ? _react2.default.createElement(
            'span',
            {
              className: 'clearSearch',
              role: 'button',
              onClick: function onClick(e) {
                _this2.onSearchClear(e, filterKey);
              },
              tabIndex: '0'
            },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
          ) : ''
        ),
        _react2.default.createElement(
          'ul',
          { id: 'filter-group', className: 'filterGroup', key: filterKey },
          _react2.default.createElement(
            'li',
            null,
            totalOptions ? _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('input', {
                type: 'checkbox',
                id: 'all-' + filterKey,
                checked: !toggleAllOn,
                onChange: function onChange(e) {
                  _this2.props.onToggleAllOptions(e, toggleAllOn, filterKey);
                }
              }),
              _react2.default.createElement(
                'label',
                {
                  className: 'optionLabel',
                  htmlFor: 'all-' + filterKey
                },
                _react2.default.createElement(
                  'span',
                  { className: 'filter-option-label' + (isLinux ? ' linux' : '') },
                  '(All)'
                ),
                _react2.default.createElement(
                  'span',
                  null,
                  '(',
                  totalOptions,
                  ')'
                )
              )
            ) : _react2.default.createElement(
              'span',
              { className: 'noOptions' },
              '(No options available)'
            )
          ),
          selectedOptions.concat(filterOptions, inactiveOptions)
        )
      );
    }
  }]);

  return FilterSelector;
}(_react2.default.Component);

FilterSelector.propTypes = {
  filter: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  onFilterOptionClick: _propTypes2.default.func.isRequired,
  searchFilterOptions: _propTypes2.default.func.isRequired,
  onToggleAllOptions: _propTypes2.default.func.isRequired,
  toggleAllOn: _propTypes2.default.bool.isRequired,
  filterKey: _propTypes2.default.string.isRequired
};

exports.default = FilterSelector;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Controls/FilterSelector/FilterSelector.jsx