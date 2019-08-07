import HTMLWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { join } from 'path'

module.exports = env => ({
  // entry: join(__dirname, 'index.js'),
  entry: ['react-hot-loader/patch', join(__dirname, 'index.js')],
  output: {
    filename: 'bundle.js',
    path: join(__dirname, '../../app')
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: env.dev ? 'source-map' : false,

  resolve: {
    modules: [__dirname]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: join(__dirname, 'index.html'),
      inject: 'body',
      hash: true
    })
  ],

  module: {
    rules: [
      {
        test: /.jsx?$/,
        include: [__dirname],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css']
  }
})
