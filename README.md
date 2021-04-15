# [picture2color](./)

[![npm version][npm-version-img]][npm-url]
[![npm download][npm-download-img]][npm-download]
[![MIT License][license-image]][license-url]
[![issues-img]][issues]
[![pr-img]][pr]
[![size-img]][size-img]
[![file-img]][file-img]

## 简介
此模块旨在解决前端在图片颜色识别上的问题，有问题可以联系
[我][e-mail]或者提[issues][issues]

1、能够分析图片的主要颜色

2、根据坐标(像素/百分比)获取对应颜色

3、判定单个或者多个颜色深浅判定

4、对比两个颜色是否在参数程度范围内是否相似

5、获取颜色(或范围颜色)于颜色数据的占比

6、获取图片的全部颜色数据

7、按图片边框由外到内0-0.5占比的颜色数据

8、根据颜色数据创建范围颜色代理colorProxy

![img][demo-img]

## Demo

[链接][demo]

## install
``` bash
    npm install --save picture2color
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
     * @param {Color || ColorProxy} color
     * @param {Number} colorStep 值越小说明深色判定范围越小 默认192
     * @return Boolean
     */
    static isDeep(color, deepStep)
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
     * @param {Color | [r,g,b,a] | colorProxy} color1
     * @param {Color | [r,g,b,a] | colorProxy} color2
     * @param {number 1++} colorStep 值越小范围越小,默认100
     */
    static isSimilarColor(color1, color2, colorStep)
```
4、颜色类（传入[r,g,b,a]）实例化color对象
```javascript
    static Color
```
## 实例化

1、实例化模块
```javascript
    const image = new Image() || "http://url"
    const options = {
        async: false, // 是否异步化执行 传入图片为字符串链接也会默认转化为async执行
        event: ['click'], // 绑定事件获取颜色信息 然后通过emit=>color向外反馈
        deepStep: 192 // 判定深浅色程度，值越大深浅灵敏度越小  --Color
    }
    let demo = new Picture2color(image, options);
    demo instanceof Picture2color // true
    demo.on('color', () => {});
```

## 实例化API

1、获取当前图片主要色值（数据量大的时候计算时间会比较长）

```javascript
    /**
     * 获取图片占比主要颜色列表
     */
    instance.getColorGroup() // 返回ColorGroup实例
```
2、以边框为界限向内获取主要颜色列表（数据量大的时候计算时间会比较长）
```javascript
     /**
     * 以边框为界限向内获取0-0.5范围主要颜色列表
     * @param {*} option {size: 0-0.5}
     */
    instance.getFrameColorGroup() // 返回ColorGroup实例
```

## Color

1、实例化
```javascript
    /**
     * @params {[r,g,b,a]} rgba色值数组
     * @params {*} {deepStep: 0-255} 深色值 值越小说明深色判定范围越小
     */
    let colorInstance = new Picture2color.Color(data, option)
```
2、实例化API

```javascript
    colorInstance.value // rgba 色值
    colorInstance.isDeep // Boolean
    colorInstance.count // Number
    colorInstance.percent // Number 如果是按组生成的颜色可查看百分比
```
## ColorGroup

1、实例化
```javascript
    /**
     * @params {color} 参数传入color时会将color设置为group的proxy 将color属性代理到颜色组，为空时则纯作为颜色组
     * 所谓colorProxy就是将颜色差距极小的颜色归类到一组，然后取组内占比最大的的颜色属性作为代表属性，既包含colorGroup特性也包含color属性
     */
    let groupInstance = new Picture2color.ColorGroup()
```
2、实例化API

```javascript
    groupInstance.list // Array 颜色组包含的所有颜色列表
    groupInstance.sortList // Array 颜色组包含的所有颜色列表-降序排列
    groupInstance.count // Number
    groupInstance.percent // Number 如果是按组生成的颜色可查看百分比

    const option = {colorStep: 100}
    groupInstance.createColorProxy(option) // 将colorGroup生成一个新colorGrou，colorGroup内包的的是ColorProxy
    /****如果是colorProxy将额外获得Color实例的主要属性****/

```
## Count(Color和ColorGroup 都继承的类)

1、实例化
```javascript
    /**
     */
    let countInstance = new Count()
```
2、实例化API

```javascript
    countInstance.count // number 数量
    countInstance.percent // Number 百分比
```

## 未来可期

1. 同颜色坐标查找
2. 颜色范围坐标查找
3. serviceWorker解决性能问题

[demo-img]: ./assets/color.png
[demo]: https://wanxiaodong404.github.io/picture2color/examples/

[npm-version-img]: https://img.shields.io/npm/v/picture2color
[npm-url]: https://www.npmjs.com/package/picture2color

[npm-download-img]: https://img.shields.io/npm/dw/picture2color.svg?style=flat
[npm-download]: https://npmcharts.com/compare/picture2color?minimal=true

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[e-mail]: mailto://729779978@qq.com

[issues-img]: https://img.shields.io/bitbucket/issues-raw/wanxiaodong404/picture2color
[issues]: https://github.com/wanxiaodong404/picture2color/issues


[size-img]: https://img.shields.io/badge/minified%20size-16%20kB-informational
[file-img]: https://img.shields.io/badge/files-8-blue
[pr-img]: https://img.shields.io/bitbucket/pr-raw/wanxiaodong404/picture2color
[pr]: https://github.com/wanxiaodong404/picture2color/pr
