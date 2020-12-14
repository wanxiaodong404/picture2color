/*
 * @Author: wanxiaodong
 * @Date: 2020-09-09 13:37:07
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-12-14 16:47:02
 * @Description:
 */
const path = require('path')
module.exports = {
    entry: {
        index: path.resolve(__dirname, '../src/index.js')
    },
    output: {
        library: 'Picture2color',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true,
        path: path.resolve(__dirname, '../dist/'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}