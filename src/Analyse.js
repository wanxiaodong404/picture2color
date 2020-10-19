/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:27:03
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-19 18:05:12
 * @Description: 色值分析
 */

const Color = require("./Color");


const defaultOptionColorAnalyse = {
    colorStep: 100 // 色值容差-值越大颜色相似度越小
}
class ColorAnalyse {
    constructor(colorData, option = {}) {
        this.option = Object.assign({}, defaultOptionColorAnalyse, option)
        this.originData = colorData;
        let {width, height} = colorData;
        this.width = width
        this.height = height
        this.colorMap = this.analyse(colorData);
    }
    /**
     * 颜色数据分析
     * @param {*} data
     */
    analyse(data) {
        let {width, height, data: arr} = data;
        arr = this.colorFormat(arr, width, height);
        return this.colorPercent(arr, width, height)
    }/**
     *  格式化颜色数据
     * @param {*} arr
     */
    colorFormat(arr, width, height) {
        return Array.prototype.slice.call(arr).reduce((item1, item2, index) => {
            let result = item1
            if (index === 1) {
                result = {
                    stack: [item1],
                    list: []
                }
            }
            if (index % 4 === 3) {
                index = (index - 3) / 4
                result.list.push({
                    data: [...result.stack, item2],
                    position: [index % width, Math.floor(index / width)]
                })
                result.stack = []
            } else {
                result.stack.push(item2)
            }
            return result
        }).list
    }
    /**
     * 每个色值的占比
     * @param {*} arr
     * @param {*} width
     * @param {*} height
     */
    colorPercent(arr, width, height) {
        let temp = {}
        let _color = null;
        arr.forEach(item => {
            let color = Color.data2color(item.data);
            if (temp[color]) {
                temp[color].count()
            } else {
                // _color = new Color(item.data);
                _color = _color ? _color.groupFactory(item.data) : new Color(item.data);
                temp[color] = _color
                temp[color].setPosition(...item.position)
            }
        })
        return Object.values(temp)
    }
    /**
     * 获取图片主要色值
     * @{data} Array
     */
    getMainColor(data) {
        data = data || this.colorMap.color
        let map = new Map();
        let _color = null;
        data.forEach(item => {
            let hasNoColor = true;
            map.forEach((value, key) => {
                if (Picture2color.isSimilarColor(value, item, this.option.colorStep)) {
                    hasNoColor = false
                    value.count(item.__count)
                }
            })
            if (hasNoColor) {
                _color = _color ? Color.clone(item, _color.__gid) : Color.clone(item)
                map.set(item.value, _color)
            }
        })
        return map
    }
    getBorderColor(colorAnalyse, size = 0.2) {
        let {width, height, colorMap: data} = colorAnalyse || this;
        let _data = data.filter(item => {
            return item.__x >= width * (1 - size) || item.__x <= width * size || item.__y >= height * (1 - size) || item.__y <= height * size
        })
        return this.getMainColor(_data)
    }
    /**
     * 销毁
     */
    destory() {
        this.option = null;
        this.originData = null;
        this.colorMap = null;
        this.mainColor = null;
        this.width = null;
        this.height = null;
    }
}

module.exports = ColorAnalyse