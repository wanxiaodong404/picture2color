/*
 * @Author: wanxiaodong
 * @Date: 2020-09-18 17:51:04
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-09-18 18:08:52
 * @Description:
 */
module.exports = {
    sourceType: 'unambiguous',
    presets: ['@babel/preset-env'],
    plugins: [
        '@babel/transform-runtime',
        ['@babel/plugin-proposal-class-properties', {"loose": false}],
        '@babel/plugin-syntax-class-properties'
    ]
}