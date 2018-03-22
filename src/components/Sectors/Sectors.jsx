'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Layers = require('../Layers/Layers');

var _Layers2 = _interopRequireDefault(_Layers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./Sectors.scss');

var Sectors = function Sectors(_ref) {
  var sectorMenuId = _ref.sectorMenuId,
      mapTargetId = _ref.mapTargetId,
      sectorData = _ref.sectorData,
      layerData = _ref.layerData,
      _ref$onToggleSectors = _ref.onToggleSectors,
      onToggleSectors = _ref$onToggleSectors === undefined ? function (f) {
    return f;
  } : _ref$onToggleSectors,
      _ref$onSectorClick = _ref.onSectorClick,
      onSectorClick = _ref$onSectorClick === undefined ? function (f) {
    return f;
  } : _ref$onSectorClick,
      _ref$onLayerChange = _ref.onLayerChange,
      onLayerChange = _ref$onLayerChange === undefined ? function (f) {
    return f;
  } : _ref$onLayerChange,
      _ref$showProfileCompo = _ref.showProfileComponent,
      showProfileComponent = _ref$showProfileCompo === undefined ? function (f) {
    return f;
  } : _ref$showProfileCompo;
  return _react2.default.createElement(
    'div',
    { id: sectorMenuId + '-wrapper', className: 'sectors-menu-wrapper' },
    _react2.default.createElement(
      'a',
      { href: '#', onClick: function onClick(e) {
          return onToggleSectors(e, mapTargetId);
        }, className: 'open-btn' },
      _react2.default.createElement('span', { className: 'glyphicon glyphicon-list' })
    ),
    _react2.default.createElement(
      'div',
      { id: sectorMenuId, className: 'sectors-menu' },
      _react2.default.createElement(
        'a',
        { className: 'close-btn', onClick: function onClick(e) {
            return onToggleSectors(e, mapTargetId);
          }, href: '#' },
        _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
      ),
      _react2.default.createElement(
        'ul',
        { className: 'sectors' },
        sectorData.map(function (sector, i) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            _react2.default.createElement(
              'li',
              { className: 'sector', key: i },
              _react2.default.createElement(
                'a',
                { href: '#', onClick: function onClick(e) {
                    return onSectorClick(e, mapTargetId);
                  } },
                sector.sector,
                ' ',
                _react2.default.createElement('span', { className: 'caret' })
              ),
              _react2.default.createElement(_Layers2.default, {
                onLayerChange: onLayerChange,
                mapTargetId: mapTargetId,
                layers: sector.layers,
                layerData: layerData,
                showProfileComponent: showProfileComponent
              })
            )
          );
        })
      )
    )
  );
};

Sectors.propTypes = {
  sectorMenuId: _propTypes2.default.string.isRequired,
  mapTargetId: _propTypes2.default.string.isRequired,
  sectorData: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
  layerData: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  onToggleSectors: _propTypes2.default.func.isRequired,
  onSectorClick: _propTypes2.default.func.isRequired,
  onLayerChange: _propTypes2.default.func.isRequired,
  showProfileComponent: _propTypes2.default.func.isRequired
};

exports.default = Sectors;


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Sectors/Sectors.jsx