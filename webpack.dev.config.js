const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sliderConf = {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js'],
  },

  entry: {
    index: '@/slider.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist/slider'),
    filename: 'slider.min.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
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

    new MiniCssExtractPlugin({
      filename: 'slider.min.css',
    }),
  ],

  optimization: {
    minimize: false,
  },
};

const demoConf = {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js'],
  },

  entry: {
    index: '@/demo/demo.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/demo'),
    filename: 'demo.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: 'slider.css',
    }),

    new HtmlWebpackPlugin({
      template: './src/demo/demo.html',
      filename: 'demo.html',
      inject: false,
      hash: true,
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    open: true,
    openPage: 'demo/demo.html',
    port: 9000,
    hot: true,
  },

  optimization: {
    minimize: false,
  },
};

module.exports = [
  demoConf,
  sliderConf,
];
