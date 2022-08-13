/*
Entry
Указать входной файл, с которого wp начнёт строить граф зависимостей
По умолчанию его значение равно ./src/index.js
entry: './path/to/my/entry/file.js',

Output:
куда создавать пакеты , которые он создает, и как называть эти файлы.
По умолчанию ./dist/main.js

Loaders
могут использоваться с любым типом файла
используются для преобразования определенных типов модулей
Что-то вроде подключаем их и они делают с нашими файлами всякое
rules: [{ test: /\.txt$/, use: 'raw-loader' }],
Свойство test определяет, какой файл или файлы следует преобразовать.
Свойство use указывает, какой загрузчик следует использовать для преобразования.

Plugins
работают с конкретным типом файла и делают для него что-то конкретное

Mode
Установив для modeпараметра значение development, productionили none,
вы можете включить встроенные оптимизации веб-пакета,
соответствующие каждой среде. Значение по умолчанию равно production.


css-loader - позволяет импортить файлы css в js
import css from './style/style.css'
style-loader - позволяет импортить файлы css в js
import css from './style/style.css'
*/

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json', '.scss', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new LiveReloadPlugin({
      appendScriptTag: true
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
      minify: false,
      inject: 'body',
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/images', to: 'images' }
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [

          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer'
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '/icons/[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ]
  },
  stats: {
    children: true,
  }
};
