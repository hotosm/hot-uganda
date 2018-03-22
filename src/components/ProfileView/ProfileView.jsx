'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _ProfileViewHeader = require('./ProfileViewHeader');

var _ProfileViewHeader2 = _interopRequireDefault(_ProfileViewHeader);

var _IndicatorRow = require('./IndicatorRow');

var _IndicatorRow2 = _interopRequireDefault(_IndicatorRow);

var _ReportingPeriodNav = require('./ReportingPeriodNav');

var _ReportingPeriodNav2 = _interopRequireDefault(_ReportingPeriodNav);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import fetchData from '../../includes/fetchData';


require('./ProfileView.scss');

var stubFacilityData = {};
d3.csv('/data/stub_ona_data.csv', function (data) {
  if (!data) return false;
  var d = void 0;
  var id = void 0;

  for (var i = 0; i < data.length; i += 1) {
    d = data[i];
    id = d['Fixed Site Unique ID'];

    if (!stubFacilityData[id]) {
      stubFacilityData[id] = [];
    }
    stubFacilityData[id].push(d);
  }
  return true;
});

var ProfileView = function (_React$Component) {
  _inherits(ProfileView, _React$Component);

  _createClass(ProfileView, null, [{
    key: 'imageModal',
    value: function imageModal() {
      if ($('#facilityImg')) {
        $('#facilityImg').click(function () {
          var $imgSrc = $('#facilityImg').attr('src');
          var $imgAlt = $('#facilityImg').attr('alt');
          $('#image-modal').css('display', 'block');
          $('#facility-image').attr('src', $imgSrc);
          $('#caption').text($imgAlt);
          return true;
        });
      }

      $('.close').click(function () {
        $('#image-modal').css('display', 'none');
        return true;
      });
    }
  }, {
    key: 'serviceListBuilder',
    value: function serviceListBuilder(facility) {
      var services = '';
      if (facility['NU_indicators_repeat[1]/site_activity/1'] === 'TRUE') {
        services = services + 'OTP';
      }
      if (facility['NU_indicators_repeat[1]/site_activity/2'] === 'TRUE') {
        services = '' + services + (!services.length ? ', SC' : 'SC');
      }
      if (facility['NU_indicators_repeat[1]/site_activity/3'] === 'TRUE') {
        services = '' + services + (!services.length ? ', TSFP' : 'TSFP');
      }
      if (facility['NU_indicators_repeat[1]/site_activity/4'] === 'TRUE') {
        services = '' + services + (services.length ? ', BSFP' : 'BSFP');
      }
      if (facility['NU_indicators_repeat[1]/site_activity/5'] === 'TRUE') {
        services = '' + services + (!services.length ? ', MCHN' : 'MCHN');
      }
      if (!services.length) {
        return false;
      }
      return services;
    }
  }, {
    key: 'educationFacilityDataBuilder',
    value: function educationFacilityDataBuilder(educationFacility) {
      if (!educationFacility || !educationFacility.UID) {
        return null;
      }

      var properties = educationFacility.properties,
          UID = educationFacility.UID,
          lat = educationFacility.lat,
          long = educationFacility.long,
          layer = educationFacility.layer;
      var funder = properties.funder,
          educationtype = properties.educationtype,
          facilitystructure = properties.facilitystructure,
          curriculum = properties.curriculum,
          curriculum_other = properties.curriculum_other,
          schoolname = properties.schoolname,
          region = properties.region,
          district = properties.district,
          village = properties.village;


      var educationData = {
        UID: UID,
        siteName: schoolname,
        long: long,
        lat: lat,
        layer: layer,
        region: region,
        district: district,
        village: village,
        funder: funder,
        educationtype: educationtype,
        facilitystructure: facilitystructure,
        curriculum: curriculum,
        curriculum_other: curriculum_other
      };

      return educationData;
    }
  }, {
    key: 'healthFacilityDataBuilder',
    value: function healthFacilityDataBuilder(Facility) {
      if (!Facility || !Facility.UID) {
        return null;
      }

      var properties = Facility.properties,
          UID = Facility.UID,
          lat = Facility.lat,
          long = Facility.long,
          layer = Facility.layer;


      var healthData = {
        UID: UID,
        siteName: properties['Facility Name'] || properties.facility,
        long: long,
        lat: lat,
        layer: layer,
        district: properties.District,
        region: properties.Region,
        typeOfSite: properties['Type of facility'] || properties['Type of site'],
        org: properties.type ? properties.type : properties['Facility Name'] ? 'UNICEF' : 'Service Availability and Readiness Assessment (SARA)'
      };

      return healthData;
    }
  }, {
    key: 'dynamicFacilityDataBuilder',
    value: function dynamicFacilityDataBuilder(Facility) {
      var properties = Facility.properties,
          UID = Facility.UID,
          title = Facility.title,
          lat = Facility.lat,
          long = Facility.long,
          layer = Facility.layer,
          feature = Facility.feature;


      var facilityData = {
        UID: UID,
        siteName: Facility.siteName,
        title: title || Facility.siteName,
        long: long,
        lat: lat,
        layer: layer,
        feature: feature,
        properties: properties,
        basicInfo: Facility.layerObj['basic-info']
      };
      return facilityData;
    }
  }, {
    key: 'facilityDataBuilder',
    value: function facilityDataBuilder(Facility) {
      if (!Facility || !Facility.UID || !stubFacilityData[Facility.UID]) {
        return null;
      }
      var UID = Facility.UID,
          lat = Facility.lat,
          long = Facility.long,
          siteName = Facility.siteName,
          layer = Facility.layer;

      var facilityArr = stubFacilityData[UID];
      var facility = facilityArr[facilityArr.length - 1];

      var facilityData = {
        UID: UID,
        siteName: siteName,
        lat: lat,
        long: long,
        layer: layer,
        verified: Facility.properties.verified,
        verificationStatus: Facility.properties['Verification Status'],
        servicesList: ProfileView.serviceListBuilder(facility),
        typeOfSite: facility['Type of site'],
        // typeOfSite: (facility['Type of site']).replace(/[\s][-](?=[a-zA-Z\d])/g, ' - '),
        org: facility['partner_details/organisation'] !== 'Other' ? facility['partner_details/organisation'].replace(/_/g, ' ') : facility['partner_details/organisation_unlisted'],

        region: facility['NU_indicators_repeat[1]/region'].replace(/_/g, ' '),
        district: facility['NU_indicators_repeat[1]/district'] !== 'Other' ? facility['NU_indicators_repeat[1]/district'].replace(/_/g, ' ') : facility['NU_indicators_repeat[1]/district_other'],

        settlement: facility['NU_indicators_repeat[1]/settlement_fixed'] !== 'Other' ? facility['NU_indicators_repeat[1]/settlement_fixed'].replace(/_/g, ' ') : facility['NU_indicators_repeat[1]/settlement_unlisted_fixed'],

        rpIndex: 0, // pointer for which reporting period is active
        reportingPeriods: [], // list of reporting periods
        services: {} // map of service/indicator data by reporting period
      };

      var rp = void 0;
      for (var f = 0; f < facilityArr.length; f += 1) {
        facility = facilityArr[f];
        rp = facility['partner_details/reporting_period'];
        if (rp) {
          facilityData.reportingPeriods.push(rp);
          if (!facilityData.services[rp]) {
            facilityData.services[rp] = ProfileView.indicatorBuilder(facility, Facility);
          }
        }
      }

      facilityData.rpIndex = facilityData.reportingPeriods.length - 1;

      return facilityData;
    }
  }, {
    key: 'indicatorBuilder',
    value: function indicatorBuilder(facility) {
      if (!facility) {
        return false;
      }
      var indicators = {};

      // OTP
      if (facility['NU_indicators_repeat[1]/site_activity/1'] === 'TRUE') {
        var totaladmitted = parseInt(facility['NU_indicators_repeat[1]/calculation_NU102a'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU103a'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU109a'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU104a'], 10);
        var otpIndicator = {
          type: 'OTP',
          isOpen: false,
          totals: totaladmitted,
          Admitted: {
            color: '#2ECC40',
            isOpen: false,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU101a']),
            boys: {
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU101a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU101a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU101a'] * 100)
            },
            girls: {
              label: 'Female Children',
              icon: '/assets/img/icon-girl-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU101a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU101a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU101a'] * 100)
            }
          },
          Recovered: {
            color: '#2ECC40',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU102a']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU102a'], 10) / totaladmitted * 100),
            boys: {
              color: '#48ae51',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU102a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU102a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU102a'] * 100)
            },
            girls: {
              color: '#84c686',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU102a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU102a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU102a'] * 100)
            }
          },
          'Non-recovered': {
            color: '#FFDC00',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU103a']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU103a'], 10) / totaladmitted * 100),
            boys: {
              color: '#f1b600',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-non-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU103a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU103a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU103a'] * 100)
            },
            girls: {
              color: '#f2cc51',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-non-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU103a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU103a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU103a'] * 100)
            }
          },
          Defaulted: {
            color: 'orange',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU109a']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU109a'], 10) / totaladmitted * 100),
            boys: {
              color: '#e47320',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-defaulted.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU109a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU109a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU109a'] * 100)
            },
            girls: {
              color: '#eaa066',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-defaulted.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU109a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU109a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU109a'] * 100)
            }
          },
          Died: {
            color: 'red',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU104a']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU104a'], 10) / totaladmitted * 100),
            boys: {
              color: '#d1413c',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-died.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU104a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU104a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU104a'] * 100)
            },
            girls: {
              color: '#de7f78',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-died.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU104a_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU104a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU104a'] * 100)
            }
          }
        };
        indicators.OTP = otpIndicator;
      }

      // SC
      if (facility['NU_indicators_repeat[1]/site_activity/2'] === 'TRUE') {
        var scTotal = parseInt(facility['NU_indicators_repeat[1]/calculation_NU102b'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU103b'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU109b'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU104b'], 10);
        var scIndicator = {
          type: 'SC',
          isOpen: false,
          totals: Number(facility['NU_indicators_repeat[1]/calculation_NU101b']),
          Admitted: {
            color: '#2ECC40',
            isOpen: true,
            total: facility['NU_indicators_repeat[1]/calculation_NU101b'],
            boys: {
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU101b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU101a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU101a'] * 100)
            },
            girls: {
              label: 'Female Children',
              icon: '/assets/img/icon-girl.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU101b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU101a_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU101a'] * 100)
            }
          },
          Recovered: {
            color: '#2ECC40',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU102b']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU102b'], 10) / scTotal * 100),
            boys: {
              color: '#48ae51',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU102b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU102b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU102b'] * 100)
            },
            girls: {
              color: '#84c686',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU102b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU102b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU102b'] * 100)
            }
          },
          'Non-recovered': {
            color: '#FFDC00',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU103b']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU103b'], 10) / scTotal * 100),
            boys: {
              color: '#f1b600',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-non-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU103b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU103b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU103b'] * 100)
            },
            girls: {
              color: '#f2cc51',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-non-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU103b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU103b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU103b'] * 100)
            }
          },
          Defaulted: {
            color: 'orange',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU109b']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU109b'], 10) / scTotal * 100),
            boys: {
              color: '#e47320',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-defaulted.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU109b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU109b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU109b'] * 100)
            },
            girls: {
              color: '#eaa066',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-defaulted.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU109b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU109b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU109b'] * 100)
            }
          },
          Died: {
            color: 'red',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU104b']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU104b'], 10) / scTotal * 100),
            boys: {
              color: '#d1413c',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-died.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU104b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU104b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU104b'] * 100)
            },
            girls: {
              color: '#de7f78',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-died.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU104b_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU104b_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU104b'] * 100)
            }
          }
        };
        indicators.SC = scIndicator;
      }

      // TSFP
      if (facility['NU_indicators_repeat[1]/site_activity/3'] === 'TRUE') {
        var tsfpTotal = parseInt(facility['NU_indicators_repeat[1]/calculation_NU102c'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU103c'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU109c'], 10) + parseInt(facility['NU_indicators_repeat[1]/calculation_NU104c'], 10);
        var tsfpIndicator = {
          type: 'TSFP',
          isOpen: false,
          totals: Number(facility['NU_indicators_repeat[1]/calculation_NU101c']),
          Admitted: {
            color: '#2ECC40',
            isOpen: true,
            total: facility['NU_indicators_repeat[1]/calculation_NU101c'],
            boys: {
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU101c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU101c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU101c'] * 100)
            },
            girls: {
              label: 'Female Children',
              icon: '/assets/img/icon-girl.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU101c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU101c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU101c'] * 100)
            },
            pregnant: {
              label: 'Pregnant or lactating women',
              icon: '/assets/img/icon-girl.svg',
              count: Number(facility['NU_indicators_repeat[1]/plw_NU101c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/plw_NU101c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU101c'] * 100)
            }
          },
          Recovered: {
            color: '#2ECC40',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU102c']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU102c'], 10) / tsfpTotal * 100),
            boys: {
              color: '#48ae51',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU102c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU102c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU102c'] * 100)
            },
            girls: {
              color: '#84c686',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU102c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU102c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU102c'] * 100)
            },
            pregnant: {
              color: '#b9dcb4',
              label: 'Pregnant or lactating women',
              icon: '/assets/img/icon-pregnant-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/plw_NU102c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/plw_NU102c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU102c'] * 100)
            }
          },
          'Non-recovered': {
            color: '#FFDC00',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU103c']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU103c'], 10) / tsfpTotal * 100),
            boys: {
              color: '#f1b600',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-non-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU103c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU103c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU103c'] * 100)
            },
            girls: {
              color: '#f2cc51',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-non-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU103c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU103c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU103c'] * 100)
            },
            pregnant: {
              color: '#f4de97',
              label: 'Pregnant or lactating women',
              icon: '/assets/img/icon-pregnant-non-recovered.svg',
              count: Number(facility['NU_indicators_repeat[1]/plw_NU103c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/plw_NU103c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU103c'] * 100)
            }
          },
          Defaulted: {
            color: 'orange',
            isOpen: true,
            total: Number(facility['NU_indicators_repeat[1]/calculation_NU109c']),
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU109c'], 10) / tsfpTotal * 100),
            boys: {
              color: '#e47320',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-defaulted.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU109c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU109c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU109c'] * 100)
            },
            girls: {
              color: '#eaa066',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-defaulted.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU109c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU109c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU109c'] * 100)
            },
            pregnant: {
              color: '#ebc4a5',
              label: 'Pregnant or lactating women',
              icon: '/assets/img/icon-pregnant-defaulted.svg',
              count: Number(facility['NU_indicators_repeat[1]/plw_NU109c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/plw_NU109c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU109c'] * 100)
            }
          },
          Died: {
            color: 'red',
            isOpen: true,
            total: facility['NU_indicators_repeat[1]/calculation_NU104c'],
            percentage: Math.round(parseInt(facility['NU_indicators_repeat[1]/calculation_NU104c'], 10) / tsfpTotal * 100),
            boys: {
              color: '#d1413c',
              label: 'Male Children',
              icon: '/assets/img/icon-boy-died.svg',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU104c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU104c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU104c'] * 100)
            },
            girls: {
              color: '#de7f78',
              label: 'Female Children',
              icon: '/assets/img/icon-girl-died.svg',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU104c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU104c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU104c'] * 100)
            },
            pregnant: {
              color: '#e8b6ad',
              label: 'Pregnant or lactating women',
              icon: '/assets/img/icon-pregnant-died.svg',
              count: Number(facility['NU_indicators_repeat[1]/plw_NU104c_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/plw_NU104c_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU104c'] * 100)
            }
          }
        };
        indicators.TSFP = tsfpIndicator;
      }

      // BSFP
      if (facility['NU_indicators_repeat[1]/site_activity/4'] === 'TRUE') {
        var bsfpIndicator = {
          type: 'BSFP',
          isOpen: false,
          totals: Number(facility['NU_indicators_repeat[1]/calculation_NU106']),
          Admitted: {
            color: '#333',
            isOpen: true,
            total: facility['NU_indicators_repeat[1]/calculation_NU106'],
            boys: {
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              color: '#5080D2',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU106_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU106_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU106'] * 100)
            },
            girls: {
              label: 'Female Children',
              icon: '/assets/img/icon-girl.svg',
              color: '#D25FA7',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU106_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU106_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU106'] * 100)
            },
            pregnant: {
              label: 'Pregnant or lactating women',
              icon: '/assets/img/icon-girl.svg',
              color: '#7C4FBB',
              count: Number(facility['NU_indicators_repeat[1]/plw_NU106_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/plw_NU106_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU106'] * 100)
            }
          }
        };
        indicators.BSFP = bsfpIndicator;
      }

      // MCHN
      if (facility['NU_indicators_repeat[1]/site_activity/5'] === 'TRUE') {
        var mchnIndicator = {
          type: 'MCHN',
          isOpen: false,
          totals: Number(facility['NU_indicators_repeat[1]/calculation_NU107']),
          Admitted: {
            color: '#333',
            isOpen: true,
            total: facility['NU_indicators_repeat[1]/calculation_NU107'],
            boys: {
              label: 'Male Children',
              icon: '/assets/img/icon-boy-recovered.svg',
              color: '#5080D2',
              count: Number(facility['NU_indicators_repeat[1]/boys_NU107_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/boys_NU107_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU107'] * 100)
            },
            girls: {
              label: 'Female Children',
              icon: '/assets/img/icon-girl.svg',
              color: '#D25FA7',
              count: Number(facility['NU_indicators_repeat[1]/girls_NU107_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/girls_NU107_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU107'] * 100)
            },
            pregnant: {
              label: 'Pregnant or lactating women',
              icon: '/assets/img/icon-girl.svg',
              color: '#7C4FBB',
              count: Number(facility['NU_indicators_repeat[1]/plw_NU107_calculate']),
              percent: Math.round(facility['NU_indicators_repeat[1]/plw_NU107_calculate'] / facility['NU_indicators_repeat[1]/calculation_NU107'] * 100)
            }
          }
        };
        indicators.MCHN = mchnIndicator;
      }

      return indicators;
    }
  }]);

  function ProfileView(props) {
    _classCallCheck(this, ProfileView);

    var _this = _possibleConstructorReturn(this, (ProfileView.__proto__ || Object.getPrototypeOf(ProfileView)).call(this, props));

    var layerObj = _this.props.facility.layerObj;


    if (!layerObj) {
      var _ret;

      return _ret = false, _possibleConstructorReturn(_this, _ret);
    }

    var facilityData = layerObj["feature-detail"] ? ProfileView.dynamicFacilityDataBuilder(_this.props.facility) : layerObj.id === 'nutrition-sites-fixed' ? ProfileView.facilityDataBuilder(_this.props.facility // nutrition builder
    ) : layerObj.id === 'educational-facilities' ? ProfileView.educationFacilityDataBuilder(_this.props.facility // education builder
    ) : ProfileView.healthFacilityDataBuilder(_this.props.facility // health builder
    );
    _this.state = Object.assign({}, facilityData);

    _this.toggleProfileView = _this.toggleProfileView.bind(_this);
    _this.updateReportingPeriod = _this.updateReportingPeriod.bind(_this);
    _this.rpNavClick = _this.rpNavClick.bind(_this);
    return _this;
  }

  _createClass(ProfileView, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var layerObj = nextProps.facility.layerObj;


      if (!layerObj) {
        return false;
      }

      var facilityData = layerObj["feature-detail"] ? ProfileView.dynamicFacilityDataBuilder(nextProps.facility) : layerObj.id === 'nutrition-sites-fixed' ? ProfileView.facilityDataBuilder(nextProps.facility // nutrition builder
      ) : layerObj.id === 'educational-facilities' ? ProfileView.educationFacilityDataBuilder(nextProps.facility // education builder
      ) : ProfileView.healthFacilityDataBuilder(nextProps.facility // health builder
      );

      this.setState(facilityData);

      return true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state) {
        ProfileView.imageModal();
      }
    }
  }, {
    key: 'toggleProfileView',
    value: function toggleProfileView(e) {
      e.preventDefault();
      this.props.centerMap();
    }
  }, {
    key: 'updateReportingPeriod',
    value: function updateReportingPeriod(e) {
      if (!e || !e.point || !e.point.category) {
        return false;
      }
      var nextReportingPeriod = e.point.category.replace(/ /g, '_');
      var rpIndex = this.state.reportingPeriods.indexOf(nextReportingPeriod);

      if (rpIndex === -1) {
        return false;
      }
      this.setState(Object.assign({}, this.state, { rpIndex: rpIndex }));
      return true;
    }
  }, {
    key: 'rpNavClick',
    value: function rpNavClick(e, pointer) {
      e.preventDefault();
      var rpIndex = void 0;
      if (pointer === 'prev') {
        if (this.state.rpIndex === 0) {
          return false;
        }
        rpIndex = this.state.rpIndex - 1;
      } else if (pointer === 'next') {
        if (this.state.rpIndex === this.state.reportingPeriods.length - 1) {
          return false;
        }
        rpIndex = this.state.rpIndex + 1;
      } else {
        rpIndex = Number(e.target.value);
      }

      if (this.state.rpIndex !== rpIndex) {
        this.setState(Object.assign({}, this.state, { rpIndex: rpIndex }));
      }
      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.state) {
        return null;
      }

      var layerObj = this.props.facility.layerObj;

      var isNutrition = layerObj.id === 'nutrition-sites-fixed';
      var isEducation = layerObj.id === 'educational-facilities';
      // universal facility properties
      var _state = this.state,
          siteName = _state.siteName,
          lat = _state.lat,
          long = _state.long,
          layer = _state.layer,
          basicInfo = _state.basicInfo;

      // nutrition facility properties

      var _state2 = this.state,
          typeOfSite = _state2.typeOfSite,
          settlement = _state2.settlement,
          district = _state2.district,
          region = _state2.region,
          org = _state2.org,
          servicesList = _state2.servicesList,
          verificationStatus = _state2.verificationStatus,
          verified = _state2.verified;

      // reporting period data

      var _state3 = this.state,
          reportingPeriods = _state3.reportingPeriods,
          rpIndex = _state3.rpIndex,
          services = _state3.services;

      var rpServices = reportingPeriods && services && services[reportingPeriods[rpIndex]];

      var indicatorComponents = rpServices ? Object.keys(rpServices).map(function (indicator, i) {
        return _react2.default.createElement(_IndicatorRow2.default, {
          services: rpServices[indicator],
          index: i
        });
      }) : 'No data for this facility';

      return _react2.default.createElement(
        'div',
        { className: 'profile-view-wrapper' },
        _react2.default.createElement(
          'a',
          {
            href: '#',
            onClick: function onClick(e) {
              return _this2.toggleProfileView(e);
            },
            className: 'open-btn open-profile',
            title: 'Open profile view'
          },
          _react2.default.createElement('span', { className: 'glyphicon glyphicon-list' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'profile-view-container' },
          _react2.default.createElement(
            'a',
            {
              className: 'close-btn',
              title: 'Close profile view',
              onClick: function onClick(e) {
                return _this2.toggleProfileView(e);
              },
              href: '#'
            },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
          ),
          basicInfo ? _react2.default.createElement(_ProfileViewHeader2.default, {
            siteName: siteName,
            long: long,
            lat: lat,
            layer: layer,
            layerObj: layerObj,
            facility: this.state
          }) : isNutrition ? _react2.default.createElement(_ProfileViewHeader2.default, {
            siteName: siteName,
            long: long,
            lat: lat,
            layer: layer,
            layerObj: layerObj,
            settlement: settlement,
            region: region,
            district: district,
            org: org,
            services: servicesList,
            typeOfSite: typeOfSite,
            verificationStatus: verificationStatus,
            verified: verified
          }) : isEducation ? _react2.default.createElement(_ProfileViewHeader2.default, {
            siteName: siteName,
            long: long,
            lat: lat,
            layer: layer,
            layerObj: layerObj,
            facility: this.state
          }) : _react2.default.createElement(_ProfileViewHeader2.default, {
            siteName: siteName,
            long: long,
            lat: lat,
            layer: layer,
            layerObj: layerObj,
            facility: this.state
          }),
          isNutrition ? _react2.default.createElement(
            'div',
            { className: 'profile-indicators' },
            _react2.default.createElement(_ReportingPeriodNav2.default, {
              updateReportingPeriod: this.updateReportingPeriod,
              reportingPeriods: { reportingPeriods: reportingPeriods },
              rpIndex: rpIndex,
              services: services,
              rpNavClick: this.rpNavClick
            }),
            _react2.default.createElement(
              'ul',
              null,
              indicatorComponents
            )
          ) : ''
        ),
        _react2.default.createElement(
          'div',
          { id: 'image-modal', className: 'modal' },
          _react2.default.createElement(
            'span',
            { className: 'close' },
            '\xD7'
          ),
          _react2.default.createElement('img', { alt: 'facility', className: 'modal-content', id: 'facility-image' }),
          _react2.default.createElement('div', { id: 'caption' })
        )
      );
    }
  }]);

  return ProfileView;
}(_react2.default.Component);

ProfileView.propTypes = {
  centerMap: _propTypes2.default.func.isRequired,
  facility: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = ProfileView;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/ProfileView/ProfileView.jsx