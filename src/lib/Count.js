/*
 * @Author: wanxiaodong
 * @Date: 2020-11-26 16:55:46
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-12-23 15:52:56
 * @Description: 用于统计count
 */

class Count {
    constructor(base = 0) {
        this.__count = base;
        this.__children = [];
        this.__parent = null;
    }

    resetCount(count = 0) {
        this.__count = count
    }

    append(item) {
        this.__children.push(item)
        item.__parent = this;
        this.plus(item.__count)
    }

    plus(count = 1) {
        this.__count += count
        if (this.__parent) {
            this.__parent.plus(count)
        }
    }

    get count() {
        return this.__count
    }

    get percent() {
        if (this.__parent) {
            return this.__count / this.__parent.__count * 100
        } else {
            return 100
        }
    }

}

module.exports = Count