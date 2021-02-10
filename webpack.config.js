'use strict'

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = function (env, options) {
  const isDev = (options.mode === 'development')
  const isProd = !isDev

  return {
    output: {
      filename: 'game.[fullhash:16].js',
      path: path.resolve(__dirname, 'dist'),
      assetModuleFilename: 'assets/[name].[hash:16][ext]'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          enforce: 'pre',
          use: {
            loader: 'standard-loader',
            options: { error: isProd, globals: 'Phaser' }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env',
                  { targets: 'defaults', useBuiltIns: 'usage', corejs: '3.8' }]
              ]
            }
          }
        },
        {
          test: [/\.vert$/, /\.frag$/],
          type: 'asset/source'
        },
        {
          test: /\.(png|jpe?g|svg|xml)$/i,
          type: 'asset/resource'
        }
      ]
    },

    optimization: {
      minimize: isProd
    },

    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',

    performance: {
      maxEntrypointSize: 1_474_560,
      maxAssetSize: 1_474_560
    },

    devServer: {
      overlay: true,
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    },

    plugins: [
      env.WEBPACK_SERVE ? null : new CleanWebpackPlugin(), // so `webpack serve` doesn't clear dist/
      new webpack.DefinePlugin({
        CANVAS_RENDERER: JSON.stringify(true),
        WEBGL_RENDERER: JSON.stringify(true)
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ].filter(Boolean)
  }
}
