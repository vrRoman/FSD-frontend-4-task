const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js'],
  },

  entry: {
    index: '@/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'slider.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
          },
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
              reloadAll: true,
            },
          },
          'css-loader',
          'resolve-url-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],

  optimization: {
    minimize: false,
  },
};
