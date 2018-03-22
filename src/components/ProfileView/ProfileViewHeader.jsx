'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./ProfileView.scss');

var ProfileViewHeader = function (_React$Component) {
  _inherits(ProfileViewHeader, _React$Component);

  function ProfileViewHeader(props) {
    _classCallCheck(this, ProfileViewHeader);

    var _this = _possibleConstructorReturn(this, (ProfileViewHeader.__proto__ || Object.getPrototypeOf(ProfileViewHeader)).call(this, props));

    _this.state = Object.assign({}, _this.props);
    return _this;
  }

  _createClass(ProfileViewHeader, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps));
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          long = _state.long,
          lat = _state.lat,
          layer = _state.layer,
          layerObj = _state.layerObj,
          facility = _state.facility;


      if (!layerObj) {
        return false;
      }

      var isDynamic = !!layerObj['feature-detail'] && layerObj['feature-detail']['basic-info'];
      var isNutrition = layerObj.id === 'nutrition-sites-fixed';
      var isEducation = layerObj.id === 'educational-facilities';
      var healthSites = ['health-sites', 'sara-sites', 'unicef-sites'];
      var isHealth = healthSites.indexOf(layerObj.id) !== -1;

      var separator = ',';
      var detailItems = [];
      var locationStr = void 0;
      var detail = void 0;
      var value = void 0;
      var icon = void 0;
      var iconColor = void 0;

      if (isDynamic) {
        for (var d = 0; d < layerObj['feature-detail']['basic-info'].length; d += 1) {
          detail = layerObj['feature-detail']['basic-info'][d];
          value = _mustache2.default.render(detail.value, facility.properties);
          if (value !== '' && value !== ', ' && value !== ', , ') {
            if (typeof detail.icon === 'string') {
              icon = detail.icon;
              iconColor = null;
            } else {
              icon = detail.icon[value] && detail.icon[value].glyph;
              iconColor = detail.icon[value] && detail.icon[value].color || null;
            }
            detailItems.push(_react2.default.createElement(
              'li',
              null,
              _react2.default.createElement(
                'i',
                { 'data-balloon': detail.alt, 'data-balloon-pos': 'up' },
                _react2.default.createElement('span', {
                  className: 'glyphicon glyphicon-' + icon,
                  style: iconColor ? { color: iconColor } : {}
                })
              ),
              _react2.default.createElement(
                'span',
                null,
                value
              )
            ));
          }
        }
      } else {
        locationStr = layerObj.id === 'nutrition-sites-fixed' || this.state.org === 'UNICEF' && this.state.district !== 'null' && this.state.region !== 'null' ? '' + (this.state.settlement ? this.state.settlement + separator : '') + this.state.district + ', ' + this.state.region : layerObj.id === 'educational-facilities' ? this.props.facility.village + ', ' + this.props.facility.district + ', ' + this.props.facility.region : isHealth ? this.props.facility.district + ', ' + this.props.facility.region : null;

        detailItems = [_react2.default.createElement(
          'li',
          null,
          _react2.default.createElement(
            'i',
            { 'data-balloon': 'GPS coordinates', 'data-balloon-pos': 'up' },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-map-marker' })
          ),
          _react2.default.createElement(
            'span',
            null,
            long,
            ', ',
            lat
          )
        )];

        if (locationStr) {
          detailItems.unshift(_react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Facility Location', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-home' })
            ),
            _react2.default.createElement(
              'span',
              null,
              locationStr
            )
          ));
        }

        if (isNutrition) {
          detailItems = detailItems.concat([_react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Partner', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-user' })
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.org
            )
          ), _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Nutrition Site Type', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-pushpin' })
            ),
            _react2.default.createElement(
              'span',
              null,
              layer.id === 'nutrition-sites-fixed' ? 'Fixed' : 'Mobile'
            )
          ), _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Services', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-briefcase' })
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.services
            )
          ), _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Status: ' + this.state.verificationStatus + ' (' + (this.state.verified ? '' : 'not ') + 'verified)', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', {
                className: 'glyphicon glyphicon-' + (this.state.verified ? 'ok-circle' : 'remove-circle not-verified')
              })
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.verificationStatus
            )
          )]);
        } else if (isEducation) {
          detailItems = detailItems.concat([_react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Funder', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-user' })
            ),
            _react2.default.createElement(
              'span',
              null,
              facility.funder === 'NGO' && !!facility.funderngo ? facility.funderngo : facility.funder === 'Other' && !!facility.funderprivate ? facility.funderprivate : facility.funder
            )
          ), _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Education Type', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-education' })
            ),
            _react2.default.createElement(
              'span',
              null,
              facility.educationtype === 'Other' && facility.educationtype_other !== '.' ? facility.educationtype_other : facility.educationtype
            )
          ), _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Curriculum', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-pencil' })
            ),
            _react2.default.createElement(
              'span',
              null,
              facility.curriculum === 'Other' && facility.curriculum_other ? facility.curriculum_other : facility.curriculum
            )
          ), _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Type of Structure', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-home' })
            ),
            _react2.default.createElement(
              'span',
              null,
              facility.facilitystructure
            )
          )]);
        } else if (isHealth) {
          detailItems = detailItems.concat([_react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Partner', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-user' })
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.facility.org
            )
          ), _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Health Site Type', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-pushpin' })
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.facility.typeOfSite
            )
          )]);
        } else {
          detailItems.push(_react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'i',
              { 'data-balloon': 'Partner', 'data-balloon-pos': 'up' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-user' })
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.org
            )
          ));
          if (this.state.org === 'UNICEF' && this.state.typeOfSite) {
            detailItems.push(_react2.default.createElement(
              'li',
              null,
              _react2.default.createElement(
                'i',
                { 'data-balloon': 'Type of Facility', 'data-balloon-pos': 'up' },
                _react2.default.createElement('span', { className: 'glyphicon glyphicon-home' })
              ),
              _react2.default.createElement(
                'span',
                null,
                this.state.typeOfSite
              )
            ));
          }
        }
      }

      var title = !isDynamic ? this.state.siteName : layerObj['feature-detail'].title ? _mustache2.default.render(layerObj['feature-detail'].title, facility.properties) : '';
      var subTitle = !isDynamic ? this.state.typeOfSite : layerObj['feature-detail']['sub-title'] ? _mustache2.default.render(layerObj['feature-detail']['sub-title'], facility.properties) : '';
      var imgSrc = layerObj['feature-detail'] && layerObj['feature-detail']['image-url'] && facility.properties[layerObj['feature-detail']['image-url']] || '/assets/img/no-facility-img.jpg';

      return _react2.default.createElement(
        'div',
        { className: 'profile-basic-details' },
        _react2.default.createElement(
          'div',
          { className: 'profile-header-section' },
          _react2.default.createElement(
            'div',
            { className: 'profile-header' },
            _react2.default.createElement(
              'h4',
              null,
              title
            ),
            !!subTitle ? _react2.default.createElement(
              'h6',
              null,
              subTitle
            ) : '',
            _react2.default.createElement('img', { id: 'facilityImg', alt: title, src: imgSrc })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'location-details' },
          _react2.default.createElement(
            'ul',
            null,
            detailItems
          )
        )
      );
    }
  }]);

  return ProfileViewHeader;
}(_react2.default.Component);

ProfileViewHeader.propTypes = {
  facility: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = ProfileViewHeader;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/ProfileView/ProfileViewHeader.jsx