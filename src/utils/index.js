/*
 * @Author: wanxiaodong
 * @Date: 2020-10-19 16:38:20
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-10-19 17:19:01
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
        let [r1, g1, b1, a1] = color1.data
        let [r2, g2, b2, a2] = color2.data
        // console.log(Math.sqrt(Math.pow((r1 - r2), 2) + Math.pow((g1 - g2), 2) + Math.pow((b1 - b2), 2)))
        return Math.sqrt(Math.pow((r1 - r2), 2) + Math.pow((g1 - g2), 2) + Math.pow((b1 - b2), 2)) < step
    },
    /**
     *  是否属于深色
     * @param {Color} color
     * @param {number} colorStep
     */
    isDeep(color, colorStep = 100) {
        let [r, g, b, a] = color.data
        return r * 0.299 + g * 0.587 + b * 0.114 < colorStep
    },
    /**
     * 生成唯一id
     */
    getUniqueId(len = 10) {
        return Number(Math.random().toString().split('.')[1].substring(0, len)).toString(32)
    }
 }