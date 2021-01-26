/*
 * @Author: wanxiaodong
 * @Date: 2020-09-09 13:45:29
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-01-26 11:02:39
 * @Description:
 */
const config = require('./webpack.config.base')
const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = function() {
    config.output.path = path.resolve(__dirname, '../examples/assets/')
    config.output.filename = 'index.js'
    return Object.assign({}, config, {
        mode: 'development',
        devServer: {
            port: 9191,
            open: true,
            hot:true,
            openPage: 'index.html',
            contentBase: path.resolve(__dirname, '../examples/')
        },
        plugins: [
            new HtmlPlugin({
                inject: 'head',
                filename: 'index.html',
                template: path.resolve(__dirname, '../examples/dev-demo.html')
            })
        ]
    })
}