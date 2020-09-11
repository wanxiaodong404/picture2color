/*
 * @Author: wanxiaodong
 * @Date: 2020-05-12 17:35:04
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-09-11 17:57:21
 * @Description:
 */

const events = require('events')

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
        // this.colorAnalyse(data)
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
            color.setTotal(width * height)
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
    static isSimilarColor(color1, color2, step = 10) {
        let [r1, g1, b1, a1] = color1.data
        let [r2, g2, b2, a2] = color2.data
        // console.log(Math.sqrt(Math.pow((r1 - r2), 2) + Math.pow((g1 - g2), 2) + Math.pow((b1 - b2), 2)))
        return Math.sqrt(Math.pow((r1 - r2), 2) + Math.pow((g1 - g2), 2) + Math.pow((b1 - b2), 2)) < step
    }
    /**
     *  是否属于深色
     * @param {Color} color
     * @param {number} step
     */
    static isDeep(color, step = 100) {
        let [r, g, b, a] = color.data
        return r * 0.299 + g * 0.587 + b * 0.114 < step
    }
}



const defaultOptionColorAnalyse = {
    colorStep: 120
}
class ColorAnalyse {
    constructor(colorData, option = {}) {
        this.option = Object.assign({}, defaultOptionColorAnalyse, option)
        this.originData = colorData;
        this.colorMap = null;
        this.analyse(colorData);
        this.mainColor = this.getMainColor(this.colorMap.color);

    }
    /**
     * 颜色数据分析
     * @param {*} data
     */
    analyse(data) {
        let {width, height, data: arr} = data;
        let _data = {
            color: [],
            width,
            height
        };
        arr = this.colorFormat(arr, width, height);
        _data.color = this.colorPercent(arr, width, height)
        this.colorMap = _data
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
        arr.forEach(item => {
            let color = Color.data2color(item.data);
            if (temp[color]) {
                temp[color].count()
            } else {
                temp[color] = new Color(item.data)
                temp[color].setTotal(width * height)
                temp[color].setPosition(...item.position)
            }
        })
        return Object.keys(temp).map(item => temp[item]).sort((color1, color2) => {
            return color2.percent - color1.percent
        })
    }
    /**
     * 获取图片主要色值
     * @{data} Array
     */
    getMainColor(data) {
        let map = new Map();
        data.forEach(item => {
            let hasNoColor = true;
            map.forEach((value, key) => {
                if (Picture2color.isSimilarColor(value, item, this.option.colorStep)) {
                    hasNoColor = false
                    value.count(item.__count)
                }
            })
            if (hasNoColor) {
                map.set(item.value, item)
            }
        })
        return map
    }
    /**
     * 销毁
     */
    destory() {
        this.option = null;
        this.originData = null;
        this.colorMap = null;
        this.mainColor = null;
    }
}

const defaultOptionColor = {
    deepStep: 120
}
class Color {
    constructor(data, option = {}) {
        this.option = Object.assign({}, defaultOptionColor, option)
        this.data = data;
        this.value = Color.data2color(data);
        this.__count = 1;
        this.__total = 1;
        this.__x = 0;
        this.__y = 0;
    }
    count(num) {
        typeof num === 'number' ? this.__count += num : this.__count++
    }
    setTotal(total) {
        this.__total = total
    }
    setPosition(x = 0, y = 0) {
        this.__x = x
        this.__y = y
    }
    get percent() {
        return this.__count / this.__total * 100
    }
    get isDeep() {
        return Picture2color.isDeep(this, this.option.deepStep)
    }
    get position() {
        return [this.__x, this.__y]
    }
    /**
     * color数据转rgba
     * @param {*} data
     */
    static data2color(data, type = 0) {
        const typeMap = {
            rgba: 0,
            hex: 1
        }
        try {
            let color;
            switch (type) {
                case typeMap.rgba: {
                    let [r, g, b, a] = data || [];
                    color = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                    break
                }
                case typeMap.hex: {
                    let [r, g, b, a] = data || [];
                    a = a / 255
                    r = r * a
                    g = g * a
                    b = b * a
                    color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
                    break
                }
            }
            return color;
        } catch (e) {
            return ''
        }
    }

}
module.exports = Picture2color