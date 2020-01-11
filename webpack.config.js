const path = require('path');

// This is our JavaScript rule that specifies what to do with .js files
// const javascript = {
//   test: /\.(js)$/, // see how we match anything that ends in `.js`? Cool
//   use: [
//     {
//       loader: 'babel-loader',
//       options: {
//         presets: ['@babel/preset-env'],
//       }, // this is one way of passing options
//     },
//   ],
// };

const config = {
  entry: {
    App: './public/javascripts/nomadPlace.js',
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  mode: 'development',
  devtool: 'source-map',
  watch: true,
};

module.exports = config;
