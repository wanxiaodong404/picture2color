/*
 * @Author: wanxiaodong
 * @Date: 2020-11-27 13:35:10
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-11-27 14:16:36
 * @Description:
 */
const utils = require("../utils")
class Point {
    constructor(data, option = {}) {
        let {index, width, height} = option
        this.data = data
        this.index = index
        this.width = width
        this.height = height
        this.__position = null
        this.__colorName = null
    }
    get position() {
        return this.__position || (this.__position = utils.index2position(this.index, this.width))
    }
    get colorName() {
        return this.__colorName || (this.__colorName = utils.data2color(this.data))
    }
}

module.exports = Point