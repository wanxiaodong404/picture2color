/*
 * @Author: wanxiaodong
 * @Date: 2020-09-09 13:45:29
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-09-09 14:20:43
 * @Description:
 */
const config = require('./webpack.config.base')

module.exports = function() {
    return Object.assign({}, config, {mode: 'production'})
}