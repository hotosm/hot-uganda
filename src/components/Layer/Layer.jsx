'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layer = function Layer(_ref) {
  var mapTargetId = _ref.mapTargetId,
      layer = _ref.layer,
      layerData = _ref.layerData,
      onLayerChange = _ref.onLayerChange,
      _ref$showProfileCompo = _ref.showProfileComponent,
      showProfileComponent = _ref$showProfileCompo === undefined ? function (f) {
    return f;
  } : _ref$showProfileCompo;
  return _react2.default.createElement(
    'li',
    { className: 'layer ' + mapTargetId },
    _react2.default.createElement('input', {
      type: 'checkbox',
      id: layer + '-' + mapTargetId,
      'data-layer': layer,
      onChange: function onChange(e) {
        return onLayerChange(layer, e.target.checked, mapTargetId);
      },
      onClick: function onClick(e) {
        return showProfileComponent(e);
      }
    }),
    _react2.default.createElement(
      'label',
      {
        htmlFor: layer + '-' + mapTargetId
      },
      layerData[layer].label
    )
  );
};

Layer.propTypes = {
  mapTargetId: _propTypes2.default.string.isRequired,
  layer: _propTypes2.default.string.isRequired,
  layerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  onLayerChange: _propTypes2.default.func.isRequired,
  showProfileComponent: _propTypes2.default.func.isRequired
};

exports.default = Layer;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Layer/Layer.jsx