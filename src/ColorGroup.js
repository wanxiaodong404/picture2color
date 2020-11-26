/*
 * @Author: wanxiaodong
 * @Date: 2020-11-26 14:50:42
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-11-26 17:41:47
 * @Description:
 */
const Color = require('./Color');
const Count = require('./Count');
const utils = require('./utils/index')
class ColorGroup extends Count {
    constructor(child) {
        super();
        this.__proxy = child || null; // 如果是颜色范围的话，可设置一个颜色代表用以代表这个颜色范围
        this.gid = utils.getUniqueId();
        this.__pool = new Map();
        if (child) {
            this.concat(child)
        }
    }
    /**
     * 追加颜色到色池
     * @param {Color} color
     */
    pushPool(color) {
        if (color instanceof Color) {
            this.__pool.set(color.name, color);
            this.append(color)
        } else if (color instanceof ColorGroup){
            this.__pool.set(color.proxy.name, color);
            this.append(color)
        } else {
            this.__groupPool.set(color.proxy.name, color);
            this.append(color)
        }
    }
    /**
     * 向色组内追加颜色
     * @param {Group || Color || [rgba]} color
     * @return {Color}
     */
    concat(color, option) {
        let pool = this.__pool
        if (color instanceof Color) {
            let data = pool.get(color.name)
            if (data) {
                // 如果传入的是color 则 option可传入的为count
                data.plus(color.count)
                this.plus(color.count)
            } else {
                this.pushPool(color)
            }
        } else if (color instanceof ColorGroup) {
            let data = pool.get(color.proxy.name)
            if (data) {
                data.plus(color.count)
                this.plus(color.count)
            } else {
                this.pushPool(color)
            }
        } else {
            let colorString = utils.data2color(color);
            let data = pool.get(colorString)
            if (data) {
                data.plus()
                this.plus()
            } else {
                color = new Color(color, {
                    ...option,
                    name: colorString
                }, this)
                this.pushPool(color)
            }
        }
        return color
    }
    /**
     * 判断是否包含此颜色
     * @param {*} colorName
     */
    hasChild(colorName) {
        return this.__pool.has(colorName)
    }

    get proxy() {
        return this.__proxy
    }

    set proxy(color) {
        if (!this.__proxy) {
            this.__proxy = color
        }
    }

    get name() {
        return  this.proxy && this.proxy.name
    }

    get list() {
        return Array.from(this.__pool.values())
    }

    get sortList() {
        return this.list.sort((item1, item2) => item2.count - item1.count)
    }
}

module.exports = ColorGroup