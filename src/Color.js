/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:25:49
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-20 18:03:17
 * @Description:
 */

const utils = require('./utils')
const defaultOptionColor = {
    deepStep: 120
}
const groupMap = new Map()
class Color {
    constructor(data, option = {}, gid) {
        this.option = Object.assign({}, defaultOptionColor, option)
        this.data = data;
        this.value = Color.data2color(data);
        let group;
        if (gid) {
            group = groupMap.get(gid);
            if (!group) throw Error('未找到group')
        } else {
            gid = utils.getUniqueId()
            group = {
                gmap: new Set(),
                count: 1
            }
            groupMap.set(gid, group)
        }
        group.gmap.add(this);
        this.__gid = gid; // 组id 用于区分颜色集合
        this.__group = group; // 存放组的所有color group instance

        this.__count = 1;
        this.__total = 1;

        this.__contacts = []; // 包含
    }
    /**
     * 将其他color instance 包含进来
     * @param {*} color
     */
    contact(...colors) {
        colors.forEach(color => {
            if (!this.isContact(color)) {
                this.__contacts.push(color)
                if (color.__contacts.length <= 0) {
                    // this.__contacts.push(...color.__contacts)
                    color.__contacts = this.__contacts
                }
            }
        });
    }
    /**
     * 判断是否颜色或者颜色范围 包含此颜色
     * @param {*} color
     */
    isContact(color) {
        if (color instanceof Color) {
            // color instance
            return color.value === this.value || this.__contacts.some(item => item.value === color.value);
        } else if (color.length === 4) {
            // color data
            let colorStr = Color.data2color(color);
            return this.value === colorStr || this.__contacts.some(item => item.value === colorStr)
        } else {
            // rgba(0,0,0,1)
            return this.value === color || this.__contacts.some(item => item.value === color)
        }
    }
    /**
     * 需要按组统计百分比的时候叠加
     * @param {*} num
     */
    count(num = 1) {
        this.__group.count += num
        this.__count += num
    }
    /**
     * 按组生成color instance
     * @param {*} data
     * @param {*} option
     */
    groupFactory(data, option) {
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
    get Contacts() {
        return [this, ...this.__contacts]
    }
    /**
     * 百分比
     */
    get percent() {
        return this.__count / this.__group.count * 100
    }
    /**
     * 颜色深浅
     */
    get isDeep() {
        return utils.isDeep(this, this.option.deepStep)
    }
    /**
     * 坐标
     */
    get position() {
        return [this.__x, this.__y]
    }
    /**
     * color数据转rgba
     * @param {*} data
     */
    static data2color(data, type = 0) {
        const typeMap = {
            rgba: 0,
            hex: 1
        }
        try {
            let color;
            switch (type) {
                case typeMap.rgba: {
                    let [r, g, b, a] = data || [];
                    color = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                    break
                }
                case typeMap.hex: {
                    let [r, g, b, a] = data || [];
                    a = a / 255
                    r = r * a
                    g = g * a
                    b = b * a
                    color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
                    break
                }
            }
            return color;
        } catch (e) {
            return ''
        }
    }
    static clone(color, deep, gid) {
        let _color = new Color(color.data, color.option, gid)
        if (deep) {
            _color.setPosition(...color.position)
            _color.count(color.__count - 1)
        }
        return _color
    }
}

module.exports = Color