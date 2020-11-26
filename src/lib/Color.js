/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:25:49
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-11-26 18:07:28
 * @Description:
 */

const Count = require('./Count');
const utils = require('../utils')
const defaultOptionColor = {
    deepStep: 120,
    value: undefined // 优化字符串处理速度可传入提前处理好的name utils.data2color(data)
}
const groupMap = new Map()
class Color extends Count {
    constructor(data, option = {}, group = null) {
        super()
        this.option = Object.assign({}, defaultOptionColor, option)
        this.data = data;
        this.__group = group
        this.__colorName = option.value || null; // 颜色名
    }
    /**
     * 颜色深浅
     */
    get isDeep() {
        return utils.isDeep(this, this.option.deepStep)
    }
    /**
     * 获取颜色rgba名称，有缓存以及懒加载作用
     */
    get value() {
        return this.__colorName || (this.__colorName = this.toColorString())
    }
    /**
     * 转换不同的color string
     * @param {*} type
     */
    toColorString(type = 0) {
        return utils.data2color(this.data, type)
    }
    /**
     * 克隆color对象
     * @param {*} color
     * @param {*} option
     * @param {*} gid
     */
    static clone(color, option, group) {
        let _color = new Color(color.data, {...color.option, value: color.value, ...option}, group)
        return _color
    }
}

module.exports = Color