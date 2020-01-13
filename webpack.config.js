const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

// JavaScript rule
const javascript = {
  test: /\.m?js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  },
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() {
      return [autoprefixer()];
    },
  },
};

const styles = {
  // test: /\.s(a|c)ss$/,
  test: /\.(scss)$/,
  // here we pass the options as query params b/c it's short.
  // remember above we used an object for each loader instead of just a string?
  // We don't just pass an array of loaders, we run them through the extract plugin so they can be outputted to their own .css file
  use: [MiniCssExtractPlugin.loader, 'css-loader', postcss, 'sass-loader'],
};

const config = {
  entry: {
    App: './public/javascripts/nomadPlace.js',
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [javascript, styles],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),
  ],
  mode: 'development',
  devtool: 'source-map',
  watch: true,
};

module.exports = config;
