/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:27:03
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-22 16:22:52
 * @Description: 色值分析
 */

const Color = require("./Color");
const utils = require("./utils");


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
        let {colorMap, translateData} = this.analyse(colorData);
        this.colorMap = colorMap;
        this.translateData = translateData;
    }
    /**
     * 颜色数据分析
     * @param {*} data
     */
    analyse(data) {
        let {width, height, data: _data} = data;
        data = this.colorFormat(_data, width, height);
        return {
            translateData: {width, height, data},
            colorMap: this.colorPercent(data)
        }
    }/**
     *  格式化颜色数据
     * @param {*} data
     */
    colorFormat(data, width, height) {
        let list = [],
        index = 0;
        data = Array.from(data)
        while (index * 4 <= data.length - 4) {
            let _data = data.slice(index * 4, (index + 1) * 4);
            list.push({
                color: utils.data2color(_data),
                data: _data,
                position: [index % width, Math.floor(index / width)]
            })
            index++
        }
        return list
    }
    /**
     * 每个色值的占比
     * @param {*} data
     */
    colorPercent(data) {
        let temp = {}
        let _color = null;
        let {deepStep} = this.option
        data.forEach(item => {
            let color = utils.data2color(item.data);
            if (temp[color]) {
                temp[color].count();
            } else {
                // _color = new Color(item.data);
                _color = _color ? _color.groupFactory(item.data) : new Color(item.data, {deepStep});
                temp[color] = _color
            }
        })
        return Object.values(temp).sort((color, color2) => color2.__count - color.__count)
    }
    /**
     * 获取图片主要色值
     * @{colorStep} Number
     * @{data} Array
     */
    getMainColor(option = {}, data) {
        data = data || this.colorMap
        let {colorStep} = Object.assign({}, this.option, option);
        let map = new Set();
        let _color = null;
        data.forEach(item => {
            let hasNoColor = true;
            map.forEach((value, key) => {
                if (Picture2color.isSimilarColor(value, item, colorStep)) {
                    hasNoColor = false
                    value.count()
                    value.contact(item)
                }
            })
            if (hasNoColor) {
                _color = _color ? _color.groupFactory(item) : Color.clone(item)
                map.add(_color)
            }
        })
        return Array.from(map).sort((color, color2) => color2.__count - color.__count)
    }
    /**
     * 以边框向内方向获取范围主要色值
     * @param {*} option
     * @param {*} colorAnalyse
     */
    getBorderColor(option = {}, colorAnalyse) {
        let {width, height, translateData} = colorAnalyse || this;
        let {size = 0.2, colorStep} = Object.assign({}, this.option, option)
        let leftX = size * width,
            rightX = (1 - size) * width,
            topY = size * height,
            bottomY = (1 - size) * height;
        let _data = translateData.data.filter(item => {
            return (item.position[0] <= leftX || item.position[0] >= rightX) && (item.position[1] >= bottomY || item.position[1] <=topY)
        });
        _data = this.colorPercent(_data)
        return this.getMainColor({colorStep}, _data)
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