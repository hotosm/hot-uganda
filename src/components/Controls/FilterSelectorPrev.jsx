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

require('./FilterSelectorPrev.scss');

var FilterSelectorPrev = function (_React$Component) {
  _inherits(FilterSelectorPrev, _React$Component);

  function FilterSelectorPrev(props) {
    _classCallCheck(this, FilterSelectorPrev);

    var _this = _possibleConstructorReturn(this, (FilterSelectorPrev.__proto__ || Object.getPrototypeOf(FilterSelectorPrev)).call(this, props));

    var layerObj = _this.props.layerObj;

    var filterOptionMapper = function filterOptionMapper(opt, i) {
      var optVal = {};
      optVal[opt] = true;
      return optVal;
    };
    var filterOptions = {};

    if (layerObj && layerObj.filterOptions) {
      filterOptions = Array.isArray(layerObj.filterOptions) ? layerObj.filterOptions.map(function (opt) {
        var optVal = {};
        optVal[opt] = true;
        return optVal;
      }) : Object.assign({}, layerObj.filterOptions);

      if (Array.isArray(layerObj.filterOptions)) {
        filterOptions = Object.assign.apply(_this, filterOptions);
      }
    } else {
      filterOptions = {};
    }

    _this.state = {
      options: filterOptions
    };

    _this.updateOptions = _this.updateOptions.bind(_this);
    return _this;
  }

  _createClass(FilterSelectorPrev, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var layerObj = nextProps.layerObj;

      var filterOptions = void 0;

      if (layerObj && layerObj.filterOptions) {
        filterOptions = Array.isArray(layerObj.filterOptions) ? layerObj.filterOptions.map(function (opt) {
          var optVal = {};
          optVal[opt] = true;
          return optVal;
        }) : Object.assign({}, layerObj.filterOptions);

        if (Array.isArray(layerObj.filterOptions)) {
          if (this.state && this.state.options) {
            filterOptions = filterOptions.concat([this.state.options]);
          }
          filterOptions = Object.assign.apply(this, filterOptions);
        }
      } else {
        filterOptions = {};
      }

      this.setState({ options: filterOptions });
    }
  }, {
    key: 'updateOptions',
    value: function updateOptions(val) {
      var options = this.state.options;
      options[val] = !options[val];
      this.setState({ options: options });
      this.props.filterData(options);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.state && this.state.options) {
        return _react2.default.createElement(
          'nav',
          { id: 'filter-group', className: 'filter-group' },
          Object.keys(this.state.options).map(function (val, i) {
            // val = (Object.keys(f))[0];
            return _react2.default.createElement(
              'span',
              { key: 'label_' + val },
              _react2.default.createElement('input', {
                type: 'checkbox',
                id: val,
                key: 'input_' + val,
                value: val,
                onChange: function onChange(e) {
                  _this2.updateOptions(e.target.value);
                },
                checked: _this2.state.options[val]
              }),
              _react2.default.createElement(
                'label',
                { htmlFor: val, key: 'label_' + val },
                val
              )
            );
          })
        );
      }
      return _react2.default.createElement('nav', null);
    }
  }]);

  return FilterSelectorPrev;
}(_react2.default.Component);

FilterSelectorPrev.propTypes = {
  filterData: _propTypes2.default.func.isRequired,
  layerObj: _propTypes2.default.objectOf(_propTypes2.default.any)
};

FilterSelectorPrev.defaultProps = {
  layerObj: {}
};

exports.default = FilterSelectorPrev;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Controls/FilterSelectorPrev/FilterSelectorPrev.jsx