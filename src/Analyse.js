/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:27:03
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-11-26 17:32:56
 * @Description: 色值分析
 */

const Color = require("./Color");
const ColorGroup = require("./ColorGroup");
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
            colorMap: this.createColorGroup(data)
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
            let position = [index % width, Math.floor(index / width)]
            list.push({
                colorName: utils.data2color(_data),
                data: _data,
                position
            })
            index++
        }
        return list
    }
    /**
     * 创建一个颜色组
     * @param {*} data
     */
    createColorGroup(data) {
        let {deepStep} = this.option
        let group = new ColorGroup();
        data.forEach(item => {
            group.concat(item.data, {deepStep})
        })
        return group
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
        data.sortList.forEach(item => {
            let hasNoColor = true;
            map.forEach((value, key) => {
                if (Picture2color.isSimilarColor(value.proxy, item, colorStep)) {
                    hasNoColor = false
                    value.concat(item)
                }
            })
            if (hasNoColor) {
                map.add(new ColorGroup(item))
            }
        })
        let _group = new ColorGroup();
        map.forEach(function(group) {
            _group.concat(group)
        })
        return _group
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
        _data = this.createColorGroup(_data)
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