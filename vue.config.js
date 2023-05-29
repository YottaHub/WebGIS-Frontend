const { defineConfig } = require('@vue/cli-service')

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const cesiumSource = './node_modules/cesium/Source';
const cesiumBuild = './node_modules/cesium/Build/Cesium';

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {

    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      "@": path.resolve("src"),
      components: path.resolve('src/components'),
      assets: path.resolve('src/assets'),
      views: path.resolve('src/views'),
      cesium: path.resolve(__dirname, cesiumSource),
      fallback: {
        "url": require.resolve("url/"),
        "zlib": require.resolve("browserify-zlib"),
        "assert": require.resolve("assert/"),
        "buffer": require.resolve("buffer/"),
        "stream": require.resolve("stream-browserify"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumBuild, 'Workers'), to: 'Workers' }
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumBuild, 'Assets'), to: 'Assets' }
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumBuild, 'Widgets'), to: 'Widgets' }
        ],
      }),
      new webpack.DefinePlugin({
          // Define relative base path in cesium for loading assets
          CESIUM_BASE_URL: JSON.stringify("./")
      })
    ],

  }
})
