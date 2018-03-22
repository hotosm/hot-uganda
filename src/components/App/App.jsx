'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Menu = require('../Menu/Menu');

var _Menu2 = _interopRequireDefault(_Menu);

var _Map = require('../Map/Map');

var _Map2 = _interopRequireDefault(_Map);

var _Sectors = require('../Sectors/Sectors');

var _Sectors2 = _interopRequireDefault(_Sectors);

var _Summary = require('../Summary/Summary');

var _Summary2 = _interopRequireDefault(_Summary);

var _ProfileView = require('../ProfileView/ProfileView');

var _ProfileView2 = _interopRequireDefault(_ProfileView);

var _ThemeSwitcher = require('../ThemeSwitcher/ThemeSwitcher');

var _ThemeSwitcher2 = _interopRequireDefault(_ThemeSwitcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./App.scss');

window.maps = [];

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  _createClass(App, null, [{
    key: 'showSector',
    value: function showSector(e) {
      e.preventDefault();
      $(e.target).parent('li').find('.layers').toggle();
    }
  }, {
    key: 'toggleSectors',
    value: function toggleSectors(e, mapId) {
      e.preventDefault();
      var $wrapper = $(e.target).parents('.sectors-menu-wrapper');
      $wrapper.find('.sectors-menu').toggle();
      // todo - move this into the state....
      $(window).trigger('toggleSector', { mapId: mapId, sectorsId: $wrapper.attr('id') });
    }
  }, {
    key: 'toggleSummary',
    value: function toggleSummary(e) {
      e.preventDefault();
      var _state = this.state,
          viewSummary = _state.viewSummary,
          summaryIsSplash = _state.summaryIsSplash;

      this.setState({
        summaryIsSplash: true,
        viewSummary: summaryIsSplash ? !viewSummary : true,
        showSpinner: true
      });
    }
  }]);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      viewSummary: false,
      summaryIsSplash: true,
      'map-1': {
        enabled: true,
        layers: [],
        sectors: []
      },
      'map-2': {
        enabled: false,
        layers: [],
        sectors: []
      },
      facility: null,
      educationFacility: null,
      doShowProfile: true,
      showProfileComponent: false,
      showFilterModal: false,
      isOpen: false,
      showSectorMenu2: false,
      showSpinner: true
    };
    _this.changeLayer = _this.changeLayer.bind(_this);
    _this.sectorClick = App.showSector.bind(_this);
    _this.splitScreen = _this.splitScreen.bind(_this);
    _this.singleScreen = _this.singleScreen.bind(_this);
    _this.toggleSectors = App.toggleSectors.bind(_this);
    _this.toggleSummary = App.toggleSummary.bind(_this);
    _this.toggleSummaryIsSplash = _this.toggleSummaryIsSplash.bind(_this);
    _this.centerMap = _this.centerMap.bind(_this);
    _this.handleFacilityClick = _this.handleFacilityClick.bind(_this);
    _this.handleCloseClick = _this.handleCloseClick.bind(_this);
    _this.handleFilterClick = _this.handleFilterClick.bind(_this);
    _this.showProfileComponent = _this.showProfileComponent.bind(_this);
    _this.toggleProfileAndFilter = _this.toggleProfileAndFilter.bind(_this);
    _this.toggleFilterItems = _this.toggleFilterItems.bind(_this);
    _this.disableSpinner = _this.disableSpinner.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'toggleSummaryIsSplash',
    value: function toggleSummaryIsSplash() {
      this.setState({ summaryIsSplash: !this.state.summaryIsSplash });
    }
  }, {
    key: 'handleFacilityClick',
    value: function handleFacilityClick(e, feature, layerObj, data) {
      this.setState({
        facility: {
          UID: layerObj['feature-detail'] && layerObj['feature-detail'].UID && feature.properties[layerObj['feature-detail'].UID] || feature.properties[layerObj['highlight-filter-property']] || feature.properties.facility_id,
          siteName: layerObj['feature-detail'] && layerObj['feature-detail'].title || feature.properties['Site name'], // set in mapspec
          lat: e.lngLat.lat,
          long: e.lngLat.lng,
          layer: feature.layer,
          properties: data ? Object.assign({}, feature.properties, data) : feature.properties,
          data: data,
          layerObj: layerObj
          // feature,
        },
        showProfileComponent: true,
        showFilterModal: false,
        showThemeToggle: false
      });
    }
  }, {
    key: 'handleCloseClick',
    value: function handleCloseClick() {
      this.setState({
        showFilterModal: false
      });
    }
  }, {
    key: 'handleFilterClick',
    value: function handleFilterClick(showPrevFilter) {
      window.maps[0].easeTo({
        center: {
          lng: this.props.appConfig.mapCenter[0],
          lat: this.props.appConfig.mapCenter[1]
        },
        zoom: this.props.appConfig.mapZoom
      });

      this.setState({
        showProfileComponent: false,
        showFilterModal: !this.state.showFilterModal,
        showThemeToggle: showPrevFilter ? false : !this.state.showFilterModal
      });
    }
  }, {
    key: 'splitScreen',
    value: function splitScreen(e) {
      e.preventDefault();
      this.setState({
        showSectorMenu2: !this.state.showSectorMenu2,
        'map-2': Object.assign({}, this.state['map-2'], {
          enabled: !this.state.showSectorMenu2
        }),
        viewSummary: false,
        summaryIsSplash: false
      });
    }
  }, {
    key: 'singleScreen',
    value: function singleScreen(e) {
      e.preventDefault();
      this.setState({
        showSectorMenu2: false,
        'map-2': Object.assign({}, this.state['map-2'], {
          enabled: false
        }),
        viewSummary: false,
        summaryIsSplash: false
      });
    }
  }, {
    key: 'changeLayer',
    value: function changeLayer(layer, status, map) {
      var _this2 = this,
          _setState;

      var layers = this.state[map].layers.filter(function (l) {
        return l.title !== layer;
      });

      if (this.props.layerData[layer].layers) {
        (function () {
          var groupedLayer = _this2.props.layerData[layer].layers;

          var _loop = function _loop(i) {
            layers = layers.filter(function (l) {
              return l.title !== groupedLayer[i];
            });
            layers.push({
              title: groupedLayer[i],
              visible: status,
              map: map
            });
          };

          for (var i = 0; i < groupedLayer.length; i += 1) {
            _loop(i);
          }
        })();
      }
      layers.push({
        title: layer,
        visible: status,
        map: map
      });

      this.setState((_setState = {}, _defineProperty(_setState, map, {
        enabled: this.state[map].enabled,
        layers: layers,
        sectors: [].concat(_toConsumableArray(this.state[map].sectors))
      }), _defineProperty(_setState, 'showFilterModal', false), _defineProperty(_setState, 'showProfileComponent', false), _defineProperty(_setState, 'showThemeToggle', false), _defineProperty(_setState, 'showSpinner', status), _setState));
    }
  }, {
    key: 'disableSpinner',
    value: function disableSpinner(map) {
      this.setState({ showSpinner: false });
    }
  }, {
    key: 'toggleFilterItems',
    value: function toggleFilterItems(e) {
      e.preventDefault();
      $(e.target).parent('li').find('.filterGroup').toggle();

      if (e.target) {
        this.setState({
          isOpen: true
        });
      }
    }
  }, {
    key: 'toggleProfileAndFilter',
    value: function toggleProfileAndFilter() {
      this.setState({
        showProfileComponent: !this.state.showProfileComponent,
        showFilterModal: !this.state.showFilterModal,
        facility: null
      });
    }
  }, {
    key: 'centerMap',
    value: function centerMap() {
      this.setState({
        showProfileComponent: !this.state.showProfileComponent
      });
    }
  }, {
    key: 'showProfileComponent',
    value: function showProfileComponent(e) {
      if (e.target.id === 'nutrition-sites-fixed') {
        this.setState({
          showProfileComponent: !this.state.showProfileComponent,
          facility: null,
          educationFacility: null
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var toggleSummary = this.toggleSummary;
      var changeLayer = this.changeLayer,
          sectorClick = this.sectorClick,
          toggleSectors = this.toggleSectors,
          splitScreen = this.splitScreen,
          singleScreen = this.singleScreen;

      var map1 = this.state['map-1'];
      var map2 = this.state['map-2'];
      var isSplitScreen = map1.enabled && map2.enabled;
      var sectorData = this.props.sectorData;
      var layerData = this.props.layerData;
      var styles = this.props.styles;

      var menuEl = _react2.default.createElement(_Menu2.default, {
        toggleSingleScreen: singleScreen,
        toggleSplitScreen: splitScreen,
        toggleSummary: toggleSummary,
        appConfig: this.props.appConfig,
        hasSummary: Object.keys(this.props.summary).length > 0,
        isSplitScreen: isSplitScreen
      });

      return this.state.viewSummary && this.props.summary ? _react2.default.createElement(
        'div',
        null,
        menuEl,
        _react2.default.createElement(_Summary2.default, {
          config: this.props.summary,
          isSplash: this.state.summaryIsSplash,
          toggleSummaryIsSplash: this.toggleSummaryIsSplash
        })
      ) : _react2.default.createElement(
        'div',
        null,
        menuEl,
        _react2.default.createElement(_Map2.default, {
          mapId: 'map-1',
          layers: map1,
          layerData: layerData,
          styles: styles,
          locations: this.props.locations,
          mapConfig: this.props.appConfig,
          isSplitScreen: isSplitScreen,
          isEnabled: map1.enabled,
          doShowProfile: this.state.showProfileComponent,
          facility: this.state.facility,
          handleFacilityClick: this.handleFacilityClick,
          showFilterModal: this.state.showFilterModal,
          handleFilterClick: this.handleFilterClick,
          handleCloseClick: this.handleCloseClick,
          handleEducationFacilityClick: this.handleEducationFacilityClick,
          disableSpinner: this.disableSpinner,
          showSpinner: this.state.showSpinner
        }),
        this.state.showThemeToggle ? _react2.default.createElement(_ThemeSwitcher2.default, null) : '',
        map2.enabled ? _react2.default.createElement(_Map2.default, {
          mapId: 'map-2',
          layers: map2,
          layerData: layerData,
          styles: styles,
          locations: this.props.locations,
          mapConfig: this.props.appConfig,
          isSplitScreen: isSplitScreen,
          isEnabled: map2.enabled,
          doShowProfile: this.state.showProfileComponent,
          facility: this.state.facility,
          handleFacilityClick: this.handleFacilityClick,
          showFilterModal: this.state.showFilterModal,
          handleFilterClick: this.handleFilterClick,
          handleCloseClick: this.handleCloseClick,
          disableSpinner: this.disableSpinner,
          showSpinner: this.state.showSpinner
        }) : '',
        _react2.default.createElement(_Sectors2.default, {
          sectorMenuId: 'sector-menu-1',
          mapTargetId: 'map-1',
          onToggleSectors: toggleSectors,
          onSectorClick: sectorClick,
          onLayerChange: changeLayer,
          sectorData: sectorData,
          layerData: layerData,
          showProfileComponent: this.showProfileComponent
        }),
        this.state.showSectorMenu2 ? _react2.default.createElement(_Sectors2.default, {
          sectorMenuId: 'sector-menu-2',
          mapTargetId: 'map-2',
          onToggleSectors: toggleSectors,
          onSectorClick: sectorClick,
          onLayerChange: changeLayer,
          sectorData: sectorData,
          layerData: layerData
        }) : '',
        this.state.showProfileComponent && !this.state.showFilterModal ? _react2.default.createElement(_ProfileView2.default, {
          centerMap: this.centerMap,
          doShowProfile: this.state.doShowProfile,
          facility: this.state.facility,
          showProfileComponent: this.showProfileComponent
        }) : ''
      );
    }
  }]);

  return App;
}(_react2.default.Component);

App.propTypes = {
  appConfig: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  layerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  locations: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  sectorData: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
  styles: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
  summary: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = App;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/App/App.jsx