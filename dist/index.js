!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("Picture2color",[],e):"object"==typeof exports?exports.Picture2color=e():t.Picture2color=e()}(this,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e){t.exports={isSimilarColor(t,e,r=10){let[n,o,i,s]=t instanceof Array?t:t.data,[a,l,c,u]=e instanceof Array?e:e.data;return Math.sqrt(Math.pow(n-a,2)+Math.pow(o-l,2)+Math.pow(i-c,2))<r},isDeep(t,e=100){let[r,n,o,i]=t.data;return.299*r+.587*n+.114*o<e},getUniqueId:(t=10)=>Number(Math.random().toString().split(".")[1].substring(0,t)).toString(32),data2color(t,e=0){const r=0,n=1;try{let o;switch(e){case r:{let[e,r,n,i]=t||[];o=`rgba(${e},${r},${n},${i/255})`;break}case n:{let[e,r,n,i]=t||[];i/=255,e*=i,r*=i,n*=i,o=`#${e.toString(16)}${r.toString(16)}${n.toString(16)}`;break}}return o}catch(t){return""}},color2data(t){try{if(/^rgba?\(.+\)/i.test(t)){let e=t.match(/([\d.]+)/g);if(!e||e.length<3)throw Error("请传入正确的值");return 3===e.length&&e.push(255),console.log(111),e.slice(0,4).map(t=>Number(t))}{let e=t.match(/^#(\w+)/);if(e=e?e[1]:"",!e)throw Error("请传入正确的值");if(3===e.length)return[parseInt("0x"+e[0].repeat(2)),parseInt("0x"+e[1].repeat(2)),parseInt("0x"+e[2].repeat(2)),255];if(e.length>=6)return e=e.substring(0,6),[parseInt("0x"+e.substring(0,2)),parseInt("0x"+e.substring(2,4)),parseInt("0x"+e.substring(4,6)),255];if(!e)throw Error("请传入正确的值")}}catch(t){console.warn("请传入正确的色值")}}}},function(t,e,r){const n=r(0),o={deepStep:120},i=new Map;class s{constructor(t,e={},r=null){this.option=Object.assign({},o,e),this.data=t,this.value=n.data2color(t);let s=null;if(r){if(s=i.get(r),!s)throw Error("未找到group");s.gmap.add(this)}this.__gid=r,this.__group=s,this.__count=1,this.__total=1,this.__contacts=[]}contact(...t){t.forEach(t=>{0===t.__contacts.length&&(this.__contacts.push(t),t.__contacts=this.__contacts)})}isContact(t){if("string"==typeof t)return this.value===t||this.__contacts.some(e=>e.value===t);if(t instanceof s)return t.value===this.value||this.__contacts.some(e=>e.value===t.value);{if(t===this.data)return!0;let e=n.data2color(t);return this.value===e||this.__contacts.some(t=>t.value===e)}}count(t=1){this.__group&&(this.__group.count+=t),this.__count+=t}groupFactory(t,e){if(!this.__gid){this.__gid=n.getUniqueId();let t={gmap:new Set,count:this.__count};i.set(this.__gid,t),t.gmap.add(this),this.__group=t}return t instanceof s?new s(t.data,e||t.option,this.__gid):new s(t,e,this.__gid)}get isRange(){return this.__contacts.length>0}get contacts(){return[this,...this.__contacts]}get percent(){return this.__count/(this.__group?this.__group.count:this.__count)*100}get isDeep(){return n.isDeep(this,this.option.deepStep)}toColorString(t=0){return n.data2color(this.data,t)}static clone(t,e,r){let n=new s(t.data,t.option,r);return e&&(n.setPosition(...t.position),n.count(t.__count-1)),n}}t.exports=s},function(t,e,r){const n=r(3);t.exports=n},function(t,e,r){const n=r(4),o=r(5),i=r(1),s=r(0),a={event:["click"],colorStep:100,deepStep:120};class l extends n{constructor(t,e){if(super(),this.originColorData=null,this.colorData=null,this.option=Object.assign({},a,e||{}),this.__el=null,this.__cache={},this.utils=s,!(t instanceof Image)){if("string"==typeof t)return new Promise((e,r)=>{let n=t;t=new Image,this.__el=t||null,t.onload=()=>{this.init(t),e(this)},t.onerror=function(){console.warn("图片加载失败"),r()},t.src=n});throw Error("请传入合法参数")}if(this.__el=t||null,!t.complete)throw Error("图片尚未加载完成");this.init(t)}init(t){this.getImageColor=l.getImageColor,this.getColorData(t),this.destory=l.destory,this.option.event&&this.bindEvent(this.option.event)}bindEvent(t=[]){let e=this,{width:r,height:n}=this.originColorData,o=t.map(t=>{let o=function(o){let i=e.__el.offsetWidth,s=e.__el.offsetHeight,a=Number.parseInt((o.x-e.__el.offsetLeft)/i*r),l=Number.parseInt((o.y-e.__el.offsetTop)/s*n),c=e.getImageColor(a,l,e.__el);e.emit("color",{type:t,eventPosition:[o.x,o.y],color:c})};return this.__el.addEventListener(t,o),{type:t,callback:o}});this.__cache.event=o}unbindEvent(){let t=this;this.__cache.event&&this.__cache.event.forEach(({type:e,callback:r})=>{t.__el.removeEventListener(e,r)})}getColorData(t){let e=document.createElement("canvas"),{width:r,height:n}=t;e.width=r,e.height=n;let i=e.getContext("2d");i.drawImage(t,0,0);let s=i.getImageData(0,0,r,n);this.originColorData=s;let{colorStep:a,deepStep:l}=this.option;this.colorData=new o(s,{colorStep:a,deepStep:l})}colorFilter_bate(t){let{translateData:e,colorMap:r}=this.colorData;if(t instanceof i)return t.isRange?e.data.filter(e=>t.isContact(e.color)):e.data.filter(e=>e.color.value===t.value);if(4===t.length){let r=t.toString();return e.data.filter(e=>e.data===t||e.data.toString()===r)}return e.data.filter(e=>s.data2color(e.data)===t)}getMainColor(t){return this.colorData.getMainColor(t)}getBorderColor(t){return this.colorData.getBorderColor(t)}static isDeep(t,e){return t instanceof i?e?s.isDeep(t,e):t.isDeep:t.reduce((t,r)=>t+((e?s.isDeep(r,e):r.isDeep)?r.percent:0),0)>50}static destory(t){(t=t||this).unbindEvent(),Object.keys(t.__cache).forEach(e=>{delete t.__cache[e]}),t.__cache=null,t.originColorData=null,t.option=null,t.__el=null,t.off(".inner"),t.colorData&&t.colorData.destory(),t.colorData=null}static getImageColor(t=0,e=0,r,n=!0){try{let o=this instanceof l?this:null,{width:s,height:a}=o&&this.__el||r,c=o&&this.__cache.canvas||document.createElement("canvas");o&&(this.__cache.canvas=c),c.width=s,c.height=a;let u=c.getContext("2d");u.drawImage(r,0,0,s,a,0,0,s,a),n||(t=Math.round(t*s*.01),e=Math.round(e*a*.01));let h=u.getImageData(t,e,1,1);return new i(h.data)}catch(t){return console.warn("获取数据失败"),{}}}static isSimilarColor(t,e){return s.isSimilarColor(...arguments)}}l.Color=i,t.exports=l},function(t,e,r){"use strict";var n,o="object"==typeof Reflect?Reflect:null,i=o&&"function"==typeof o.apply?o.apply:function(t,e,r){return Function.prototype.apply.call(t,e,r)};n=o&&"function"==typeof o.ownKeys?o.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var s=Number.isNaN||function(t){return t!=t};function a(){a.init.call(this)}t.exports=a,t.exports.once=function(t,e){return new Promise((function(r,n){function o(){void 0!==i&&t.removeListener("error",i),r([].slice.call(arguments))}var i;"error"!==e&&(i=function(r){t.removeListener(e,o),n(r)},t.once("error",i)),t.once(e,o)}))},a.EventEmitter=a,a.prototype._events=void 0,a.prototype._eventsCount=0,a.prototype._maxListeners=void 0;var l=10;function c(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function u(t){return void 0===t._maxListeners?a.defaultMaxListeners:t._maxListeners}function h(t,e,r,n){var o,i,s,a;if(c(r),void 0===(i=t._events)?(i=t._events=Object.create(null),t._eventsCount=0):(void 0!==i.newListener&&(t.emit("newListener",e,r.listener?r.listener:r),i=t._events),s=i[e]),void 0===s)s=i[e]=r,++t._eventsCount;else if("function"==typeof s?s=i[e]=n?[r,s]:[s,r]:n?s.unshift(r):s.push(r),(o=u(t))>0&&s.length>o&&!s.warned){s.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=s.length,a=l,console&&console.warn&&console.warn(a)}return t}function p(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function f(t,e,r){var n={fired:!1,wrapFn:void 0,target:t,type:e,listener:r},o=p.bind(n);return o.listener=r,n.wrapFn=o,o}function d(t,e,r){var n=t._events;if(void 0===n)return[];var o=n[e];return void 0===o?[]:"function"==typeof o?r?[o.listener||o]:[o]:r?function(t){for(var e=new Array(t.length),r=0;r<e.length;++r)e[r]=t[r].listener||t[r];return e}(o):_(o,o.length)}function g(t){var e=this._events;if(void 0!==e){var r=e[t];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function _(t,e){for(var r=new Array(e),n=0;n<e;++n)r[n]=t[n];return r}Object.defineProperty(a,"defaultMaxListeners",{enumerable:!0,get:function(){return l},set:function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");l=t}}),a.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},a.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},a.prototype.getMaxListeners=function(){return u(this)},a.prototype.emit=function(t){for(var e=[],r=1;r<arguments.length;r++)e.push(arguments[r]);var n="error"===t,o=this._events;if(void 0!==o)n=n&&void 0===o.error;else if(!n)return!1;if(n){var s;if(e.length>0&&(s=e[0]),s instanceof Error)throw s;var a=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw a.context=s,a}var l=o[t];if(void 0===l)return!1;if("function"==typeof l)i(l,this,e);else{var c=l.length,u=_(l,c);for(r=0;r<c;++r)i(u[r],this,e)}return!0},a.prototype.addListener=function(t,e){return h(this,t,e,!1)},a.prototype.on=a.prototype.addListener,a.prototype.prependListener=function(t,e){return h(this,t,e,!0)},a.prototype.once=function(t,e){return c(e),this.on(t,f(this,t,e)),this},a.prototype.prependOnceListener=function(t,e){return c(e),this.prependListener(t,f(this,t,e)),this},a.prototype.removeListener=function(t,e){var r,n,o,i,s;if(c(e),void 0===(n=this._events))return this;if(void 0===(r=n[t]))return this;if(r===e||r.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete n[t],n.removeListener&&this.emit("removeListener",t,r.listener||e));else if("function"!=typeof r){for(o=-1,i=r.length-1;i>=0;i--)if(r[i]===e||r[i].listener===e){s=r[i].listener,o=i;break}if(o<0)return this;0===o?r.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(r,o),1===r.length&&(n[t]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",t,s||e)}return this},a.prototype.off=a.prototype.removeListener,a.prototype.removeAllListeners=function(t){var e,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[t]),this;if(0===arguments.length){var o,i=Object.keys(r);for(n=0;n<i.length;++n)"removeListener"!==(o=i[n])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=r[t]))this.removeListener(t,e);else if(void 0!==e)for(n=e.length-1;n>=0;n--)this.removeListener(t,e[n]);return this},a.prototype.listeners=function(t){return d(this,t,!0)},a.prototype.rawListeners=function(t){return d(this,t,!1)},a.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):g.call(t,e)},a.prototype.listenerCount=g,a.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]}},function(t,e,r){const n=r(1),o=r(0),i={colorStep:100};t.exports=class{constructor(t,e={}){this.option=Object.assign({},i,e),this.originData=t;let{width:r,height:n}=t;this.width=r,this.height=n;let{colorMap:o,translateData:s}=this.analyse(t);this.colorMap=o,this.translateData=s}analyse(t){let{width:e,height:r,data:n}=t;return{translateData:{width:e,height:r,data:t=this.colorFormat(n,e,r)},colorMap:this.colorPercent(t)}}colorFormat(t,e,r){let n=[],i=0;for(t=Array.from(t);4*i<=t.length-4;){let r=t.slice(4*i,4*(i+1));n.push({color:o.data2color(r),data:r,position:[i%e,Math.floor(i/e)]}),i++}return n}colorPercent(t){let e={},r=null,{deepStep:i}=this.option;return t.forEach(t=>{let s=o.data2color(t.data);e[s]?e[s].count():(r=r?r.groupFactory(t.data):new n(t.data,{deepStep:i}),e[s]=r)}),Object.values(e).sort((t,e)=>e.__count-t.__count)}getMainColor(t={},e){e=e||this.colorMap;let{colorStep:r}=Object.assign({},this.option,t),o=new Set,i=null;return e.forEach(t=>{let e=!0;o.forEach((n,o)=>{Picture2color.isSimilarColor(n,t,r)&&(e=!1,n.count(),n.contact(t))}),e&&(i=i?i.groupFactory(t):n.clone(t),o.add(i))}),Array.from(o).sort((t,e)=>e.__count-t.__count)}getBorderColor(t={},e){let{width:r,height:n,translateData:o}=e||this,{size:i=.2,colorStep:s}=Object.assign({},this.option,t),a=i*r,l=(1-i)*r,c=i*n,u=(1-i)*n,h=o.data.filter(t=>(t.position[0]<=a||t.position[0]>=l)&&(t.position[1]>=u||t.position[1]<=c));return h=this.colorPercent(h),this.getMainColor({colorStep:s},h)}destory(){this.option=null,this.originData=null,this.colorMap=null,this.mainColor=null,this.width=null,this.height=null}}}])}));