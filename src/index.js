/*
 * @Author: wanxiaodong
 * @Date: 2020-05-12 17:35:04
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-05-12 18:00:37
 * @Description: 
 */
export default function fn (image, option){
    let _img = new Image();
    let pms = new Promise(function(resolve, reject) {
        _img.onload = function() {
            resolve(new picture2color(this, option))
        }
        _img.onerror = function(err) {
            reject(err)
        }
    });
    _img.src = image.src;
    return pms
}

class picture2color {
    constructor(image, option) {
        this.colorData = null;
        if (image instanceof Image) {
            this.el = image || null;
            this.option = option || null;
            this.init(image)
        } else {
            console.warn('请传入合法参数')
            return null
        }
    }
    init(image) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width
        canvas.height = image.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0);
        let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.colorData = Array.prototype.slice.call(data, data);
    }
    getImageColor(image, x, y) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width
        canvas.height = image.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0);
        x = Math.round(image.width * x * 0.01);
        y = Math.round(image.height * y * 0.01);
        let data = ctx.getImageData(x, y, 1, 1);
        ctx.fillStyle = 'red'
        ctx.clearRect(x, y, 10, 10)
        ctx.fillRect(x, y, 10, 10)
        document.querySelector('#__nuxt').appendChild(canvas)
        canvas.style.width = '100%'
        console.log(`rgba(${data.data[0]},${data.data[1]}, ${data.data[2]},${data.data[3] / 255})`)
    }
}