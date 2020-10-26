/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:38:20
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-26 17:38:03
 * @Description:
 */


 module.exports = {
      /**
     * 颜色是否相似
     * @param {Color} color1
     * @param {Color} color2
     * @param {number} step
     */
    isSimilarColor(color1, color2, step = 10) {
        let [r1, g1, b1, a1] = color1 instanceof Array ? color1 : color1.data
        let [r2, g2, b2, a2] = color2 instanceof Array ? color2 : color2.data
        return Math.sqrt(Math.pow((r1 - r2), 2) + Math.pow((g1 - g2), 2) + Math.pow((b1 - b2), 2)) < step
    },
    /**
     *  是否属于深色
     * @param {Color} color
     * @param {number} deepStep 0-255
     */
    isDeep(color, deepStep = 192) {
        let [r, g, b, a] = color.data
        return r * 0.299 + g * 0.587 + b * 0.114 < deepStep
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
    data2color(data, type = 0) {
        const typeMap = {
            rgba: 0,
            hex: 1
        }
        try {
            let color;
            switch (type) {
                case typeMap.rgba: {
                    let [r, g, b, a] = data || [];
                    color = `rgba(${r},${g},${b},${a / 255})`;
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
    },
    /**
     * 通过色值转rgba数组
     * @param {*} color
     */
    color2data(color) {
        try {
            if (/^rgba?\(.+\)/i.test(color)) {
                let data = color.match(/([\d.]+)/g);
                if (!data || data.length < 3) throw Error('请传入正确的值')
                if (data.length === 3) data.push(255)
                console.log(111)
                return data.slice(0, 4).map(item => Number(item))
            } else if (/^#(\w+)/ig) {
                let data = color.match(/^#(\w+)/)
                data = data ? data[1] : ''
                if (!data) throw Error('请传入正确的值')
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
 }