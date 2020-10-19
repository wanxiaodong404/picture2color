/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:25:49
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-19 18:14:01
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
        this.__x = 0;
        this.__y = 0;
    }
    /**
     * 需要按组统计百分比的时候叠加
     * @param {*} num
     */
    count(num = 1) {
        this.__group.count += num
        this.__count += num
    }
    setPosition(x = 0, y = 0) {
        this.__x = x
        this.__y = y
    }
    /**
     * 按组生成color instance
     * @param {*} data
     * @param {*} option
     */
    groupFactory(data, option) {
        return new Color(data, option, this.__gid)
    }
    get percent() {
        return this.__count / this.__group.count * 100
    }
    get isDeep() {
        return utils.isDeep(this, this.option.deepStep)
    }
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
    static clone(color, gid) {
        let _color = new Color(color.data, color.option, gid)
        _color.setPosition(...color.position)
        _color.count(color.__count - 1)
        return _color
    }
}

module.exports = Color