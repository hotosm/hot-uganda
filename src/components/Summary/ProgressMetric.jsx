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

require('./ProgressMetric.scss');

var ProgressMetric = function (_React$Component) {
  _inherits(ProgressMetric, _React$Component);

  _createClass(ProgressMetric, null, [{
    key: 'getPercentages',
    value: function getPercentages(actual, target) {
      // Determine percentage of metric (Actual / Target)%
      var percentWidth = 0;
      var percentRound = 0;

      // if denominator of 0, don't do math...
      if (target === 0) {
        // if numerator isn't 0, fill all progress icons
        if (actual !== 0) {
          percentRound = actual.toLocaleString();
          percentWidth = 100;
        }

        return {
          rowIconCounts: [10],
          percentWidths: [percentWidth],
          percentRound: percentRound
        };
      }

      // a float reference of the actual progress percentage
      var percentLiteral = actual / target * 100;
      // an integer fo the percentage used for lthe label
      percentRound = Math.round(percentLiteral);

      var percentWidths = []; // array to stash widths of each row
      var rowIconCounts = []; // array to stash icon counts of each row
      var iconCount = Math.ceil(percentRound / 10); // eg - 101% => 11 icons
      var c = 0; // counter for icons
      var p = percentLiteral; // counter for total amount of percentage
      var isLastRow = false;
      var isFirstRow = true;

      // run through the total count of icons
      while (iconCount) {
        // reference determining if this row is the last
        isLastRow = iconCount <= 10;

        // determine the icon count for this row
        c = isLastRow ? iconCount : 10;
        rowIconCounts.push(isFirstRow ? 10 : c);

        // determine the width percentage for the rows div.over
        percentWidth = isLastRow ? ProgressMetric.calculateWidthPercentage(p / 10, isFirstRow ? 10 : c) : 100;

        percentWidths.push(percentWidth);

        if (isFirstRow) isFirstRow = false;
        // reduce the total percentage counter by the width of the row
        p -= percentWidth;
        // reduce the total count of icons needing to be rendered
        iconCount -= c;
      }

      // return both onto this.state.percentages
      return {
        rowIconCounts: rowIconCounts,
        percentWidths: percentWidths,
        percentRound: percentRound
      };
    }

    // An agorithm for showing more accurate progress indicators
    // by accounting for the whitespace between icons.
    // Example (7.1, 10) => Result  (72.735%)

  }, {
    key: 'calculateWidthPercentage',
    value: function calculateWidthPercentage(actual, target) {
      var basePercentage = actual / target; // .710
      var iconPercentage = 26 / 46 / 10; // 0.0565 - percentage of total space taken by an icon
      var leftPercentage = 10 / 46 / 10; // 0.0217 - percentage of space taken by whitespace

      var fullIconCount = Math.floor(basePercentage * 10); // 7
      var remainingPerc = basePercentage - fullIconCount / 10; // 0.010

      var actualPercentage = 0;

      actualPercentage += fullIconCount / 10; // 0.7000
      actualPercentage += leftPercentage; // .7217 = .7000 + .0217
      actualPercentage += remainingPerc * 10 * iconPercentage; // .72735 = .7217 + ((.1) * .0565)

      return actualPercentage * 100; // 72.735(%)
    }
  }]);

  function ProgressMetric(props) {
    _classCallCheck(this, ProgressMetric);

    var _this = _possibleConstructorReturn(this, (ProgressMetric.__proto__ || Object.getPrototypeOf(ProgressMetric)).call(this, props));

    var _this$props = _this.props,
        type = _this$props.type,
        iconDir = _this$props.iconDir;
    var _this$props$metricDat = _this.props.metricData,
        iconFilename = _this$props$metricDat.iconFilename,
        label = _this$props$metricDat.label,
        actual = _this$props$metricDat.actual,
        target = _this$props$metricDat.target,
        description = _this$props$metricDat.description;


    _this.buildProgressRows = _this.buildProgressRows.bind(_this);
    _this.buildLIs = _this.buildLIs.bind(_this);

    _this.state = {
      type: type,
      label: label,
      actual: actual,
      target: target,
      description: description,

      iconSrc: iconDir && iconFilename ? '' + iconDir + iconFilename : null,
      iconAlt: 'Icon for ' + label,
      percentages: ProgressMetric.getPercentages(actual, target)
    };
    return _this;
  }

  _createClass(ProgressMetric, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var type = nextProps.type,
          iconDir = nextProps.iconDir;
      var _nextProps$metricData = nextProps.metricData,
          iconFilename = _nextProps$metricData.iconFilename,
          label = _nextProps$metricData.label,
          actual = _nextProps$metricData.actual,
          target = _nextProps$metricData.target,
          description = _nextProps$metricData.description;


      this.setState({
        type: type,
        label: label,
        actual: actual,
        target: target,
        description: description,

        iconSrc: iconDir && iconFilename ? '' + iconDir + iconFilename : null,
        iconAlt: 'Icon for ' + label,
        percentages: ProgressMetric.getPercentages(actual, target)
      });
    }
  }, {
    key: 'buildLIs',
    value: function buildLIs(r, count, position) {
      var c = count;
      var LIs = []; // array of react li elements for each row
      var svgSrc = position === 'under' ? 'person-icon-gray' : r ? 'person-icon-green' : 'person-icon-blue';

      while (c) {
        LIs.push(_react2.default.createElement(
          'li',
          { key: c.toString() },
          _react2.default.createElement('img', { alt: 'Progress Icon', src: '' + this.props.iconDir + svgSrc + '.svg' })
        ));
        c -= 1;
      }

      return LIs;
    }
  }, {
    key: 'buildProgressRows',
    value: function buildProgressRows(percentages) {
      var rowIconCounts = percentages.rowIconCounts,
          percentWidths = percentages.percentWidths;

      // if no progress has been made, return a single 'under' row

      if (!rowIconCounts.length) {
        return [_react2.default.createElement(
          'div',
          { key: 0, className: 'progress-row clearfix' },
          _react2.default.createElement(
            'div',
            { className: 'under' },
            _react2.default.createElement(
              'ul',
              null,
              this.buildLIs(0, 10, 'under')
            )
          )
        )];
      }

      var rows = []; // array of react row elements to return
      var row = _react2.default.createElement('div', null);
      var c = 0; // counter for icons

      // loop through all the rows in rowIconCounts
      for (var r = 0; r < rowIconCounts.length; r += 1) {
        // if it's the first row, always render 10 icons
        c = !r ? 10 : rowIconCounts[r];

        // define the width style of the row's 'over' div to show progress
        var progressOverStyle = { width: percentWidths[r] + '%' };

        // build the row as a compound react element
        row = _react2.default.createElement(
          'div',
          { key: r.toString(), className: 'progress-row clearfix' },
          _react2.default.createElement(
            'div',
            { className: 'under' },
            _react2.default.createElement(
              'ul',
              null,
              this.buildLIs(r, c, 'under')
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'over' },
            _react2.default.createElement(
              'ul',
              { className: r ? 'extra' : '', style: progressOverStyle },
              this.buildLIs(r, c, 'over')
            )
          )
        );

        // push the row into its array for rendering
        rows.push(row);
      }

      return rows;
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          type = _state.type,
          label = _state.label,
          actual = _state.actual,
          target = _state.target,
          iconSrc = _state.iconSrc,
          iconAlt = _state.iconAlt,
          percentages = _state.percentages,
          description = _state.description;


      var progressRows = this.buildProgressRows(percentages);
      var isPercent = !(typeof percentages.percentRound === 'string');
      var percentClass = 'progress-percent ' + (isPercent ? percentages.percentRound >= 100 ? 'green' : '' : 'actual');

      return _react2.default.createElement(
        'div',
        { className: type },
        label ? _react2.default.createElement(
          'div',
          { className: 'label-wrapper' },
          _react2.default.createElement(
            'span',
            null,
            label
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
        ) : '',
        _react2.default.createElement(
          'div',
          { className: 'icon-wrapper' + (!iconSrc ? ' empty' : '') },
          iconSrc ? _react2.default.createElement('img', { src: iconSrc, alt: iconAlt }) : ''
        ),
        _react2.default.createElement(
          'div',
          { className: 'progress-wrapper' },
          progressRows
        ),
        _react2.default.createElement(
          'div',
          { className: 'stats-wrapper' },
          _react2.default.createElement(
            'span',
            { className: percentClass },
            '' + percentages.percentRound + (isPercent ? '%' : '')
          ),
          _react2.default.createElement(
            'span',
            { className: 'progress-actual' },
            'Total (Actual):\xA0',
            _react2.default.createElement(
              'span',
              null,
              actual.toLocaleString()
            )
          ),
          _react2.default.createElement(
            'span',
            { className: 'progress-target' },
            type === 'total-progress' ? 'DFID Target' : 'Planned',
            ':\xA0',
            _react2.default.createElement(
              'span',
              null,
              target.toLocaleString()
            )
          )
        )
      );
    }
  }]);

  return ProgressMetric;
}(_react2.default.Component);

ProgressMetric.propTypes = {
  iconDir: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.string.isRequired,
  metricData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};

exports.default = ProgressMetric;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Summary/ProgressMetric.jsx