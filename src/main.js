/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:36:09
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-11-26 17:55:43
 * @Description:
 */
const events = require('events')
const ColorAnalyse = require('./Analyse')
const Color = require('./Color')
const ColorGroup = require('./ColorGroup')
const utils = require('./utils')
const defaultOption = {
    event: ['click'], // 绑定事件获取颜色信息 然后通过emit=>color向外反馈
    colorStep: 100, // 判定相似颜色程度, 值越大色值范围越大
    deepStep: 192 // 判定深浅色程度，值越大深浅灵敏度越小
}
class Picture2color extends events {
    constructor(image, option) {
        super();
        this.originColorData = null
        this.colorData = null;
        this.option = Object.assign({}, defaultOption, (option || {}));
        this.__el = null;
        this.__cache = {};
        this.utils = utils
        if (image instanceof Image) {
            this.__el = image || null;
            if (image.complete) {
                this.init(image)
            } else {
                throw Error('图片尚未加载完成')
            }
        } else if (typeof image === 'string') {
            return new Promise((resolve, reject) => {
                let url = image;
                image = new Image();
                this.__el = image || null;
                image.onload = () => {
                    this.init(image);
                    resolve(this);
                }
                image.onerror = function() {
                    console.warn('图片加载失败');
                    reject();
                }
                image.src = url
            })
        } else {
            throw Error('请传入合法参数')
        }
    }
    init(image) {
        this.getImageColor = Picture2color.getImageColor;
        this.getColorData(image)
        this.destory = Picture2color.destory;
        this.option.event && this.bindEvent(this.option.event);
    }
    /**
     * 绑定事件
     * @{Array} 事件类型
     */
    bindEvent(eventType = []) {
        let that = this;
        let {width, height} = this.originColorData;
        let event = eventType.map((type) => {
            let callback = function(event) {
                var {offsetX, offsetY} = event;
                let color = that.getImageColor(offsetX, offsetY, that.__el, true)
                that.emit('color', {
                    type,
                    eventPosition: [offsetX, offsetY],
                    color: color
                })
            };
            this.__el.addEventListener(type, callback)
            return {
                type,
                callback
            }
        });
        this.__cache.event = event
    }
    /**
     * 解绑事件
     */
    unbindEvent() {
        let that = this;
        if (this.__cache.event) {
            this.__cache.event.forEach(({type, callback}) => {
                that.__el.removeEventListener(type, callback)
            })
        }
    }
    /**
     * 获取图片的颜色数据
     * @param {*} image
     */
    getColorData(image) {
        let canvas = document.createElement('canvas');
        let {width, height} = image;
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0);
        let data = ctx.getImageData(0, 0, width, height);
        this.originColorData = data;
        let {colorStep, deepStep} = this.option;
        this.colorData = new ColorAnalyse(data, {colorStep, deepStep});
    }
    /**
     * 颜色筛选  性能问题 暂时不对外开放
     * @param {Color | [rgba]} color
     */
    colorFilter_bate(color) {
        let {translateData, colorMap} = this.colorData;
        if (color instanceof Color) {
            // Color
            if (color.isRange) {
                return translateData.data.filter(item => {
                    return color.isContact(item.color)
                })
            } else {
                // let dataString = color.data.toString();
                return translateData.data.filter(item => {
                    return item.color.value === color.value
                })
            }
        } else if(color.length === 4) {
            // [rgba]
            let dataString = color.toString();
            return translateData.data.filter(item => {
                return item.data === color || item.data.toString() === dataString
            })
        } else {
            // rgba(0,0,0,1)
            return translateData.data.filter(item => {
                return utils.data2color(item.data) === color
            })
        }
    }
    /**
     * 获取图片占比主要颜色列表
     * @params{*} {colorStep: 1-255}
     */
    getMainColor(option) {
        return this.colorData.getMainColor(option);
    }
    /**
     * 以边框为界限向内获取0-0.5范围主要颜色列表
     * @param {*} option {size: 0-0.5}
     */
    getBorderColor(option) {
        return this.colorData.getBorderColor(option);
    }
    /**
     * 判断颜色或者颜色列表是否是深色
     * @param {Color || ColorList} colorList
     * @param {Number} deepStep
     */
    static isDeep(colorList, deepStep) {
        if (colorList instanceof Color) {
            return deepStep ? utils.isDeep(colorList, deepStep) : colorList.isDeep;
        }
        return colorList.reduce((percent, color) => {
            let isDeep = deepStep ? utils.isDeep(color, deepStep) : color.isDeep;
            return percent + (isDeep ? color.percent : 0)
        }, 0) > 50
    }
    /**
     * 销毁实例
     * @param {*} instance
     */
    static destory(instance) {
        instance = instance || this
        instance.unbindEvent()
        Object.keys(instance.__cache).forEach(key => {
            delete instance.__cache[key]
        })
        instance.__cache = null;
        instance.originColorData = null;
        instance.option = null;
        instance.__el = null;
        instance.off('.inner');
        instance.colorData && instance.colorData.destory();
        instance.colorData = null;
    }
    /**
     * 获取图片坐标内色值
     * @param {*} x
     * @param {*} y
     * @param {*} image
     * @param {*} isPiex
     */
    static getImageColor(x = 0, y = 0, image, isPiex = true) {
        try {
            let instance = this instanceof Picture2color ? this : null; // 实例化
            let {width, height, naturalHeight, naturalWidth} = instance ? (this.__el || image) : image;
            let canvas = instance ? (this.__cache.canvas || document.createElement('canvas')) : document.createElement('canvas');
            instance && (this.__cache.canvas = canvas);
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, naturalWidth, naturalHeight, 0, 0, width, height);
            if (!isPiex) {
                // 百分比模式
                x = Math.round(x * width * 0.01);
                y = Math.round(y * height * 0.01);
            }
            let data = ctx.getImageData(x, y, 1, 1);
            let color = new Color(data.data)
            return color
        } catch (e) {
            console.warn('获取数据失败')
            return {}
        }
    }
    /**
     * 颜色是否在对应的范围内色值相似
     * @param {Color | [r,g,b,a]} color1
     * @param {Color | [r,g,b,a]} color2
     * @param {number 1-255} step
     */
    static isSimilarColor(color1, color2) {
        return utils.isSimilarColor(...arguments)
    }
}

Picture2color.Color = Color
Picture2color.ColorGroup = ColorGroup

module.exports = Picture2color