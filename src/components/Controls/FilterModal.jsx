'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _filterUtils = require('../../../includes/filterUtils');

var _FilterSelector = require('./FilterSelector');

var _FilterSelector2 = _interopRequireDefault(_FilterSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./FilterModal.scss');
require('../../ProfileView/ProfileView.scss');

var FilterModal = function (_React$Component) {
  _inherits(FilterModal, _React$Component);

  _createClass(FilterModal, null, [{
    key: 'buildFilters',
    value: function buildFilters(filters, layerFilters, prevFilters) {
      var filterMap = {};
      var filterKeys = Object.keys(filters);
      var filterKey = void 0;
      var options = void 0;
      var optionKeys = void 0;
      var optionKey = void 0;
      var filter = void 0;
      var f = void 0;
      var o = void 0;

      // todo - use this again to sort options
      // const optionSort = (a, b) => {
      //   if (typeof a === 'string' && typeof b === 'string') {
      //     if (a.toUpperCase() < b.toUpperCase()) {
      //       return -1;
      //     }
      //     if (a.toUpperCase() > b.toUpperCase()) {
      //       return 1;
      //     }
      //   } else {
      //     if (a < b) {
      //       return -1;
      //     }
      //     if (a > b) {
      //       return -1;
      //     }
      //   }
      //   return 0;
      // };

      // loop over all filters
      for (f = 0; f < filterKeys.length; f += 1) {
        filterKey = filterKeys[f];
        filter = {
          label: filters[filterKey].label,
          toggleAllOn: prevFilters ? prevFilters[filterKey].toggleAllOn : true, // controls toggle all functionality and text
          isFiltered: prevFilters ? prevFilters[filterKey].isFiltered : false, // whether any options have been modified
          isOriginal: true, // whether the filter has been filtered
          options: {}, // actual filter options map
          isOpen: prevFilters ? prevFilters[filterKey].isOpen : false
        };

        options = filters[filterKey].filterValues;
        optionKeys = Object.keys(options);
        // loop over all options
        for (o = 0; o < optionKeys.length; o += 1) {
          optionKey = optionKeys[o];
          // set filter option to true
          filter.options[optionKey] = {
            enabled: false,
            count: options[optionKey]
          };
        }

        // add filter to the filterMap
        filterMap[filterKey] = filter;
      }

      if (layerFilters) {
        for (f = 0; f < layerFilters.length; f += 1) {
          if (layerFilters[f] instanceof Array) {
            for (o = 0; o < layerFilters[f].length; o += 1) {
              if (layerFilters[f][o] instanceof Array) {
                filterKey = layerFilters[f][o][1];
                optionKey = layerFilters[f][o][2];
                filterMap[filterKey].options[optionKey].enabled = true;
                filterMap[filterKey].options[optionKey].hidden = false;
                if (!filterMap[filterKey]) filterMap[filterKey].isFiltered = true;
              }
            }
          }
        }
      }

      return filterMap;
    }
  }, {
    key: 'isFiltered',
    value: function isFiltered(options, isOriginal) {
      var optionKeys = Object.keys(options);
      var hasEnabled = false;
      var hasDisabled = false;
      var i = void 0;

      // if original check for BOTH enabled and disabled options
      if (isOriginal || typeof isOriginal === 'undefined') {
        for (i = 0; i < optionKeys.length; i += 1) {
          if (options[optionKeys[i]].count && options[optionKeys[i]].enabled) {
            hasEnabled = true;
          } else if (options[optionKeys[i]].count) {
            hasDisabled = true;
          }
        }
        return hasEnabled && hasDisabled;
      }

      // if filtered check for a single enabled option
      for (i = 0; i < optionKeys.length; i += 1) {
        if (options[optionKeys[i]].enabled) return true;
      }
      return false;
    }
  }, {
    key: 'mergeFilters',
    value: function mergeFilters(originalFilters, filteredFilters, clickedFilterKey) {
      if (!filteredFilters || !Object.keys(filteredFilters).length) {
        return originalFilters;
      }
      // Define keys of all the filters and an obj to map merged filters into
      var filterKeys = Object.keys(originalFilters);
      var nextFilters = {};

      var filterIsOpen = void 0;
      var nextFilter = void 0;
      var filterKey = void 0;
      var oOptions = void 0;
      var fOptions = void 0;
      var ooKeys = void 0;
      var ooKey = void 0;

      // Loop through all the filters
      for (var f = 0; f < filterKeys.length; f += 1) {
        filterKey = filterKeys[f];
        filterIsOpen = originalFilters[filterKey].isOpen;

        if (filterKey === clickedFilterKey && originalFilters[filterKey].isFiltered) {
          nextFilters[filterKey] = originalFilters[filterKey];
        } else {
          nextFilter = Object.assign({}, filteredFilters[filterKey], {
            isOriginal: false,
            isFiltered: originalFilters[filterKey].isFiltered,
            toggleAllOn: originalFilters[filterKey].toggleAllOn,
            isOpen: filterIsOpen
          });
          fOptions = filteredFilters[filterKey].options;
          oOptions = originalFilters[filterKey].options;
          ooKeys = Object.keys(oOptions);

          // Loop through all of the original filter options
          for (var o = 0; o < ooKeys.length; o += 1) {
            ooKey = ooKeys[o];
            // If the filtered filter doesn't have the option, add it
            if (!fOptions[ooKey]) {
              nextFilter.options[ooKey] = {
                count: 0,
                enabled: false,
                hidden: false
              };
            } else {
              nextFilter.options[ooKey].enabled = oOptions[ooKey].enabled;
            }
          }
          nextFilters[filterKey] = nextFilter;
        }
      }

      return nextFilters;
    }
  }]);

  function FilterModal(props) {
    _classCallCheck(this, FilterModal);

    var _this = _possibleConstructorReturn(this, (FilterModal.__proto__ || Object.getPrototypeOf(FilterModal)).call(this, props));

    var layerObj = _this.props.layerObj;
    var filterOptions = layerObj.filterOptions,
        id = layerObj.id;

    var layerFilters = _this.props.getLayerFilter(id);
    var filters = FilterModal.buildFilters(filterOptions, layerFilters);

    _this.onFilterItemClick = _this.onFilterItemClick.bind(_this);
    _this.onFilterOptionClick = _this.onFilterOptionClick.bind(_this);
    _this.onToggleAllOptions = _this.onToggleAllOptions.bind(_this);
    _this.buildFilteredFilters = _this.buildFilteredFilters.bind(_this);
    _this.buildNextFilters = _this.buildNextFilters.bind(_this);
    _this.isMapFiltered = _this.isMapFiltered.bind(_this);
    _this.searchFilterOptions = _this.searchFilterOptions.bind(_this);
    _this.onApplyClick = _this.onApplyClick.bind(_this);
    _this.onClearClick = _this.onClearClick.bind(_this);

    _this.state = {
      isFiltered: false,
      prevFilters: null,
      layerId: id,
      filters: filters,
      filterOptions: filterOptions,
      doShowProfile: _this.props.doShowProfile,
      isOpen: false,
      isMac: window.navigator.platform.indexOf('Mac') !== -1,
      isLinux: window.navigator.platform.indexOf('Linux') !== -1
    };
    return _this;
  }

  _createClass(FilterModal, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var layerObj = nextProps.layerObj;
      var filterOptions = layerObj.filterOptions,
          id = layerObj.id;

      var layerFilters = this.props.getLayerFilter(id);
      var filters = this.state.isFiltered && this.state.prevFilters ? this.state.prevFilters : FilterModal.buildFilters(filterOptions, layerFilters, this.state.filters);

      this.setState({
        filters: filters,
        filterOptions: filterOptions,
        layerId: id,
        doShowProfile: false
      });
    }
  }, {
    key: 'onCloseClick',
    value: function onCloseClick(e) {
      e.preventDefault();
      this.props.handleCloseClick();
    }
  }, {
    key: 'onFilterItemClick',
    value: function onFilterItemClick(e, filterKey) {
      e.preventDefault();
      var filters = this.state.filters;

      var nextFilters = filters;
      nextFilters[filterKey].isOpen = !filters[filterKey].isOpen;
      this.setState({ filters: nextFilters });
    }
  }, {
    key: 'onFilterOptionClick',
    value: function onFilterOptionClick(e, filterKey) {
      e.stopPropagation();
      var filters = this.state.filters;

      var option = filters[filterKey].options[e.target.value];
      var nextOptions = Object.assign({}, filters[filterKey].options, _defineProperty({}, e.target.value, {
        enabled: !option.enabled,
        count: option.count
      }));

      var _buildNextFilters = this.buildNextFilters(nextOptions, filters, filterKey, true),
          isFiltered = _buildNextFilters.isFiltered,
          nextFilters = _buildNextFilters.nextFilters;

      this.setState({
        isFiltered: isFiltered,
        filters: nextFilters
      });
    }
  }, {
    key: 'onToggleAllOptions',
    value: function onToggleAllOptions(e, toggleAllOn, filterKey) {
      e.stopPropagation();
      var filters = this.state.filters;

      var options = filters[filterKey].options;
      var option = void 0;
      var optionKeys = Object.keys(options);
      var nextOptions = Object.assign({}, options);
      for (var o = 0; o < optionKeys.length; o += 1) {
        option = options[optionKeys[o]];
        nextOptions[optionKeys[o]].enabled = option.count && !option.hidden ? toggleAllOn : false;
      }

      var _buildNextFilters2 = this.buildNextFilters(nextOptions, filters, filterKey),
          isFiltered = _buildNextFilters2.isFiltered,
          nextFilters = _buildNextFilters2.nextFilters;

      this.setState({
        filters: nextFilters,
        isFiltered: isFiltered
      });
    }
  }, {
    key: 'onClearClick',
    value: function onClearClick(e, isFilterable) {
      var _this2 = this;

      e.preventDefault();
      if (!isFilterable) {
        return false;
      }
      var _state = this.state,
          layerId = _state.layerId,
          filterOptions = _state.filterOptions;

      this.setState({
        isFiltered: false,
        filters: FilterModal.buildFilters(filterOptions),
        prevFilters: null
      }, function () {
        _this2.props.setLayerFilter(layerId, null);
      });
      return true;
    }
  }, {
    key: 'onApplyClick',
    value: function onApplyClick(e, isFilterable) {
      var _this3 = this;

      e.preventDefault();
      if (!isFilterable) {
        return false;
      }
      var _state2 = this.state,
          filters = _state2.filters,
          layerId = _state2.layerId;

      var filterKeys = Object.keys(filters);
      var nextFilters = ['all'];

      var newFilters = void 0;
      var options = void 0;
      var optionKeys = void 0;
      // loop through all filters
      for (var f = 0; f < filterKeys.length; f += 1) {
        // chec if the filter is actually filtered
        if (filters[filterKeys[f]].isFiltered) {
          newFilters = ['any'];
          // define the options and option keys for this filter
          options = filters[filterKeys[f]].options;
          optionKeys = Object.keys(options);
          // loop through all options and add to this filter
          for (var o = 0; o < optionKeys.length; o += 1) {
            if (options[optionKeys[o]].enabled) {
              newFilters.push(['==', filterKeys[f], optionKeys[o]]);
            }
          }
          // push this filter to the combind filter
          if (newFilters.length > 1) {
            nextFilters.push(newFilters);
          }
        }
      }

      // if (outsideFilters) {
      //   nextFilters = [].concat(outsideFilters, [...nextFilters])
      // }

      this.setState({
        isFiltered: true,
        prevFilters: filters
      }, function () {
        _this3.props.setLayerFilter(layerId, nextFilters);
      });
      return true;
    }
  }, {
    key: 'isMapFiltered',
    value: function isMapFiltered() {
      var layerFilters = this.props.getLayerFilter(this.state.layerId);
      if (!layerFilters) {
        return false;
      }
      return true;

      // const { outsideFilters } = this.state;
      // // todo - move this to util function
      // function isArrayEqual(a, b) {
      //   if (a.length !== b.length) {
      //     return false;
      //   }
      //   for (let i = 0; i < a.length; i += 1) {
      //     if (typeof a !== typeof b) {
      //       return false;
      //     }
      //     if (a[i] instanceof Array && b[i] instanceof Array) {
      //       if (!isArrayEqual(a[i], b[i])) {
      //         return false;
      //       }
      //     } else if (a[i] !== b[i]) {
      //       return false;
      //     }
      //   }
      //   return true;
      // }

      // return !isArrayEqual(outsideFilters, layerFilters);
    }
  }, {
    key: 'searchFilterOptions',
    value: function searchFilterOptions(e, filterKey) {
      var val = (e.target.value || '').toLowerCase();
      var options = Object.assign({}, this.state.filters[filterKey].options);
      var optionKeys = Object.keys(options);
      var optionKey = void 0;
      var isClear = false;
      var toggleAllOn = false;
      var isMatched = void 0;
      if (val === '') isClear = true;

      for (var o = 0; o < optionKeys.length; o += 1) {
        optionKey = optionKeys[o];
        if (options[optionKey].count) {
          isMatched = isClear || optionKey.toLowerCase().indexOf(val) !== -1;
          options[optionKey].hidden = !isMatched;
          if (!options[optionKey].hidden && !options[optionKey].enabled) {
            toggleAllOn = true;
          }
        }
      }
      var nextFilters = Object.assign({}, this.state.filters, _defineProperty({}, filterKey, Object.assign({}, this.state.filters[filterKey], {
        isFiltered: FilterModal.isFiltered(options),
        toggleAllOn: toggleAllOn,
        options: options,
        isOpen: true
      })));
      this.setState({ filters: nextFilters });
    }
  }, {
    key: 'buildFilteredFilters',
    value: function buildFilteredFilters(clickedFilterKey, nextFilters) {
      var aggregate = {
        filter: [],
        'sub-filter': [],
        'accepted-filter-values': [],
        'accepted-sub-filter-values': [],
        'filter-label': []
      };

      var filters = nextFilters;
      // const { layerObj } = this.props;
      var filterKeys = Object.keys(filters);
      var filterKey = void 0;
      var filter = void 0;

      var options = void 0;
      var option = void 0;
      var optionKeys = void 0;

      for (var f = 0; f < filterKeys.length; f += 1) {
        filterKey = filterKeys[f];
        // if (filterKey === clickedFilterKey) continue;
        filter = filters[filterKey];
        aggregate.filter[f] = filterKey;
        aggregate['accepted-filter-values'][f] = [];
        // aggregate['sub-filter'][f] = '';
        // aggregate['accepted-sub-filter-values'][f] = '';
        aggregate['filter-label'][f] = filter.label || '';

        if (filter.isFiltered) {
          options = filter.options;
          optionKeys = Object.keys(options);
          for (var o = 0; o < optionKeys.length; o += 1) {
            option = options[optionKeys[o]];

            if ((filter.isOriginal || filter.isFiltered) && option.enabled || !filter.isOriginal && !filter.isFiltered && option.count) {
              aggregate['accepted-filter-values'][f].push(optionKeys[o]);
            }
          }
          if (optionKeys.length === aggregate['accepted-filter-values'][f].length) {
            aggregate['accepted-filter-values'][f] = 'all';
          }
        } else {
          aggregate['accepted-filter-values'][f] = 'all';
        }

        // todo - add sub-filter functionality
        // if (typeof aggregate['accepted-sub-filter-values'][f] === 'string') {
        //   continue;
        // }

        // options = filters[filterKey][aggregate['sub-filter'][f]];
        // optionKeys = Object.keys(options);
        // for (let o = 0; o < optionKeys.length; o += 1) {
        //   optionKey = optionKeys[o];
        //   if (options[optionKey].enabled) {
        //     aggregate['accepted-sub-filter-values'][f].push(optionKey);
        //   }
        // }
        // if (optionKeys.length === aggregate['accepted-sub-filter-values'][f].length) {
        //   aggregate['accepted-sub-filter-values'][f] = 'all';
        // } else if (!optionKeys.length) {
        //   aggregate['accepted-sub-filter-values'][f] = 'all';
        // }
      }

      var newLayerObj = {
        aggregate: aggregate,
        source: this.props.layerObj.source,
        type: 'filteredFilter'
      };
      var newLayerOptions = (0, _filterUtils.generateFilterOptions)(newLayerObj);
      var filteredFilters = FilterModal.buildFilters(newLayerOptions);
      return FilterModal.mergeFilters(filters, filteredFilters, clickedFilterKey);
    }
  }, {
    key: 'buildNextFilters',
    value: function buildNextFilters(nextOptions, filters, filterKey, isResetable) {
      var toggleAllOn = filters[filterKey].toggleAllOn;
      var filterOptions = this.state.filterOptions;

      var nextFilters = Object.assign({}, filters, _defineProperty({}, filterKey, Object.assign({}, filters[filterKey], {
        toggleAllOn: isResetable ? toggleAllOn : !toggleAllOn,
        options: nextOptions,
        isOpen: true
      })));

      var nextFilter = void 0;
      var isFiltered = false;
      var filterKeys = Object.keys(nextFilters);

      for (var i = 0; i < filterKeys.length; i += 1) {
        nextFilter = nextFilters[filterKeys[i]];
        nextFilter.isFiltered = FilterModal.isFiltered(nextFilter.options, nextFilter.isOriginal);

        if (nextFilter.isFiltered) {
          isFiltered = true;
        }
      }

      if (isFiltered) {
        nextFilters = this.buildFilteredFilters(filterKey, nextFilters);
      } else if (isResetable) {
        var layerFilters = this.props.getLayerFilter(this.props.layerObj.id);
        nextFilters = FilterModal.buildFilters(filterOptions, layerFilters, nextFilters);
      }

      return { isFiltered: isFiltered, nextFilters: nextFilters };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state3 = this.state,
          filters = _state3.filters,
          isMac = _state3.isMac;

      var filterKeys = Object.keys(filters);
      var filterItems = [];
      var filter = void 0;
      var isFilterable = false;

      var _loop = function _loop(f) {
        filter = filters[filterKeys[f]];
        var _filter = filter,
            isFiltered = _filter.isFiltered,
            toggleAllOn = _filter.toggleAllOn;

        if (isFiltered) {
          isFilterable = true;
        }
        filterItems.push(_react2.default.createElement(
          'li',
          { className: 'filter-item' },
          _react2.default.createElement(
            'a',
            {
              className: 'indicator-label indicator-item filter-option\n              ' + (filter.isOpen ? ' active' : '') + '\n              ' + (isFiltered ? ' filtered filterOptionSelected' : ''),
              onClick: function onClick(e) {
                _this4.onFilterItemClick(e, filterKeys[f]);
              },
              role: 'button',
              tabIndex: '-1'
            },
            filters[filterKeys[f]].label,
            _react2.default.createElement('span', { className: 'caret caret-' + (filter.isOpen ? 'down' : 'right') })
          ),
          filter.isOpen ? _react2.default.createElement(_FilterSelector2.default, {
            filter: filter,
            filterKey: filterKeys[f],
            onFilterOptionClick: _this4.onFilterOptionClick,
            onToggleAllOptions: _this4.onToggleAllOptions,
            searchFilterOptions: _this4.searchFilterOptions,
            toggleAllOn: toggleAllOn
          }) : ''
        ));
      };

      for (var f = 0; f < filterKeys.length; f += 1) {
        _loop(f);
      }

      var doClear = isFilterable || this.state.isFiltered || this.isMapFiltered();

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'profile-view-container filter-container' + (isMac ? ' mac' : '') },
          _react2.default.createElement(
            'a',
            {
              className: 'close-btn filter-close',
              title: 'Close profile view',
              onClick: function onClick(e) {
                _this4.onCloseClick(e);
              },
              href: '#',
              role: 'button'
            },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'profile-basic-details filter-header-section' },
            _react2.default.createElement(
              'div',
              { className: 'profile-header-section filter-header' },
              _react2.default.createElement(
                'h5',
                null,
                'LAYER FILTERS'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'profile-indicators filter-section-options' },
            _react2.default.createElement(
              'ul',
              null,
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'ul',
                  { className: 'indicators-list' },
                  filterItems
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'filter-footer' },
            _react2.default.createElement(
              'div',
              { className: 'filter-footer-section' },
              _react2.default.createElement(
                'div',
                { className: 'filter-footer-content' },
                _react2.default.createElement(
                  'table',
                  { className: 'filter-footer-controls' },
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      null,
                      _react2.default.createElement(
                        'button',
                        {
                          className: '' + (doClear ? '' : 'disabled'),
                          onClick: function onClick(e) {
                            _this4.onClearClick(e, doClear);
                          }
                        },
                        'Clear Filters'
                      )
                    ),
                    _react2.default.createElement(
                      'td',
                      null,
                      _react2.default.createElement(
                        'button',
                        {
                          className: '' + (isFilterable ? '' : 'disabled'),
                          onClick: function onClick(e) {
                            _this4.onApplyClick(e, isFilterable);
                          }
                        },
                        'Apply Filters'
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return FilterModal;
}(_react2.default.Component);

FilterModal.propTypes = {
  layerObj: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  getLayerFilter: _propTypes2.default.func.isRequired,
  setLayerFilter: _propTypes2.default.func.isRequired,
  handleCloseClick: _propTypes2.default.func.isRequired,
  doShowProfile: _propTypes2.default.bool.isRequired
};

exports.default = FilterModal;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Controls/FilterSelector/FilterModal.jsx