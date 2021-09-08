/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:25:49
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-09-08 18:02:21
 * @Description:
 * @Focus: 注意：如果是需要新增属性和方法，请确认是否需要在ColorGroup的代理中进行设置
 */

const Count = require('./Count');
const utils = require('../utils')
const types = require('../types')
const paramsFilter = require('../utils/paramsFilter')
const defaultOptionColor = {
    deepStep: 120,
    value: undefined, // 优化字符串处理速度可传入提前处理好的name utils.data2color(data)
    type: types.RGBACOLOR
}
const groupMap = new Map()
class Color extends Count {
    constructor(data, option = {}) {
        super(1) // count = 1
        if (data instanceof Color) return data;
        this.option = paramsFilter.color(Object.assign({}, defaultOptionColor, option));
        this.data = data;
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
    toColorString(type = types.RGBACOLOR) {
        return utils.data2color(this.data, this.option.type || type)
    }
    /**
     * 克隆color对象
     * @param {*} color
     * @param {*} option
     * @param {*} gid
     */
    static clone(color, option) {
        let _color = new Color(color.data, utils.paramsFilter.color({...color.option, value: color.__colorName, ...option}))
        _color.resetCount(color.__count)
        return _color
    }
}

module.exports = Color