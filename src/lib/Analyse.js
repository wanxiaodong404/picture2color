/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:27:03
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-12-14 20:01:59
 * @Description: 色值分析
 */

const Color = require("./Color");
const ColorGroup = require("./ColorGroup");
const Point = require('./Point')
const utils = require("../utils");
const types = require('../types')


const defaultOptionColorAnalyse = {}
class ColorAnalyse {
    constructor(colorData, option = {}) {
        this.option = Object.assign({}, defaultOptionColorAnalyse, option)
        this.originData = colorData;
        let {width, height} = colorData;
        this.width = width
        this.height = height
        let {colorGroup, translateData} = this.analyse(colorData);
        this.colorGroup = colorGroup;
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
            colorGroup: this.createColorGroup(data)
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
            list.push(new Point(_data, {index, width, height}))
            index++
        }
        return list
    }
    /**
     * 创建一个颜色组
     * @param {*} data
     */
    createColorGroup(data) {
        let group = new ColorGroup();
        data.forEach(item => {
            group.concat(item.data, utils.paramsFilter.group({...this.option, value: item.colorName}))
        })
        return group
    }
    /**
     * 以边框向内方向获取范围主要色值
     * @param {*} option
     * @param {*} colorAnalyse
     */
    getBorderColor(option = {}, colorAnalyse) {
        let {width, height, translateData} = colorAnalyse || this;
        let {size = 0.2} = Object.assign({}, this.option, option)
        let leftX = size * width,
            rightX = (1 - size) * width,
            topY = size * height,
            bottomY = (1 - size) * height;
        let _data = translateData.data.filter((item, index) => {
            let _x = index % width,
                _y = Math.ceil(index / width);
            return (_x <= leftX || _x >= rightX) && (_y >= bottomY || _y <= topY)
        });
        return this.createColorGroup(_data)
    }
    /**
     * 根据坐标获取颜色
     * @param {*} x
     * @param {*} y
     * @param {*} colorAnalyse
     */
    getPositionColor(x, y, colorAnalyse) {
        let {width, translateData} = colorAnalyse || this;
        let data = translateData.data[y * width + x]
        return this.colorGroup.get(data.colorName)
    }
    /**
     * 颜色筛选  性能问题 暂时不对外开放
     * @param {Color | [rgba]} color
     */
    colorFilter_bate(color) {
        let {translateData, colorGroup} = this;
        let {width, data} = translateData
        let {colorType} = this.option
        if (color instanceof Color) {
            return data.filter((item) => {
                return item.colorName === color.value
            })
        } else if(color.isGroup) {
            let list = color.__children.map(item => this.colorFilter_bate(item))
            return list.reduce((list, item) => {
                return list.concat(...item)
            }, [])
        } else if (Array.isArray(color)) {
            return data.filter((item) => {
                return item.colorName === utils.data2color(color, colorType)
            })
        } else {
            // rgba(0,0,0,1)
            return data.filter((item) => {
                return item.colorName === color
            })
        }
    }
    /**
     * 销毁
     */
    destory() {
        this.option = null;
        this.originData = null;
        this.colorGroup = null;
        this.mainColor = null;
        this.width = null;
        this.height = null;
    }
}

module.exports = ColorAnalyse