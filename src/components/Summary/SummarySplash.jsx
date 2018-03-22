'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ProgressMetric = require('./ProgressMetric');

var _ProgressMetric2 = _interopRequireDefault(_ProgressMetric);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./SummarySplash.scss');

var SummarySplash = function (_React$Component) {
  _inherits(SummarySplash, _React$Component);

  _createClass(SummarySplash, null, [{
    key: 'buildSectorSummary',
    value: function buildSectorSummary(sectorData) {
      var sectorKeys = Object.keys(sectorData);
      var sectorSummary = {};
      var sector = void 0;
      var target = void 0;
      var actual = void 0;
      var percent = void 0;
      var right = void 0;
      var displayPercentage = void 0;
      var label = void 0;
      for (var s = 0; s < sectorKeys.length; s += 1) {
        sector = sectorData[sectorKeys[s]];
        if (sector.values) {
          target = sector.values[sector.values.length - 2];
          actual = sector.values[sector.values.length - 3];
          percent = actual / target;
          displayPercentage = target === 0 ? null : Math.round(percent * 100) + '%';

          if (actual === 0) {
            right = '100%';
          } else if (target === 0) {
            right = '0%';
          } else if (percent > 1) {
            right = (1 - target / actual) * 100 + '%';
          } else {
            right = (1 - percent) * 100 + '%';
          }

          sectorSummary[sectorKeys[s]] = { target: target, actual: actual, percent: percent, right: right, displayPercentage: displayPercentage };
        }
      }
      return sectorSummary;
    }
  }]);

  function SummarySplash(props) {
    _classCallCheck(this, SummarySplash);

    var _this = _possibleConstructorReturn(this, (SummarySplash.__proto__ || Object.getPrototypeOf(SummarySplash)).call(this, props));

    var _this$props = _this.props,
        SectorData = _this$props.SectorData,
        PartnerData = _this$props.PartnerData,
        config = _this$props.config;

    var yearKeys = Object.keys(SectorData).map(function (y) {
      return Number(y);
    }).sort(function (a, b) {
      return a - b;
    });
    var thisYearSectorData = SectorData[yearKeys[yearKeys.length - 1]];
    var lastYearSectorData = yearKeys.length < 2 ? null : SectorData[yearKeys[yearKeys.length - 2]];

    _this.state = {
      sectors: config.Sectors,
      thisYear: {
        year: yearKeys[yearKeys.length - 1],
        sectorData: thisYearSectorData[0],
        sectorSummary: SummarySplash.buildSectorSummary(thisYearSectorData[0])
      },
      lastYear: yearKeys.length < 2 ? null : {
        year: yearKeys[yearKeys.length - 2],
        sectorData: lastYearSectorData[0],
        sectorSummary: SummarySplash.buildSectorSummary(lastYearSectorData[0])
      },
      splashData: null
    };

    _this.getSplashData = _this.getSplashData.bind(_this);
    _this.getSplashData();
    return _this;
  }

  _createClass(SummarySplash, [{
    key: 'getSplashData',
    value: function getSplashData() {
      var self = this;
      d3.csv('data/summaryData/Data_for_Summary_Splash_Page.csv', function (splashData) {
        self.setState({ splashData: splashData });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          thisYear = _state.thisYear,
          lastYear = _state.lastYear;

      var tySectorSummary = thisYear.sectorSummary;
      var lySectorSummary = lastYear.sectorSummary;
      var lastYearRows = [];
      var thisYearRows = [];
      var sectorRow = void 0;
      var sectorKeys = void 0;
      var sectorKey = void 0;
      var sector = void 0;
      var s = void 0;
      var isOver = void 0;

      // START DYNAMIC AGGREGATION FROM SUMMARY DATA
      // if (lastYear) {
      //   sectorKeys = Object.keys(lastYear.sectorSummary);
      //   for (s = 0; s < sectorKeys.length; s += 1) {
      //     sector = lySectorSummary[sectorKeys[s]];
      //     isOver = sector.percent > 1;
      //     sectorKey = sectorKeys[s];
      //     sectorRow = (
      //       <li
      //         className={`splash-sector-item${isOver ? ' over' : ''}`}
      //         onClick={(e) => { this.props.onSectorClick(e, lastYear.year)}}
      //         id={sectorKey.replace(/ /g, '-')}
      //       >
      //         <h4>
      //           <a>{sectorKeys[s]}</a>{sector.displayPercentage ? ` ${sector.displayPercentage}` : ''}
      //         </h4>
      //       { true ? (
      //         <div>
      //           <div className="sector-progress">
      //             <span style={{ right: sector.right }} />
      //           </div>
      //           <span className="progress-numbers">
      //             <span className="actual">{sector.actual.toLocaleString()}</span>
      //             &nbsp;of&nbsp;
      //             <span className="planned">{sector.target.toLocaleString()}</span>
      //           </span>
      //         </div>
      //       ) : (
      //         <ProgressMetric
      //           type="total-progress"
      //           iconDir={this.props.config.IconDirectory}
      //           metricData={sector}
      //         />
      //       )}
      //       </li>
      //     );
      //     lastYearRows.push(sectorRow);
      //   }
      // }

      // sectorKeys = Object.keys(thisYear.sectorSummary);
      // for (s = 0; s < sectorKeys.length; s += 1) {
      //   sector = tySectorSummary[sectorKeys[s]];
      //   isOver = sector.percent > 1;
      //   sectorKey = sectorKeys[s];
      //   sectorRow = (
      //     <li
      //       className={`splash-sector-item${isOver ? ' over' : ''}`}
      //       onClick={(e) => { this.props.onSectorClick(e, thisYear.year)}}
      //       id={sectorKey.replace(/ /g, '-')}
      //     >
      //       <h4>
      //         <a>{sectorKeys[s]}</a>{sector.displayPercentage ? ` ${sector.displayPercentage}` : ''}
      //       </h4>
      //       { true ? (
      //         <div>
      //           <div className="sector-progress">
      //             <span style={{ right: sector.right }} />
      //           </div>
      //           <span className="progress-numbers">
      //             <span className="actual">{sector.actual.toLocaleString()}</span>
      //             &nbsp;of&nbsp;
      //             <span className="planned">{sector.target.toLocaleString()}</span>
      //           </span>
      //         </div>
      //       ) : (
      //         <ProgressMetric
      //           type="total-progress"
      //           iconDir={this.props.config.IconDirectory}
      //           metricData={sector}
      //         />
      //       )}
      //     </li>
      //   );
      //   thisYearRows.push(sectorRow);
      // }

      // return (
      //   <div className="summary-splash">
      //     {lastYear ? (
      //       <ul className="splash-sector-list first">
      //         <h3>{lastYear.year}</h3>
      //         {lastYearRows}
      //       </ul>
      //     ) : ''}
      //     <ul className="splash-sector-list">
      //       <h3>{thisYear.year}</h3>
      //       {thisYearRows}
      //     </ul>
      //   </div>
      // );
      // END DYNAMIC AGGREGATION FROM SUMMARY DATA


      // START HARDCODED FROM CSV
      var splashData = this.state.splashData;
      var config = this.props.config;

      if (!splashData) return null;

      var row = void 0;
      var actual = void 0;
      var target = void 0;
      var percent = void 0;
      var right = void 0;
      var isIncluded = void 0;
      var displayPercentage = void 0;
      var description = void 0;
      var lyRows = [];
      var tyRows = [];
      for (var r = 0; r < splashData.length; r += 1) {
        row = splashData[r];
        if (!row.Sector) continue;
        isIncluded = this.state.sectors.indexOf(row.Sector) !== -1;
        description = config[row.Sector] && config[row.Sector].description;
        actual = Number(row['2017 Actual']);
        target = Number(row['2017 Target']);
        percent = actual / target;
        isOver = percent > 1;
        displayPercentage = target === 0 ? null : Math.round(percent * 100) + '%';
        if (actual === 0) {
          right = '100%';
        } else if (target === 0) {
          right = '0%';
        } else if (isOver) {
          right = (1 - target / actual) * 100 + '%';
        } else {
          right = (1 - percent) * 100 + '%';
        }

        lyRows.push(_react2.default.createElement(
          'li',
          {
            className: 'splash-sector-item' + (isOver ? ' over' : '') + (!isIncluded ? ' disabled' : ''),
            onClick: function onClick(e) {
              _this2.props.onSectorClick(e, '2017');
            },
            id: row.Sector.replace(/ /g, '-')
          },
          _react2.default.createElement(
            'h4',
            null,
            _react2.default.createElement(
              'a',
              null,
              row.Sector
            ),
            displayPercentage ? ' ' + displayPercentage : ''
          ),
          _react2.default.createElement(
            'div',
            { className: 'sector-progress' },
            _react2.default.createElement('span', { style: { right: right } })
          ),
          _react2.default.createElement(
            'span',
            { className: 'progress-numbers' },
            _react2.default.createElement(
              'span',
              { className: 'actual' },
              actual.toLocaleString()
            ),
            '\xA0of\xA0',
            _react2.default.createElement(
              'span',
              { className: 'planned' },
              target.toLocaleString()
            ),
            !!description ? _react2.default.createElement(
              'div',
              { className: 'description' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-info-sign' }),
              _react2.default.createElement(
                'p',
                null,
                description
              )
            ) : ''
          )
        ));

        actual = Number(row['2018 Actual']);
        target = Number(row['2018 Target']);
        percent = actual / target;
        isOver = percent > 1;
        displayPercentage = target === 0 ? null : Math.round(percent * 100) + '%';
        if (actual === 0) {
          right = '100%';
        } else if (target === 0) {
          right = '0%';
        } else if (isOver) {
          right = (1 - target / actual) * 100 + '%';
        } else {
          right = (1 - percent) * 100 + '%';
        }

        tyRows.push(_react2.default.createElement(
          'li',
          {
            className: 'splash-sector-item' + (isOver ? ' over' : '') + (!isIncluded ? ' disabled' : ''),
            onClick: function onClick(e) {
              _this2.props.onSectorClick(e, '2018');
            },
            id: row.Sector.replace(/ /g, '-')
          },
          _react2.default.createElement(
            'h4',
            null,
            _react2.default.createElement(
              'a',
              null,
              row.Sector
            ),
            displayPercentage ? ' ' + displayPercentage : ''
          ),
          _react2.default.createElement(
            'div',
            { className: 'sector-progress' },
            _react2.default.createElement('span', { style: { right: right } })
          ),
          _react2.default.createElement(
            'span',
            { className: 'progress-numbers' },
            _react2.default.createElement(
              'span',
              { className: 'actual' },
              actual.toLocaleString()
            ),
            '\xA0of\xA0',
            _react2.default.createElement(
              'span',
              { className: 'planned' },
              target.toLocaleString()
            ),
            !!description ? _react2.default.createElement(
              'div',
              { className: 'description' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-info-sign' }),
              _react2.default.createElement(
                'p',
                null,
                description
              )
            ) : ''
          )
        ));
      }

      tyRows.push(_react2.default.createElement(
        'li',
        {
          className: 'splash-sector-item disabled',
          onClick: function onClick(e) {
            _this2.props.onSectorClick(e, '2018');
          },
          id: 'Agriculture-Support'
        },
        _react2.default.createElement(
          'h4',
          null,
          _react2.default.createElement(
            'a',
            null,
            'Agriculture Support'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'sector-progress' },
          _react2.default.createElement('span', { style: { right: '100%' } })
        ),
        _react2.default.createElement(
          'span',
          { className: 'progress-numbers' },
          _react2.default.createElement(
            'span',
            { className: 'actual' },
            '0'
          ),
          '\xA0of\xA0',
          _react2.default.createElement(
            'span',
            { className: 'actual' },
            '59,000'
          )
        )
      ));

      return _react2.default.createElement(
        'div',
        { className: 'summary-splash' },
        _react2.default.createElement(
          'ul',
          { className: 'splash-sector-list first' },
          _react2.default.createElement(
            'h3',
            null,
            '2017'
          ),
          lyRows
        ),
        _react2.default.createElement(
          'ul',
          { className: 'splash-sector-list' },
          _react2.default.createElement(
            'h3',
            null,
            '2018'
          ),
          tyRows
        )
      );
      // END HARD CODED FROM CSV
    }
  }]);

  return SummarySplash;
}(_react2.default.Component);

SummarySplash.propTypes = {
  SectorData: _propTypes2.default.objectOf(_propTypes2.default.Array).isRequired,
  PartnerData: _propTypes2.default.objectOf(_propTypes2.default.Array).isRequired,
  onSectorClick: _propTypes2.default.func.isRequired
};

exports.default = SummarySplash;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Summary/SummarySplash.jsx