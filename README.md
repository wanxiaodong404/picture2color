# [picture2color](./)

[![npm version][npm-version-img]][npm-url]
[![npm download][npm-download-img]][npm-download]
[![MIT License][license-image]][license-url]
[![issues-img]][issues]
[![pr-img]][pr]

## 简介
主要是解决前端在图片颜色识别上的问题，有问题可以联系
[我][e-mail]或者提[issues][issues]

1、能够分析图片的主要颜色

2、按图片边框由外到内0-0.5占比的主要颜色

3、获取图片对应坐标颜色的识别

4、判定单个或者多个颜色深浅判定

5、对比两个颜色是否在参数程度范围内是否相似

![img][demo-img]

## Demo

[链接][demo]

## install
``` bash
    npm install picture2color
```

## import

```javascript
    import Picture2color from 'Picture2color'
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
4、点击事件绑定后反馈事件
```javascript
    let demo = new Picture2color(image, {event: ['click']});
    demo.on('color', e => {console.log(e)}) // {type: 'click', color: color}
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
    let colorInstance = new Picture2color.Color(data, option)
```
2、实例化API

```javascript
    colorInstance.isDeep // Boolean
    colorInstance.percent // Number 如果是按组生成的颜色可查看百分比
    colorInstance.groupFactory // Function 按组生成实例化颜色对象 （@data: [rgba] @option: {deepStep}）
```

[demo-img]: ./assets/color.png
[demo]: https://sheldonwan.github.io/picture2color/examples/

[npm-version-img]: https://img.shields.io/npm/v/picture2color
[npm-url]: https://www.npmjs.com/package/picture2color

[npm-download-img]: https://img.shields.io/npm/dw/picture2color.svg?style=flat
[npm-download]: https://npmcharts.com/compare/picture2color?minimal=true

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[e-mail]: mailto://729779978@qq.com

[issues-img]: https://img.shields.io/bitbucket/issues-raw/sheldonWan/picture2color
[issues]: https://github.com/sheldonWan/picture2color/issues

[pr-img]: https://img.shields.io/bitbucket/pr-raw/sheldonWan/picture2color
[pr]: https://github.com/sheldonWan/picture2color/pr