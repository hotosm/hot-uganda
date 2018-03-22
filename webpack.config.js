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
    path.join(__dirname, 'src/index.js'), path.join(__dirname,"src/App.scss")
  ],
  //Webpack config options on how to obtain modules
  resolve: {
    modulesDirectories: ["node_modules", __dirname + "/web/static/js/app" ],
    //When requiring, you don't need to add these extensions
    extensions: ['', '.js', '.md', '.txt','.sass','.jsx'],
    alias: {
    
      //'jquery':path.resolve(__dirname + "/node_modules/jquery/dist/jquery.js"),
        

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
      
    new webpack.HotModuleReplacementPlugin(),//dev only


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
