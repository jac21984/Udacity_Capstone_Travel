const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
    entry: './src/client/index.js',
	output: {
		clean: true, // Clean the output directory before emit.
        libraryTarget: 'var',
        library: 'Client'
    },
	optimization: {
		minimizer: [
		  new CssMinimizerPlugin(),
		],
	},
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            },
			{
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]',
                }
            }
        ]
    },
    // TODO: Add the plugin for index.html
    plugins: [
		new HtmlWebPackPlugin({
			template: "./src/client/views/index.html",
			filename: "./index.html",
		}),
		
		new MiniCssExtractPlugin({filename: '[name].css'}),
		
		new WorkboxPlugin.GenerateSW()
	]
    // Don't forget your commas!
}