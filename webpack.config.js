const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./client-src/src/index.html",
  filename: "./index.html"
});

module.exports = {
  entry: "./client-src/src/index.js",
  output: {
    path: path.resolve(__dirname, './client'),
    filename: 'index_bundle.js',
  },
  module: {
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
  plugins: [htmlPlugin]
};