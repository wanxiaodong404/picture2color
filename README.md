# [picture2color](./)

[![npm version][npm-version-img]][npm-url]
[![npm download][npm-download-img]][npm-download]
[![MIT License][license-image]][license-url]

## install
``` bash
    npm install picture2color
```

## import

```javascript
    import Picture2color from Picture2color
```

## static API

1、是否是深色
```javascript
     /**
     * pa
     * @param {Color || ColorList} colorList
     * @return Boolean
     */
    static isDeep(colorList, deepStep)
```
2、获取坐标位置传入图片的Color instance
```javascript
    /**
     * 获取图片坐标内色值
     * @param {*} x
     * @param {*} y
     * @param {*} image
     * @param {*} isPiex
     * @return Color
     */
    static getImageColor(x, y, image, isPiex)
```
3、判定
```javascript
    /**
     * 颜色是否在对应的范围内色值相似
     * @param {Color | [r,g,b,a]} color1
     * @param {Color | [r,g,b,a]} color2
     * @param {number 1-255} step
     */
    static isSimilarColor(color1, color2)
```
4、颜色类（传入[r,g,b,a]）实例化color对象
```javascript
    static Color
```
## 实例化

1、实例化图片
```javascript
    let demo = new Picture2color(image, options);
    demo instanceof Picture2color // true
```

2、实例化图片链接
```javascript
    new Picture2color(imageUrl, options).then(demo => {
        return demo instanceof Picture // true
    })
```
3、options
```javascript
    {
        event: ['click'], // Array 为传入图片绑定时间类型以color事件传递出当前事件坐标Color
        colorStep: 100, // 判定相似颜色程度, 值越大色值范围越大 1-255
        deepStep: 120 // 判定深浅色程度，值越大深浅灵敏度越小 1-255
    }
```

## 实例化API

1、获取当前图片主要色值（数据量大的时候计算时间会比较长）

```javascript
    /**
     * 获取图片占比主要颜色列表
     * @params{*} {colorStep: 1-255}
     */
    instance.getMainColor(option)
```
2、以边框为界限向内获取主要颜色列表（数据量大的时候计算时间会比较长）
```javascript
     /**
     * 以边框为界限向内获取0-0.5范围主要颜色列表
     * @param {*} option {size: 0-0.5}
     */
    instance.getBorderColor(option)
```

## Color

1、实例化
```javascript
    /**
     * @params {[r,g,b,a]} rgba色值数组
     * @params {*} {deepStep: 0-255} 深色值
     */
    let colorInstance = new Color(data, option)
```
2、实例化API

```javascript
    colorInstance.isDeep // Boolean
    colorInstance.percent // Number 如果是按组生成的颜色可查看百分比
    colorInstance。groupFactory // Function 按组生成实例化颜色对象 （@data: [rgba] @option: {deepStep}）
```


[npm-version-img]: https://img.shields.io/npm/v/picture2color
[npm-url]: https://www.npmjs.com/package/picture2color

[npm-download-img]: https://img.shields.io/npm/dw/picture2color.svg?style=flat
[npm-download]: https://npmcharts.com/compare/picture2color?minimal=true

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE