const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
	title: "video-manipulator",
	template: "./src/index.html",
	filename: "./index.html"
});

module.exports = {
	mode: 'development',
	entry: './src/app.jsx',
	target: 'electron-renderer',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: './',
		filename: 'bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.(js|jsx)$/,
			exclude: [
			 /node_modules/,
			],
			use: {
				loader: 'babel-loader',
				query: {
					presets: ["env","react"]
				}
			}
		}, {
			test: /\.(s*)css$/,
			use: ['style-loader','css-loader']
		}]
	},
	plugins:[
		htmlPlugin
	],
	resolve: {
		extensions: ['.js','.jsx']
	}
}