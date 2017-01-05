var webpack = require('webpack');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'index.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    //グローバル変数にjQueryを配置する
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: "jquery"
    })
    ,
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        //cosnoleを取り除く
        drop_console: false
      }
    })
  ]
};
