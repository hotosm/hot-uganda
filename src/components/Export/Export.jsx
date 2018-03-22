'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _reactLoadScript = require('react-load-script');

var _reactLoadScript2 = _interopRequireDefault(_reactLoadScript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./Export.scss');

var exportPresetKey = {
  small: {
    square: { w: 800, h: 800 },
    landscape: { w: 1280, h: 800 },
    portrait: { w: 800, h: 1200 }
  },
  medium: {
    square: { w: 900, h: 900 },
    landscape: { w: 1440, h: 900 },
    portrait: { w: 900, h: 1440 }
  },
  large: {
    square: { w: 1080, h: 1080 },
    landscape: { w: 1920, h: 1080 },
    portrait: { w: 1080, h: 1920 }
  },
  huge: {
    square: { w: 1440, h: 1440 },
    landscape: { w: 2560, h: 1440 },
    portrait: { w: 1440, h: 2560 }
  },
  A4: {
    square: { w: 2480, h: 2480 },
    landscape: { w: 3508, h: 2480 },
    portrait: { w: 2480, h: 3508 },
    isPrint: true
  },
  A3: {
    square: { w: 3508, h: 3508 },
    landscape: { w: 4961, h: 3508 },
    portrait: { w: 3508, h: 4961 },
    isPrint: true
  },
  letter: {
    square: { w: 2550, h: 2550 },
    landscape: { w: 3300, h: 2550 },
    portrait: { w: 2550, h: 3300 },
    isPrint: true
  },
  tabloid: {
    square: { w: 3300, h: 3300 },
    landscape: { w: 5100, h: 3300 },
    portrait: { w: 3300, h: 5100 },
    isPrint: true
  },
  pp1: {
    square: { w: 768, h: 768 },
    landscape: { w: 1024, h: 768 },
    portrait: { w: 768, h: 1024 }
  },
  pp2: {
    square: { w: 720, h: 720 },
    landscape: { w: 1280, h: 720 },
    portrait: { w: 720, h: 1280 }
  }
};

var Export = function (_React$Component) {
  _inherits(Export, _React$Component);

  function Export(props) {
    _classCallCheck(this, Export);

    var _this = _possibleConstructorReturn(this, (Export.__proto__ || Object.getPrototypeOf(Export)).call(this, props));

    var _window = window,
        html2canvas = _window.html2canvas,
        devicePixelRatio = _window.devicePixelRatio,
        innerHeight = _window.innerHeight,
        innerWidth = _window.innerWidth;


    _this.state = {
      isOpen: false,
      isH2Cloaded: html2canvas && true || false,
      resValue: 1,
      dimHeight: innerHeight,
      dimWidth: innerWidth,
      titleText: 'Map Export',
      titleRender: false,
      screenWidth: innerWidth,
      screenHeight: innerHeight,
      ratio: 'screen',
      orientation: innerHeight === innerWidth ? 'square' : innerHeight / innerWidth > 1 ? 'portrait' : 'landscape',
      doFitMap: true,
      preset: 'custom',
      ppi: 96 * devicePixelRatio
    };

    _this.onOpenCloseClick = _this.onOpenCloseClick.bind(_this);
    _this.onCaptureClick = _this.onCaptureClick.bind(_this);
    _this.scriptIsLoaded = _this.scriptIsLoaded.bind(_this);
    _this.onOptionsChange = _this.onOptionsChange.bind(_this);
    _this.resetMapAfterExport = _this.resetMapAfterExport.bind(_this);
    return _this;
  }

  _createClass(Export, [{
    key: 'onOpenCloseClick',
    value: function onOpenCloseClick(e) {
      e.preventDefault();
      var isOpen = this.state.isOpen;

      this.setState({ isOpen: !isOpen });
    }
  }, {
    key: 'onCaptureClick',
    value: function onCaptureClick(e) {
      e.preventDefault();
      var _state = this.state,
          resValue = _state.resValue,
          dimWidth = _state.dimWidth,
          dimHeight = _state.dimHeight,
          titleText = _state.titleText,
          doFitMap = _state.doFitMap,
          ppi = _state.ppi,
          preset = _state.preset;
      var _props = this.props,
          map = _props.map,
          mapId = _props.mapId,
          config = _props.config;

      var self = this;

      // save the previous position of the map
      var prevMapState = {
        zoom: map.getZoom(),
        center: map.getCenter()
      };

      // resize map container / map
      (0, _jquery2.default)('#' + mapId).innerWidth(dimWidth / resValue).innerHeight(dimHeight / resValue);
      map.removeControl(map.controls);
      map.resize();

      if (config.mapBounds && doFitMap) {
        // fit to bounds as described in the app config
        map.fitBounds(config.mapBounds, {
          duration: 0,
          padding: 25
          // not sure why this doesn't work
          // padding: { top: 25, right: 25, bottom: 300, left: 300 },
        });
      } else {
        // or preserve the map center after resizing
        map.setCenter(prevMapState.center);
      }

      // create anchor element to trigger download
      var downloadA = document.createElement('a');
      // set the name of the the file to download
      downloadA.download = titleText.replace(/ /g, '-') + '.jpg';

      // delay momentarily to allow mapbox to re-render
      window.setTimeout(function () {
        // create temporary element to conatain all elements to render in export
        var exportEl = document.createElement('div');
        exportEl.id = 'exportEl';
        (0, _jquery2.default)(exportEl).append('<div class="topLeft"></div>').append('<div class="topRight"></div>').append('<div class="bottomLeft"></div>').append('<div class="bottomRight"></div>');
        // set the dimensions of the export container
        (0, _jquery2.default)(exportEl).innerWidth(dimWidth / resValue).innerHeight(dimHeight / resValue);

        // determine which elemtns (other than the actual map) needs to be included
        var selectorsToQuery = config.exportIncludes || [];
        selectorsToQuery = selectorsToQuery.concat(['.legend.' + mapId, '.series']);

        // determine intended output dpi of the image (300 for print, 96 for screens)
        var dpi = exportPresetKey[preset] && exportPresetKey[preset].isPrint ? 300 : 96;
        // calculate how much the cloned elements should be scaled
        var scale = dpi / ppi > 1 ? 1 / (dpi / ppi) : 0.75;

        var nodeToClone = void 0;
        var clonedNode = void 0;
        var originalStyles = void 0;
        // loop through all selectors of element to include
        for (var n = 0; n < selectorsToQuery.length; n += 1) {
          // deterine the node which needs to be cloned
          nodeToClone = document.querySelector(selectorsToQuery[n]);

          if (nodeToClone) {
            // clone the node
            clonedNode = nodeToClone.cloneNode(true);
            // get computed styling of original element
            originalStyles = window.getComputedStyle(nodeToClone);
            // set fixed widths to handle elements with fluid (%/calcualted) widths
            (0, _jquery2.default)(clonedNode).innerWidth(originalStyles.width);

            // based on calculated offsets of the original element,
            // determine which direction the cloned element should scale,
            // and append the clone to the appropriate scaling container
            if (parseInt(originalStyles.top, 10) < parseInt(originalStyles.bottom, 10) && parseInt(originalStyles.left, 10) < parseInt(originalStyles.right, 10)) {
              (0, _jquery2.default)('.topLeft', exportEl).append(clonedNode);
            } else if (parseInt(originalStyles.top, 10) < parseInt(originalStyles.bottom, 10) && parseInt(originalStyles.left, 10) > parseInt(originalStyles.right, 10)) {
              (0, _jquery2.default)('.topRight', exportEl).append(clonedNode);
            } else if (parseInt(originalStyles.top, 10) > parseInt(originalStyles.bottom, 10) && parseInt(originalStyles.left, 10) < parseInt(originalStyles.right, 10)) {
              (0, _jquery2.default)('.bottomLeft', exportEl).append(clonedNode);
            } else {
              (0, _jquery2.default)('.bottomRight', exportEl).append(clonedNode);
            }
          }
        }

        // scale the scalling containers
        (0, _jquery2.default)('.topLeft, .topRight, .bottomLeft, .bottomRight', exportEl).css('transform', 'scale(' + scale + ')');
        // insert the export container element in the DOM
        (0, _jquery2.default)('body').append(exportEl);
        // move (not copy) the map into the export container
        (0, _jquery2.default)('#exportEl').prepend((0, _jquery2.default)('#' + mapId + ' .mapboxgl-canvas-container'));

        // push export container element into a new canvas
        window.html2canvas(exportEl, {
          removeContainer: true, // remove the iframe created by html2canvas
          scale: resValue, // set the scale / resolution of the resulting canvas
          logging: false // this doesn't seem to work even when true...
        }).then(function (canvas) {
          // convert new canvas element to blob (not toDataUrl due to long base64 urls)
          canvas.toBlob(function (blob) {
            // restore the map to it's previous state
            self.resetMapAfterExport(prevMapState);
            // create download url from blob object
            downloadA.href = URL.createObjectURL(blob);
            // trigger actual download of exported image
            downloadA.click();
            // delete the export container and it's child clones
            (0, _jquery2.default)('#exportEl').remove();
          }, 'image/jpg');
        }, function () {
          // if the promise is rejected, restore the map to it's previous state
          self.resetMapAfterExport(prevMapState);
          // delete the export container and it's child clones
          (0, _jquery2.default)('#exportEl').remove();
          // indicate that the exprort failed
          alert('Export Failed - If this issue continues please contact ONA Support.');
        });
      }, 100);
    }
  }, {
    key: 'onOptionsChange',
    value: function onOptionsChange(e, option) {
      if (option !== 'titleRender' && option !== 'ratio' && option !== 'fitMap') {
        e.preventDefault();
      }
      var value = e.currentTarget.value || (0, _jquery2.default)(e.currentTarget).attr('value');
      var _state2 = this.state,
          resValue = _state2.resValue,
          dimHeight = _state2.dimHeight,
          dimWidth = _state2.dimWidth,
          orientation = _state2.orientation;
      var _state3 = this.state,
          titleText = _state3.titleText,
          titleRender = _state3.titleRender,
          doFitMap = _state3.doFitMap,
          preset = _state3.preset;

      var store = void 0;

      switch (option) {
        case 'resValue':
          dimHeight = dimHeight / resValue * value;
          dimWidth = dimWidth / resValue * value;
          resValue = value;
          break;
        case 'dimHeight':
          // todo - enable locking of ratio during custom sizing
          // dimRatio = dimWidth / dimHeight;
          dimHeight = value;
          // dimWidth = value * dimRatio;
          // resValue = Math.round(dimHeight / window.innerHeight * 10) / 10;
          break;
        case 'dimWidth':
          // dimRatio = dimHeight / dimWidth;
          dimWidth = value;
          // dimHeight = value * dimRatio;
          // resValue = Math.round(dimHeight / window.innerHeight * 10) / 10;
          break;
        case 'titleText':
          titleText = value;
          break;
        case 'titleRender':
          titleRender = !titleRender;
          break;
        case 'orientation':
          orientation = value;
          store = { w: dimWidth, h: dimHeight };
          if (preset !== 'custom') {
            dimHeight = exportPresetKey[preset][orientation].h;
            dimWidth = exportPresetKey[preset][orientation].w;
          } else {
            dimWidth = store.h;
            dimHeight = store.w;
          }
          if (orientation === 'square') {
            dimHeight = store.h < store.w ? store.h : store.w;
            dimWidth = dimHeight;
          }
          resValue = orientation !== 'landscape' ? window.innerHeight < dimHeight ? dimHeight / window.innerHeight : 1 : window.innerWidth < dimWidth ? dimWidth / window.innerWidth : 1;
          break;
        case 'fitMap':
          doFitMap = !doFitMap;
          break;
        case 'preset':
          preset = value;
          if (value !== 'custom') {
            dimHeight = exportPresetKey[preset][orientation].h;
            dimWidth = exportPresetKey[preset][orientation].w;
          }
          resValue = orientation !== 'landscape' ? window.innerHeight < dimHeight ? dimHeight / window.innerHeight : 1 : window.innerWidth < dimWidth ? dimWidth / window.innerWidth : 1;
          break;
        default:
          break;
      }

      this.setState({
        resValue: resValue,
        dimHeight: dimHeight,
        dimWidth: dimWidth,
        titleText: titleText,
        titleRender: titleRender,
        orientation: orientation,
        doFitMap: doFitMap,
        preset: preset
      });
    }
  }, {
    key: 'resetMapAfterExport',
    value: function resetMapAfterExport(prevMapState) {
      var _props2 = this.props,
          map = _props2.map,
          mapId = _props2.mapId,
          config = _props2.config;
      // move the map container element back to where it came from

      (0, _jquery2.default)('#exportEl .mapboxgl-canvas-container').insertBefore('#' + mapId + ' .mapboxgl-control-container');
      // remove fixed hight and width styling
      (0, _jquery2.default)('#' + mapId).removeAttr('style');
      // restore the map controls
      map.addControl(map.controls);
      // resize the map to it's containers new size
      map.resize();
      // if the map was fit to the container for export, restore it's previous center/zoom
      if (config.mapBounds) {
        map.setCenter(prevMapState.center);
        map.setZoom(prevMapState.zoom);
      }
    }
  }, {
    key: 'scriptIsLoaded',
    value: function scriptIsLoaded() {
      this.setState({ isH2Cloaded: true });
    }
  }, {
    key: 'updateScreenDimensions',
    value: function updateScreenDimensions() {
      this.setState({
        screenHeight: window.innerHeight,
        screenWidth: window.innerWidth
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state4 = this.state,
          isOpen = _state4.isOpen,
          isH2Cloaded = _state4.isH2Cloaded,
          preset = _state4.preset,
          doFitMap = _state4.doFitMap;
      var _state5 = this.state,
          dimHeight = _state5.dimHeight,
          dimWidth = _state5.dimWidth,
          orientation = _state5.orientation;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'a',
          {
            className: 'export-modal-btn export-btn-' + this.props.mapId,
            href: '#',
            onClick: function onClick(e) {
              _this2.onOpenCloseClick(e);
            },
            style: this.props.btnStyle
          },
          _react2.default.createElement('span', { className: 'glyphicon glyphicon-camera' })
        ),
        isOpen ? isH2Cloaded ? _react2.default.createElement(
          'div',
          { id: 'screenshot-modal' },
          _react2.default.createElement('span', {
            role: 'button',
            className: 'glyphicon glyphicon-remove closeBtn',
            onClick: function onClick(e) {
              _this2.onOpenCloseClick(e);
            },
            tabIndex: -1
          }),
          _react2.default.createElement(
            'form',
            { className: 'exportOptions' },
            _react2.default.createElement(
              'h3',
              null,
              'Map Export Options'
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'h5',
                null,
                'Image Size'
              ),
              _react2.default.createElement(
                'select',
                {
                  id: 'preset-size-' + this.props.mapId,
                  onChange: function onChange(e) {
                    _this2.onOptionsChange(e, 'preset');
                  }
                },
                _react2.default.createElement(
                  'option',
                  { value: 'custom', selected: true, disabled: true },
                  'Select a Size'
                ),
                _react2.default.createElement(
                  'optgroup',
                  { label: 'Web (px)' },
                  _react2.default.createElement(
                    'option',
                    { value: 'small' },
                    'Small (1280 x 800 px)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'medium' },
                    'Medium (1440 x 900 px)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'large' },
                    'Large (1920 x 1080 px)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'huge' },
                    'Huge! (2560 x 1440 px)'
                  )
                ),
                _react2.default.createElement(
                  'optgroup',
                  { label: 'Print' },
                  _react2.default.createElement(
                    'option',
                    { value: 'A4' },
                    'A4 (210 \xD7 297 mm)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'A3' },
                    'A3 (297 \xD7 420 mm)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'letter' },
                    'Letter (8.5 x 11 in)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'tabloid' },
                    'Tabloid (11 x 17 in)'
                  )
                ),
                _react2.default.createElement(
                  'optgroup',
                  { label: 'Other' },
                  _react2.default.createElement(
                    'option',
                    { value: 'pp1' },
                    'Powerpoint (standard)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'pp2' },
                    'Powerpoint (widescreen)'
                  ),
                  _react2.default.createElement(
                    'option',
                    { value: 'custom' },
                    'Custom...'
                  )
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'dimensions' },
              'Width:',
              _react2.default.createElement('input', {
                id: 'dimWidth-' + this.props.mapId,
                className: 'dimWidth' + (preset !== 'custom' ? ' disabled' : ''),
                type: 'number',
                onChange: function onChange(e) {
                  _this2.onOptionsChange(e, 'dimWidth');
                },
                value: Math.round(dimWidth),
                disabled: preset !== 'custom'
              }),
              'px\xA0\xA0\xA0\xA0Height:',
              _react2.default.createElement('input', {
                id: 'dimHeight-' + this.props.mapId,
                className: 'dimHeight' + (preset !== 'custom' ? ' disabled' : ''),
                type: 'number',
                onChange: function onChange(e) {
                  _this2.onOptionsChange(e, 'dimHeight');
                },
                value: Math.round(dimHeight),
                disabled: preset !== 'custom'
              }),
              'px'
            ),
            _react2.default.createElement(
              'div',
              { className: 'orientation' },
              _react2.default.createElement(
                'h5',
                null,
                'Orientation'
              ),
              _react2.default.createElement(
                'ul',
                { className: 'ratioOptions' },
                _react2.default.createElement(
                  'li',
                  null,
                  _react2.default.createElement(
                    'label',
                    {
                      htmlFor: 'ratio-portrait-' + this.props.mapId
                    },
                    'Portrait'
                  ),
                  _react2.default.createElement('div', {
                    style: { width: 2 / 3 * 100 + 'px' },
                    onClick: function onClick(e) {
                      _this2.onOptionsChange(e, 'orientation');
                    },
                    role: 'button',
                    value: 'portrait',
                    tabIndex: -1,
                    className: orientation === 'portrait' ? 'selected' : ''
                  }),
                  _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement('input', {
                      id: 'ratio-portrait-' + this.props.mapId,
                      name: 'ratio',
                      type: 'radio',
                      value: 'portrait',
                      onClick: function onClick(e) {
                        _this2.onOptionsChange(e, 'orientation');
                      },
                      checked: orientation === 'portrait'
                    })
                  )
                ),
                _react2.default.createElement(
                  'li',
                  null,
                  _react2.default.createElement(
                    'label',
                    {
                      htmlFor: 'ratio-landscape-' + this.props.mapId
                    },
                    'Landscape'
                  ),
                  _react2.default.createElement('div', {
                    style: { width: '150px' },
                    onClick: function onClick(e) {
                      _this2.onOptionsChange(e, 'orientation');
                    },
                    role: 'button',
                    value: 'landscape',
                    tabIndex: -1,
                    className: orientation === 'landscape' ? 'selected' : ''
                  }),
                  _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement('input', {
                      id: 'ratio-landscape-' + this.props.mapId,
                      name: 'ratio',
                      type: 'radio',
                      value: 'landscape',
                      onClick: function onClick(e) {
                        _this2.onOptionsChange(e, 'orientation');
                      },
                      checked: orientation === 'landscape'
                    })
                  )
                ),
                _react2.default.createElement(
                  'li',
                  null,
                  _react2.default.createElement(
                    'label',
                    {
                      htmlFor: 'ratio-square-' + this.props.mapId
                    },
                    'Square'
                  ),
                  _react2.default.createElement('div', {
                    style: { width: '100px' },
                    onClick: function onClick(e) {
                      _this2.onOptionsChange(e, 'orientation');
                    },
                    role: 'button',
                    value: 'square',
                    tabIndex: -1,
                    className: orientation === 'square' ? 'selected' : ''
                  }),
                  _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement('input', {
                      id: 'ratio-square-' + this.props.mapId,
                      name: 'ratio',
                      type: 'radio',
                      value: 'square',
                      onClick: function onClick(e) {
                        _this2.onOptionsChange(e, 'orientation');
                      },
                      checked: orientation === 'square'
                    })
                  )
                )
              ),
              this.props.config.mapBounds ? _react2.default.createElement(
                'div',
                { className: 'toFitToBounds' },
                _react2.default.createElement('input', {
                  id: 'do-fit-' + this.props.mapId,
                  className: 'fitMap',
                  type: 'checkbox',
                  checked: doFitMap,
                  onClick: function onClick(e) {
                    _this2.onOptionsChange(e, 'fitMap');
                  }
                }),
                _react2.default.createElement(
                  'label',
                  {
                    htmlFor: 'do-fit-' + this.props.mapId
                  },
                  'Fit map to export size and aspect ratio'
                )
              ) :
              // todo - add link to documentation
              _react2.default.createElement(
                'span',
                { className: 'boundsNote' },
                'Note: Provide the \'mapBounds\' configuration option to enable fitting the map',
                _react2.default.createElement('br', null),
                'within the exported image.'
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'h5',
                null,
                'Title'
              ),
              _react2.default.createElement('input', {
                id: 'titleText-' + this.props.mapId,
                className: 'titleText',
                type: 'text',
                placeholder: 'Map Export',
                onChange: function onChange(e) {
                  _this2.onOptionsChange(e, 'titleText');
                }
              })
            )
          ),
          _react2.default.createElement(
            'a',
            {
              role: 'button',
              tabIndex: -1,
              className: 'export-btn',
              onClick: function onClick(e) {
                _this2.onCaptureClick(e);
              }
            },
            'Export Map'
          )
        ) : _react2.default.createElement(_reactLoadScript2.default, {
          url: 'http://html2canvas.hertzen.com/dist/html2canvas.min.js',
          onLoad: function onLoad() {
            _this2.scriptIsLoaded();
          }
        }) : ''
      );
    }
  }]);

  return Export;
}(_react2.default.Component);

exports.default = Export;


Export.propTypes = {
  mapId: _propTypes2.default.string.isRequired,
  map: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  config: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
  btnStyle: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired
};


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/components/Export/Export.jsx