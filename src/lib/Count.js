/*
 * @Author: wanxiaodong
 * @Date: 2020-11-26 16:55:46
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-11-26 17:59:07
 * @Description: 用于统计count
 */

class Count {
    constructor(base = 1) {
        this.__count = base;
        this.__children = [];
        this.__parent = null;
    }

    resetCount(count = 1) {
        this.__count = count
    }

    append(item) {
        this.__children.push(item)
        item.__parent = this;
        this.plus(item.count)
    }

    plus(count = 1) {
        this.__count += count
    }

    get count() {
        return this.__count
    }

    get percent() {
        if (this.__parent) {
            return this.count / this.__parent.count * 100
        } else {
            return 100
        }
    }

}

module.exports = Count