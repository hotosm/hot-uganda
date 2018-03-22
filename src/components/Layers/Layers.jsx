'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Layer = require('../Layer/Layer');

var _Layer2 = _interopRequireDefault(_Layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layers = function Layers(_ref) {
  var mapTargetId = _ref.mapTargetId,
      layers = _ref.layers,
      layerData = _ref.layerData,
      onLayerChange = _ref.onLayerChange,
      _ref$showProfileCompo = _ref.showProfileComponent,
      showProfileComponent = _ref$showProfileCompo === undefined ? function (f) {
    return f;
  } : _ref$showProfileCompo;
  return _react2.default.createElement(
    'ul',
    { className: 'layers' },
    layers.map(function (layer) {
      return _react2.default.createElement(_Layer2.default, {
        onLayerChange: onLayerChange,
        key: layer,
        mapTargetId: mapTargetId,
        layer: layer,
        layerData: layerData,
        showProfileComponent: showProfileComponent
      });
    })
  );
};

Layers.propTypes = {
  mapTargetId: _propTypes2.default.string.isRequired,
  layers: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
  layerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  onLayerChange: _propTypes2.default.func.isRequired,
  showProfileComponent: _propTypes2.default.func.isRequired
};

exports.default = Layers;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Layers/Layers.jsx