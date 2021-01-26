/*
 * @Author: wanxiaodong
 * @Date: 2020-11-27 13:35:10
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-01-26 11:12:51
 * @Description:
 */
const utils = require("../utils")
const paramsFilter = require('../utils/paramsFilter')
const defaultOption = {
    index: 0,
    width: 0,
    height: 0,
    name: undefined
}
class Point {
    constructor(data, option = {}) {
        this.option = paramsFilter.point(Object.assign({}, defaultOption, option));
        let {index, width, height, name} = this.option
        this.data = data
        this.index = index
        this.width = width
        this.height = height
        this.__position = null
        this.__colorName = name || null
    }
    get position() {
        return this.__position || (this.__position = utils.index2position(this.index, this.width))
    }
    get colorName() {
        return this.__colorName || (this.__colorName = utils.data2color(this.data))
    }
}

module.exports = Point