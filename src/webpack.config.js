const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");






const config = {
  //Entry point to the project
  entry: [
     "index.js", "..sass","App.css"
  ],
  //Webpack config options on how to obtain modules
  resolve: {
    modulesDirectories: ["node_modules", __dirname + "./" ],
    //When requiring, you don't need to add these extensions
    extensions: ['', '.js', '.md', '.txt','.sass','.jsx'],
    alias: {
      //material-ui requires will be searched in src folder, not in node_modules
      //'material-ui/lib': path.resolve(__dirname, 'web/static/js/material_ui/src'),
      

    },
  },
  devtool: 'source-map',
  //Configuration for server
  devServer: {
    contentBase: 'build',
  },
  //Output file config
  output: {
    path:  "./static",    //Path of output file
    filename: 'bundle.js',  //Name of output file
  },
  plugins: [
       new webpack.ProvidePlugin({
            'window.jQuery': 'jquery'
        }),

    new webpack.HotModuleReplacementPlugin(),//dev only

    //Allows error warninggs but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),

  ],
  externals: {
    fs: 'fs', // To remove once https://github.com/benjamn/recast/pull/238 is released
  },
  module: {
    //Allow loading of non-es5 js files.
      noParse: [/vendor\/phoenix/,/autoit.js/],
      loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
          {
                test: /(non-node-modules)\/.+\.(js|jsx)$/,
                loader: 'imports',
                query: {
                    $: 'jquery',
                    jQuery: 'jquery'
                }
            },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
     
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
          test: /\.css$/,
          loaders: ['style', 'css'],
            },
           {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass?indentedSyntax&includePaths[]=' + __dirname +  '/node_modules'),
      },

          {
                test: /\.(png|eot|tiff|svg|woff2|woff|ttf|gif|mp3|jpg)$/,
                loader: 'file',
                query: {
                    name: 'files/[hash].[ext]'
                }
            }

    ],
  },
  eslint: {
    configFile: '.eslintrc',
  },
};/*
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
      new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      }})
  );}

*/
module.exports = config;
