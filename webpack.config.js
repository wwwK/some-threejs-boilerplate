const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/app.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    publicPath: '/',
    port: 3000,
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true
  },
  module: {
    rules: [
      // Here's a rule for javascript files
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // Here's a rule for .sass, .scss, .css files
        test: /\.(sa|sc|c)ss$/,
        
        // Set loaders. Loader execute from last to first
        use: [
          {
            // After all CSS loaders we use plugin to do extract css into a single bundled file
            loader: MiniCssExtractPlugin.loader
          }, 
          {
            // Loader that resolves url() and @imports
            loader: "css-loader",
          },
          {
            // Handles autoprefixer and minifier
            loader: "postcss-loader"
          },
          {
            // Transform SASS to CSS
            loader: "sass-loader",
            options: {
              implementation: require("sass")
            }
          }
        ]
      },
      {
        // Here's a rule for 3D models
        test: /\.(obj|fbx|dae|stl|gltf|glb)$/,
        loader: "file-loader",
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: "/assets/models"
        }
      },
      {
        // Here's a rule for fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          name: '[name].[ext]',
          outputPath: "/assets/fonts"
        }
      },
      {
        // Here's a rule for images
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            // Using file-loader for these files
            loader: "file-loader",

            // In options we can set different things like format
            // and directory to save
            options: {
              name: '[name].[ext]',
              outputPath: '/assets/images'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/html/index.html',
      inject: true
    })
  ]
};
