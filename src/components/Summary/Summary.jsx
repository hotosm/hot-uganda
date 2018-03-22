'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

var _SummarySplash = require('./SummarySplash');

var _SummarySplash2 = _interopRequireDefault(_SummarySplash);

var _SummaryProgress = require('./SummaryProgress');

var _SummaryProgress2 = _interopRequireDefault(_SummaryProgress);

var _SummaryNav = require('./SummaryNav');

var _SummaryNav2 = _interopRequireDefault(_SummaryNav);

var _SummaryTimeSeries = require('./SummaryTimeSeries');

var _SummaryTimeSeries2 = _interopRequireDefault(_SummaryTimeSeries);

var _PartnerPerformance = require('./PartnerPerformance');

var _PartnerPerformance2 = _interopRequireDefault(_PartnerPerformance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./Summary.scss');

var Summary = function (_React$Component) {
  _inherits(Summary, _React$Component);

  _createClass(Summary, null, [{
    key: 'parseDateFromFilepath',
    value: function parseDateFromFilepath(filePath) {
      var dateStr = filePath;
      dateStr = dateStr.slice(dateStr.indexOf('-') + 1, dateStr.indexOf('.csv'));
      return Date.UTC(dateStr.slice(0, -2), dateStr.slice(-2));
    }
  }]);

  function Summary(props) {
    _classCallCheck(this, Summary);

    var _this = _possibleConstructorReturn(this, (Summary.__proto__ || Object.getPrototypeOf(Summary)).call(this, props));

    _this.changeSector = _this.changeSector.bind(_this);
    // this.fetchSummaryDataFiles = this.fetchSummaryDataFiles.bind(this);
    // this.getLatestSummaryData = this.getLatestSummaryData.bind(this);
    // this.getPreviousSummaryData = this.getPreviousSummaryData.bind(this);
    _this.setHighchartStyles = _this.setHighchartStyles.bind(_this);
    _this.getSummaryData = _this.getSummaryData.bind(_this);
    _this.onSectorClick = _this.onSectorClick.bind(_this);
    _this.onChangeYear = _this.onChangeYear.bind(_this);

    var summaryData = _this.props.config.summaryData;

    var summaryDataYearKeys = Object.keys(summaryData);
    var PartnerData = {};
    var SectorData = {};

    for (var s = 0; s < summaryDataYearKeys.length; s += 1) {
      PartnerData[summaryDataYearKeys[s]] = [];
      SectorData[summaryDataYearKeys[s]] = [];
    }

    _this.state = {
      hasData: false, // prevents Summary subcomponents from rendering early
      isSplashPage: true, // renderds only high level splash page
      config: _this.props.config, // reference to config provided when instantiated

      currentYear: 0,
      currentSector: '', // slug to reference which sector to render
      currentSectorData: {}, // data used to render the actual components

      temporalIndex: 0, // pointer for referncing sets of data
      PartnerData: {}, // series of partnerData objects
      SectorData: {} // series of sectorData objects
    };

    // this.fetchSummaryDataFiles();
    _this.getSummaryData(true);
    _this.setHighchartStyles();
    return _this;
  }

  _createClass(Summary, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        isSplashPage: nextProps.isSplash
      });
    }
  }, {
    key: 'setHighchartStyles',
    value: function setHighchartStyles() {
      var highchartStyles = this.state.config.highchartStyles;


      if (!highchartStyles) {
        // todo - move this to a gisida config file
        // todo - add styles to plotOptions[*].dataLabels
        // todo - merge any provided styles from config to overwrite default
        highchartStyles = {
          title: {
            style: {
              fontFamily: '\'Montserrat\', sans-serif'
            }
          },
          tooltip: {
            style: {
              fontFamily: '\'Montserrat\', sans-serif'
            }
          },
          legend: {
            style: {
              fontFamily: '\'Montserrat\', sans-serif'
            }
          },
          xAxis: {
            labels: {
              style: {
                fontFamily: '\'Montserrat\', sans-serif'
              }
            },
            stackLabels: {
              style: {
                fontFamily: '\'Montserrat\', sans-serif'
              }
            }
          },
          yAxis: {
            labels: {
              style: {
                fontFamily: '\'Montserrat\', sans-serif'
              }
            },
            stackLabels: {
              style: {
                fontFamily: '\'Montserrat\', sans-serif'
              }
            }
          },
          credits: {
            enabled: false
          }
        };
      }

      _highcharts2.default.setOptions(highchartStyles);
    }
  }, {
    key: 'getSummaryData',
    value: function getSummaryData(isLatest) {
      var _this2 = this;

      var _props$config = this.props.config,
          summaryData = _props$config.summaryData,
          csvFilenames = _props$config.csvFilenames,
          csvDirectory = _props$config.csvDirectory;
      var _state = this.state,
          PartnerData = _state.PartnerData,
          SectorData = _state.SectorData;


      var yearKeys = Object.keys(summaryData);
      var csvPromises = [];

      // If only getting the latest, grab the last CSV from each year
      if (isLatest) {
        var _loop = function _loop(y) {
          var url = '' + csvDirectory + summaryData[yearKeys[y]][summaryData[yearKeys[y]].length - 1];
          csvPromises.push(new Promise(function (res, rej) {
            $.ajax({ url: url }).done(function (csv) {
              res(_this2.parseCSVdata(csv, url, yearKeys[y]));
            });
          }));
        };

        for (var y = 0; y < yearKeys.length; y += 1) {
          _loop(y);
        }
      } else {
        var _loop2 = function _loop2(y) {
          var _loop3 = function _loop3(u) {
            var url = '' + csvDirectory + summaryData[yearKeys[y]][u];
            csvPromises.push(new Promise(function (res, rej) {
              $.ajax({ url: url }).done(function (csv) {
                res(_this2.parseCSVdata(csv, url, yearKeys[y]));
              });
            }));
          };

          for (var u = 0; u < summaryData[yearKeys[y]].length - 1; u += 1) {
            _loop3(u);
          }
        };

        // Grab the rest of the CSVs from each year
        for (var y = 0; y < yearKeys.length; y += 1) {
          _loop2(y);
        }
      }

      // Reolve all promises and push parsed data into Partner/Sector Data
      Promise.all(csvPromises).then(function (results) {
        for (var r = 0; r < results.length; r += 1) {
          if (!PartnerData[results[r].year]) {
            PartnerData[results[r].year] = [];
          }

          if (!SectorData[results[r].year]) {
            SectorData[results[r].year] = [];
          }

          PartnerData[results[r].year].push(results[r].partnerMap);
          SectorData[results[r].year].push(results[r].sectorMap);
        }

        // Sort the Partner/Sector Data by Date
        if (!isLatest) {
          for (var y = 0; y < yearKeys.length; y += 1) {
            PartnerData[yearKeys[y]].sort(function (a, b) {
              return b.dataDate - a.dataDate;
            });
            SectorData[yearKeys[y]].sort(function (a, b) {
              return b.dataDate - a.dataDate;
            });
          }
        }

        _this2.setState({
          hasData: true,
          PartnerData: PartnerData,
          SectorData: SectorData
        }, function () {
          if (isLatest) _this2.getSummaryData(false);
        });
      });
    }

    // getLatestSummaryData(url) {
    //   $.ajax({
    //     url,
    //   })
    //   .done((data) => {
    //     // when loaded, parse the data for the initial view rendering
    //     const parsedData = this.parseCSVdata(data, url);
    //     const { sectorMap, partnerMap } = parsedData;

    //     // update the state, enabling the initial view rendering
    //     this.setState((prevState) => {
    //       let { SectorData, PartnerData } = prevState;
    //       SectorData = [sectorMap, ...SectorData];
    //       PartnerData = [partnerMap, ...PartnerData];

    //       return {
    //         hasData: true,
    //         sectorData: sectorMap,
    //         partnerData: partnerMap,

    //         currentSector: this.props.config.Sectors[0],
    //         currentSectorData: sectorMap[this.props.config.Sectors[0]],

    //         SectorData,
    //         PartnerData,
    //       };
    //     });
    //   })
    //   // if error, handle the error
    //   .fail((err) => {
    //     console.log(err);
    //   });
    // }

    // getPreviousSummaryData(urls) {
    //   // create an array of promises, each with its own AJAX request
    //   const csvPromises = urls.map(url =>
    //     new Promise((res, rej) => {
    //       $.ajax({ url })
    //       // once loaded, resolve promise with parsed data
    //       .done((csv) => {
    //         res(this.parseCSVdata(csv, url));
    //       })
    //       .fail((err) => {
    //         console.log(err);
    //         rej(err);
    //       });
    //     }),
    //   );

    //   // once all previous CSV requests are completed
    //   Promise.all(csvPromises).then((results) => {
    //     const SectorData = [];
    //     const PartnerData = [];

    //     // loop through all resulting parsed sets of data
    //     results.forEach((data) => {
    //       // push them into their repsective arrays
    //       SectorData.push(data.sectorMap);
    //       PartnerData.push(data.partnerMap);
    //     });

    //     // sort them both by date, newest to oldest
    //     PartnerData.sort((a, b) => b.dataDate - a.dataDate);
    //     SectorData.sort((a, b) => b.dataDate - a.dataDate);

    //     return {
    //       SectorData,
    //       PartnerData,
    //     };
    //   }).then((previousData) => {
    //     // update state, preserving reverse chronological order
    //     this.setState((prevState) => {
    //       const SectorData = [...prevState.SectorData, ...previousData.SectorData];
    //       const PartnerData = [...prevState.PartnerData, ...previousData.PartnerData];

    //       return {
    //         SectorData,
    //         PartnerData,
    //       };
    //     });
    //   });
    // }

    // // fetch the series of files in the summaryData directory
    // fetchSummaryDataFiles(year) {


    //   // todo - resolve this 403 access forbidden error when not local
    //   $.ajax({
    //     url: this.props.config.csvDirectory,
    //   })
    //   // responds with an HTML string which must be parsed
    //   .done((res) => {
    //     const fileURLs = [];
    //     let linkURL = '';

    //     // covert the resonse to virtual DOM elements for easier parsing
    //     const $res = $(res);

    //     // loop through all anchor tags within the reponse HTML
    //     $('a', $res).each((i, link) => {
    //       linkURL = $(link).attr('href');
    //       // if the link is a CSV, stash the URL
    //       if (linkURL.indexOf('.csv') !== -1) fileURLs.push(linkURL);
    //     });

    //     // the files are in chronoligical order due to naming convention
    //     // so the last one is the most recent data, driving the initial view
    //     this.getLatestSummaryData(fileURLs.pop());

    //     // older files can be loaded seperately as to not block the rendering
    //     if (fileURLs.length) this.getPreviousSummaryData(fileURLs);
    //   })
    //   .fail((err) => {
    //     console.log('directory ajax err -', err);
    //     const fileURLs = this.props.config.csvFilenames.map(file => `${this.props.config.csvDirectory}${file}`);
    //     this.getLatestSummaryData(fileURLs.pop());
    //     if (fileURLs.length) this.getPreviousSummaryData(fileURLs);
    //   });
    // }

  }, {
    key: 'parseCSVdata',
    value: function parseCSVdata(data, url, year) {
      var config = this.props.config;
      var Partners = config.Partners,
          Sectors = config.Sectors;

      var dataDate = Summary.parseDateFromFilepath(url);
      var rows = data.split(/\n/);
      var h1 = rows.shift().split(/,/);
      var h2 = rows.shift().split(/,/);
      var i = 0;

      // partnerMap - this is what we eventually push all the data to
      var partnerMap = {
        dataDate: dataDate
      };

      var partnerStr = '';
      var iRefProp = '';

      // loop through the header row to find partner columns
      for (i = 1; i < h1.length; i += 1) {
        partnerStr = h1[i];
        // check if header label is in config.Partners
        if (Partners.includes(partnerStr)) {
          // if partner object doesn't exist, create it on the map
          if (!partnerMap[partnerStr]) {
            partnerMap[partnerStr] = {
              sectorSums: {},
              metrics: {},
              options: config[partnerStr]
            };
          }
          // determine which column we're looking at
          iRefProp = h2[i] === 'Actual' ? 'actualColI' : 'plannedColI';
          // save the index to reference within the sector/metric rows
          partnerMap[partnerStr][iRefProp] = i;
        }
      }

      // sectorMap - a map from which to reference all the data
      var sectorMap = {
        dataDate: dataDate
      };
      var thisSectorStr = '';
      var val = '';
      var scrubRowValues = function scrubRowValues(thisVal, c) {
        val = thisVal;
        // if the first column, don't scrub
        if (c === 0) return val;
        // remove all spaces from val
        val = val.replace(/ /g, '').replace(/"/g, '');
        // if val is empty or a hyphen, return 0
        if (val === '' || val === '-') return 0;
        // if val has a percent symbol, remove it and return as a decimal
        if (val.indexOf('%') !== -1) return Number(val.replace('%', '')) / 100;
        // otherwise return val as a number while removing any commas
        return Number(val.replace(/,/g, ''));
      };

      // loop through rows looking for sectors
      for (i = 0; i < rows.length; i += 1) {
        // convert csv string to array
        rows[i] = rows[i].split(/,(?=\D|\d*%)/);

        // scrub CSV downloaded from Google Sheets
        rows[i] = rows[i].map(scrubRowValues);

        // check config.Sectors for match of first array value
        if (Sectors.includes(rows[i][0])) {
          // stash a reference to the current sector
          thisSectorStr = rows[i][0];
          // save sector to sectorMap
          sectorMap[thisSectorStr] = {
            values: rows[i], // save raw array of values
            metrics: config[thisSectorStr].metrics // reference sector metrics
          };

          // if not match, save as metric nested under current Sector
        } else {
          // save raw array of values
          sectorMap[thisSectorStr][rows[i][0]] = {
            values: rows[i]
          };
        }
      }

      // Save entire "columns" of values from partnerMap.partners
      var thisPartner = null;
      var thisSector = null;
      var thisMetric = null;
      var partnerActualI = 0;
      var partnerPlannedI = 0;
      // let partnerProp = '';
      // let sectorProp = '';
      var metricProp = '';
      var metricPropRef = '';

      // loop through all partners
      Object.keys(partnerMap).forEach(function (partnerProp) {
        if (partnerProp === 'dataDate') return false;
        thisPartner = partnerMap[partnerProp];

        // reference the partner column indecies
        partnerActualI = thisPartner.actualColI;
        partnerPlannedI = thisPartner.plannedColI;

        // loop through all sectors
        Object.keys(sectorMap).forEach(function (sectorProp) {
          if (sectorProp === 'dataDate') return false;
          thisSector = sectorMap[sectorProp];

          // save summations from sector "rows"
          thisPartner.sectorSums[sectorProp] = {
            actual: thisSector.values[partnerActualI],
            planned: thisSector.values[partnerPlannedI]
          };

          // loop through all metrics of each sector
          for (i = 0; i < thisSector.metrics.length; i += 1) {
            metricProp = thisSector.metrics[i];

            // if current metric is not in config, don't try to save it.
            // this should never happen...
            if (!config[sectorProp][metricProp]) return false;

            // If the metric doesn't exist in thisSector AND it has a property name that is different
            // than what should be displayed as in the UI, it should have reference in the config.
            if (!thisSector[metricProp] && !!config[sectorProp][metricProp].csvReference) {
              // This should only happen once b/c it will be updated in the sectorMap below
              metricPropRef = config[sectorProp][metricProp].csvReference;

              // ...otherwise reset metricPropRef to an empty string.
            } else {
              metricPropRef = '';
            }

            // define the metric object containing the entire row of values
            thisMetric = thisSector[metricPropRef || metricProp];

            // if there is no metric, don't try to save it. (this shouldn't happen)
            if (!thisMetric) return false;

            // If this metric was requiring a CSVreference then clean up
            // the associated metric in the sectorMap to match the config
            if (metricPropRef) {
              thisSector[metricProp] = thisSector[metricPropRef];
              thisSector[metricProp][0] = metricProp;
              delete thisSector[metricPropRef];
            }

            // Save the metric to partner.metric
            thisPartner.metrics[metricProp] = {
              actual: thisMetric.values[partnerActualI],
              planned: thisMetric.values[partnerPlannedI]
            };
          }

          return true;
        });

        return true;
      });

      return {
        year: year,
        sectorMap: sectorMap,
        partnerMap: partnerMap
      };
    }
  }, {
    key: 'changeSector',
    value: function changeSector(e) {
      if (!e.currentTarget.id) return false;
      var targetSector = e.currentTarget.id.replace(/-/g, ' ');
      var _state2 = this.state,
          SectorData = _state2.SectorData,
          currentYear = _state2.currentYear,
          temporalIndex = _state2.temporalIndex;


      this.setState({
        currentSector: targetSector,
        currentSectorData: SectorData[currentYear][temporalIndex][targetSector]
      });
      return true;
    }
  }, {
    key: 'onSectorClick',
    value: function onSectorClick(e, year) {
      var _this3 = this;

      e.preventDefault();
      if (!e.currentTarget.id) return false;
      var _state3 = this.state,
          SectorData = _state3.SectorData,
          temporalIndex = _state3.temporalIndex;

      var targetSector = e.currentTarget.id.replace(/-/g, ' ');
      if (this.state.config.Sectors.indexOf(targetSector) === -1) return false;

      this.setState({
        currentYear: year,
        currentSector: targetSector,
        currentSectorData: SectorData[year][temporalIndex][targetSector]
      }, function () {
        _this3.props.toggleSummaryIsSplash();
      });
    }
  }, {
    key: 'onChangeYear',
    value: function onChangeYear(e) {
      e.preventDefault();
      var _state4 = this.state,
          SectorData = _state4.SectorData,
          temporalIndex = _state4.temporalIndex,
          currentSector = _state4.currentSector;

      if (e.currentTarget.value === 'all') {
        this.setState({ isSplashPage: true });
      } else {
        this.setState({
          currentYear: e.currentTarget.value,
          currentSectorData: SectorData[e.currentTarget.value][temporalIndex][currentSector]
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state5 = this.state,
          hasData = _state5.hasData,
          isSplashPage = _state5.isSplashPage,
          config = _state5.config,
          currentSector = _state5.currentSector,
          currentSectorData = _state5.currentSectorData;
      var _state6 = this.state,
          SectorData = _state6.SectorData,
          PartnerData = _state6.PartnerData,
          currentYear = _state6.currentYear,
          temporalIndex = _state6.temporalIndex;
      var IconDirectory = config.IconDirectory,
          Sectors = config.Sectors;

      var metrics = currentSectorData && currentSectorData.metrics || [];;

      var PartnerPerformances = [];
      var headerDateStr = '';

      var currYearSectorData = void 0;
      var currYearPartnerData = void 0;

      if (hasData && !isSplashPage) {
        currYearSectorData = SectorData[currentYear];
        currYearPartnerData = PartnerData[currentYear];

        var dataDate = currYearSectorData[temporalIndex].dataDate;

        headerDateStr = '(' + _highcharts2.default.dateFormat('%d %B %Y', new Date(dataDate)) + ')';

        PartnerPerformances = [];
        metrics.forEach(function (metricProp) {
          if (currentSectorData[metricProp]) {
            PartnerPerformances.push(_react2.default.createElement(_PartnerPerformance2.default, {
              label: metricProp,
              metricData: currentSectorData[metricProp],
              partnerData: currYearPartnerData[temporalIndex]
            }));
          }
        });
      }

      // todo - TIMESERIES and dynamically render date in .summary-header
      return hasData ? isSplashPage ? _react2.default.createElement(
        'div',
        { className: 'summary-wrapper' },
        _react2.default.createElement(
          'div',
          { className: 'summary-header' },
          _react2.default.createElement(
            'h3',
            null,
            'DFiD Report Summary'
          )
        ),
        _react2.default.createElement(_SummarySplash2.default, {
          SectorData: SectorData,
          PartnerData: PartnerData,
          config: config,
          onSectorClick: this.onSectorClick
        })
      ) : _react2.default.createElement(
        'div',
        { className: 'summary-wrapper', 'data-currentsector': currentSector },
        _react2.default.createElement(
          'div',
          { className: 'summary-header' },
          _react2.default.createElement(
            'h3',
            null,
            'Progress Towards Targets'
          ),
          _react2.default.createElement(
            'span',
            null,
            headerDateStr
          ),
          _react2.default.createElement(
            'select',
            { className: 'year-select', onChange: function onChange(e) {
                _this4.onChangeYear(e);
              } },
            _react2.default.createElement(
              'option',
              { value: 'all' },
              'All'
            ),
            Object.keys(SectorData).map(function (year) {
              return _react2.default.createElement(
                'option',
                { value: year, selected: year == currentYear },
                year
              );
            })
          )
        ),
        _react2.default.createElement(_SummaryNav2.default, {
          navItems: { items: Sectors },
          changeSector: this.changeSector,
          currentSector: currentSector
        }),
        _react2.default.createElement(_SummaryProgress2.default, {
          currentSector: currentSector,
          currentSectorData: currentSectorData,
          sectorConfig: config[currentSector],
          iconDir: IconDirectory
        }),
        _react2.default.createElement(_SummaryTimeSeries2.default, {
          SectorData: currYearSectorData,
          temporalIndex: temporalIndex,
          currentSector: currentSector
        }),
        PartnerPerformances
      ) : null; // todo - return spinner component while loading data
    }
  }]);

  return Summary;
}(_react2.default.Component);

Summary.propTypes = {
  config: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  toggleSummaryIsSplash: _propTypes2.default.func.isRequired
};

exports.default = Summary;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Summary/Summary.jsx