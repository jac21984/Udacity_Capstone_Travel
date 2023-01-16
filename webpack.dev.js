const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
	mode: 'development',
	devtool: 'source-map',
    entry: './src/client/index.js',
	output: {
		clean: true, // Clean the output directory before emit.
        libraryTarget: 'var',
        library: 'Client'
    },
	stats: 'verbose',
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
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
		
		new WorkboxPlugin.GenerateSW()
	]
    // Don't forget your commas!
}