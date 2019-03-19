const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path');


module.exports = {
  entry: {
    index: "./client-src/src/index.js"
  },
  output: {
    path: path.resolve('./' , 'client'),
    filename: '[name].js'
  },
  module: {
    // loaders are run in ascending order
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test:/\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true,
              minimize: true
            }
          },
          {
            loader: "sass-loader"
          } 
        ]
      }
    ]
  },
  plugins: [
    //automatically create a html page to serve webpack bundles
    new HtmlWebPackPlugin({
      inject: true,
      chunks: ['index'],
      template: "./client-src/src/index.html",
      filename: "./index.html"
    })
  ]
};