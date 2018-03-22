'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./StyleSelector.scss');

function StyleSelector(props) {
  return _react2.default.createElement(
    'div',
    { className: 'leaflet-left leaflet-top leaflet-right layer-selector', 'data-html2canvas-ignore': true },
    _react2.default.createElement(
      'div',
      { 'aria-haspopup': 'true', className: 'leaflet-control leaflet-control-layers' },
      _react2.default.createElement('a', { title: 'styles', className: 'leaflet-control-layers-toggle' }),
      _react2.default.createElement(
        'form',
        { className: 'leaflet-control-layers-list' },
        _react2.default.createElement(
          'div',
          { className: 'leaflet-control-layers-base' },
          props.styles.map(function (b) {
            return _react2.default.createElement(
              'label',
              { key: 'label_' + b.label, htmlFor: 'styles' },
              _react2.default.createElement('input', {
                readOnly: true,
                key: 'input_' + b.label,
                type: 'radio',
                name: 'leaflet-base-layers',
                className: 'leaflet-control-layers-selector',
                value: b.style,
                onClick: function onClick(e) {
                  return props.changeStyle(e.target.value);
                },
                checked: props.style === b.style
              }),
              _react2.default.createElement(
                'span',
                null,
                b.label
              )
            );
          })
        ),
        _react2.default.createElement('div', { className: 'leaflet-control-layers-overlays' })
      )
    )
  );
}

StyleSelector.propTypes = {
  styles: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
  style: _propTypes2.default.string.isRequired
};

exports.default = StyleSelector;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Controls/StyleSelector/StyleSelector.jsx