/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:25:49
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-28 09:47:39
 * @Description:
 */

const utils = require('./utils')
const defaultOptionColor = {
    deepStep: 120,
    value: undefined // 优化字符串处理速度可传入提前处理好的value utils.data2color(data)
}
const groupMap = new Map()
class Color {
    constructor(data, option = {}, gid = null) {
        this.option = Object.assign({}, defaultOptionColor, option)
        this.data = data;
        this.value = option.value || utils.data2color(data); // 优化字符串处理速度
        let group = null;
        if (gid) {
            group = groupMap.get(gid);
            if (!group) throw Error('未找到group')
            group.gmap.add(this);
        }
        this.__gid = gid; // 组id 用于区分颜色集合
        this.__group = group; // 存放组的所有color group instance

        this.__count = 1;
        this.__total = 1;

        this.__contacts = []; // 包含颜色范围集合
    }
    /**
     * 将其他color instance 包含进来
     * @param {*} color
     */
    contact(...colors) {
        colors.forEach(color => {
            if (color.__contacts.length === 0) {
                this.__contacts.push(color)
                color.__contacts = this.__contacts
            }
        });
    }
    /**
     * 判断是否颜色或者颜色范围 包含此颜色
     * @param {*} color
     */
    isContact(color) {
        if (typeof color === 'string') {
            // rgba(0,0,0,1)
            return this.value === color || this.__contacts.some(item => item.value === color)
        } else if (color instanceof Color) {
            // color instance
            return color.value === this.value || this.__contacts.some(item => item.value === color.value);
        } else {
            // color data
            if (color === this.data) return true
            let colorStr = utils.data2color(color);
            return this.value === colorStr || this.__contacts.some(item => item.value === colorStr)
        }
    }
    /**
     * 需要按组统计百分比的时候叠加
     * @param {*} num
     */
    count(num = 1) {
        this.__group && (this.__group.count += num)
        this.__count += num
    }
    /**
     * 按组生成color instance
     * @param {*} data
     * @param {*} option
     */
    groupFactory(data, option) {
        if (!this.__gid) {
            this.__gid = utils.getUniqueId()
            let group = {
                gmap: new Set(),
                count: this.__count
            };
            groupMap.set(this.__gid, group)
            group.gmap.add(this);
            this.__group = group
        }
        if (data instanceof Color) {
            return new Color(data.data, option || data.option, this.__gid)
        } else {
            return new Color(data, option, this.__gid)
        }
    }
    /**
     * 判断是否是颜色范围
     */
    get isRange() {
        return this.__contacts.length > 0
    }
    /**
     * 包含自己的所有颜色范围
     */
    get contacts() {
        return [this, ...this.__contacts]
    }
    /**
     * 百分比
     */
    get percent() {
        return this.__count / (this.__group ? this.__group.count : this.__count) * 100
    }
    /**
     * 颜色深浅
     */
    get isDeep() {
        return utils.isDeep(this, this.option.deepStep)
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
    static clone(color, option, gid) {
        let _color = new Color(color.data, {...color.option, value: color.value, ...option}, gid)
        return _color
    }
}

module.exports = Color