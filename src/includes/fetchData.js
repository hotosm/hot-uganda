'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_self, datasetID, properties, callback) {
  var fields = properties.map(function (p) {
    return '"' + p + '"';
  }).join();
  var queryParams = { fields: '[' + fields + ']' };
  milia.wrapper.set_host(protocol, host);
  milia.wrapper.get_form_data(datasetID, queryParams, _self.props.mapConfig.apiAccessToken, callback);
};

// import * as milia from 'milia-wrapper';

var protocol = 'https';
var host = 'api.ona.io';


// WEBPACK FOOTER //
// ./~/babel-loader/lib!./src/includes/fetchData.js