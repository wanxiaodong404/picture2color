/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:38:20
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-09-08 18:47:17
 * @Description:
 */

const types = require('../types')
const paramsFilter = require('./paramsFilter')
const Color = require('../lib/Color')

module.exports = {
      /**
     * 颜色是否相似
     * @param {Color} color1
     * @param {Color} color2
     * @param {number} step
     */
    isSimilarColor(color1, color2, step = 10) {
        color1 = typeof color1 === 'string' ? dataInputFormat(color1) : color1;
        color2 = typeof color2 === 'string' ? dataInputFormat(color2) : color2;
        let [r1, g1, b1, a1] = Array.isArray(color1) ? color1 : color1.data
        let [r2, g2, b2, a2] = Array.isArray(color2) ? color2 : color2.data
        a1 = a1 / 255;
        a2 = a2 / 255
        return Math.sqrt(Math.pow((r1 * a1 - r2 * a2), 2) + Math.pow((g1 * a1 - g2 * a2), 2) + Math.pow((b1 * a1 - b2 * a2), 2)) < step
    },
    /**
     *  是否属于深色
     * @param {Color} color
     * @param {number} deepStep 0-255
     */
    isDeep(color, deepStep = 192) {
        color = typeof color === 'string' ? dataInputFormat(color) : color;
        let [r, g, b, a] = color.data
        a = a / 255
        return r * a * 0.299 + g * a * 0.587 + b * a * 0.114 < deepStep
    },
    /**
     * 生成唯一id
     */
    getUniqueId(len = 10) {
        return Number(Math.random().toString().split('.')[1].substring(0, len)).toString(32)
    },
    /**
     * color数据转rgba
     * @param {*} data
     */
    data2color(data, type = types.RGBACOLOR) {
        try {
            let color;
            switch (type) {
                case types.HEXCOLOR: {
                    let [r, g, b, a] = data || [];
                    a = a / 255
                    r = (r * a).toString(16);
                    g = (g * a).toString(16);
                    b = (b * a).toString(16);
                    r = r.length > 1 ? r : `0${r}`;
                    g = g.length > 1 ? g : `0${g}`;
                    b = b.length > 1 ? b : `0${b}`;
                    let str = ['#', r, g, b]
                    color = str.join('');
                    break
                }
                default: {
                    // types.RGBACOLOR
                    let [r, g, b, a] = data || [];
                    color = `rgba(${r},${g},${b},${a / 255})`;
                    break
                }
            }
            return color;
        } catch (e) {
            return ''
        }
    },
    /**
     * 通过色值转rgba数组
     * @param {*} color
     */
    color2data: color2data,

    index2position(index, width = 1) {
        return [index % width, Math.ceil(index / width)]
    },

    paramsFilter
 }



 /**
     * 颜色输入格式化
     */
function dataInputFormat(color) {
    if (typeof color === 'object') {
        return color
    } else {
        return color2data(color);
    }
}

/**
 * 字符串转color data
 * @param {*} color
 * @returns
 */
function color2data(color) {
    try {
        if (/^rgba?\(.+\)/i.test(color)) {
            let data = color.match(/([\d.]+)/g);
            if (!data || data.length < 3) throw Error('请传入正确的值')
            if (data.length === 3) data.push('1');
            let opacity = data.pop();
            data.push(opacity * 255);
            return data.slice(0, 4).map(item => Number(item));
        } else if (/^#(\w+)/ig) {
            let data = color.match(/^#(\w+)/);
            data = data ? data[1] : '';
            if (!data) throw Error('请传入正确的值');
            if (data.length === 3) {
                return [parseInt(`0x${data[0].repeat(2)}`), parseInt(`0x${data[1].repeat(2)}`), parseInt(`0x${data[2].repeat(2)}`), 255]
            } else if (data.length >= 6) {
                data = data.substring(0, 6)
                return [parseInt(`0x${data.substring(0, 2)}`), parseInt(`0x${data.substring(2, 4)}`), parseInt(`0x${data.substring(4, 6)}`), 255]
            } else {
                if (!data) throw Error('请传入正确的值')
            }
        }
    } catch (e) {
        console.warn('请传入正确的色值')
    }
}