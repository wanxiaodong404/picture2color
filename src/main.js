/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:36:09
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-19 16:55:58
 * @Description:
 */
const events = require('events')
const ColorAnalyse = require('./Analyse')
const Color = require('./Color')
const utils = require('./utils')
const defaultOption = {
    event: ['click'] // 绑定事件获取颜色信息 然后通过emit=>color向外反馈
}
class Picture2color extends events {
    constructor(image, option, showBlock) {
        super();
        this.originColorData = null
        this.colorData = null;
        this.option = Object.assign({}, defaultOption, (option || {}));
        this.__eventCach = [];
        this.__showBlock = null;
        this.__el = null;
        if (showBlock) {
            if (typeof showBlock === 'string') {
                this.__showBlock = (document.querySelectorAll(showBlock) || [])[0]
            } else {
                this.__showBlock = showBlock
            }
        }
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
            console.warn('请传入合法参数')
            return null
        }
    }
    init(image) {
        this.getColorData(image)
        this.getImageColor = Picture2color.getImageColor;
        this.destory = Picture2color.destory;
        this.option.event && this.bindEvent(this.option.event);
    }
    /**
     * 绑定事件
     * @{Array} 事件类型
     */
    bindEvent(eventType = []) {
        let that = this;
        this.__eventCach = eventType.map((type) => {
            let callback = function(event) {
                let color = Picture2color.getImageColor(that.__el, event.x - this.offsetLeft, event.y - this.offsetTop)
                that.emit('color.inner', {
                    type,
                    position: `${event.x - this.offsetLeft} ${event.y - this.offsetTop}`,
                    data: color
                })
                if (that.__showBlock) {
                    that.__showBlock.style.background = color.value
                }
            };
            this.__el.addEventListener(type, callback)
            return {
                type,
                callback
            }
        })
    }
    /**
     * 解绑事件
     */
    unbindEvent() {
        let that = this;
        this.__eventCach.forEach(({type, callback}) => {
            that.__el.removeEventListener(type, callback)
        })
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
        this.colorData = new ColorAnalyse(data);
    }
    /**
     * 销毁实例
     * @param {*} instance
     */
    static destory(instance) {
        instance = instance || this
        instance.unbindEvent()
        instance.__eventCach = null;
        instance.__showBlock = null;
        instance.originColorData = null;
        instance.option = null;
        instance.__el = null;
        instance.off('.inner');
        instance.colorData && instance.colorData.destory();
        instance.colorData = null;
    }
    /**
     * 获取图片坐标内色值
     * @param {*} image
     * @param {*} x
     * @param {*} y
     * @param {*} isPiex
     */
    static getImageColor(image, x = 0, y = 0, isPiex = true) {
        try {
            let {width, height} = image;
            let canvas = document.createElement('canvas');
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
            if (!isPiex) {
                x = Math.round(x * width * 0.01);
                y = Math.round(y * height * 0.01);
            }
            let data = ctx.getImageData(x, y, 1, 1);
            let color = new Color(data.data)
            color.setPosition(x, y)
            return color
        } catch (e) {
            console.warn('获取数据失败')
            return {}
        }
    }
    /**
     * 颜色是否相似
     * @param {Color} color1
     * @param {Color} color2
     * @param {number} step
     */
    static isSimilarColor() {
        return utils.isSimilarColor(...arguments)
    }
    /**
     *  是否属于深色
     * @param {Color} color
     * @param {number} colorStep
     */
    static isDeep(color, colorStep = 100) {
        return utils.isDeep(...arguments)
    }
}

module.exports = Picture2color