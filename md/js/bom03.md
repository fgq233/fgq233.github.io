### navigator、screen、history
### 一、 navigator 对象
navigator 是客户端标识浏览器的标准，与其他 BOM 对象一样，每个浏览器都支持自己的属性
#### 1. 常用属性、方法
```
navigator.appName           浏览器全名
navigator.appVersion        浏览器版本，通常与实际的浏览器版本不一致
navigator.cookieEnabled     返回布尔值，表示是否启用了 cookie
navigator.language          返回浏览器的主语言，如："zh-CN"
navigator.languages         返回浏览器偏好的语言数组
navigator.onLine            返回布尔值，表示浏览器是否联网
navigator.oscpu             返回浏览器运行设备的操作系统和（或）CPU
navigator.platform          返回浏览器运行的系统平台
navigator.plugins           返回浏览器安装的插件数组(IE中这个数组包含页面中所有<embed>元素) ★★★
navigator.userAgent         返回浏览器的用户代理字符串   ★★★ 大部分时候用这个属性来判断是什么浏览器
navigator.vibrate()         触发设备振动
```

#### 2. 检测插件
![](https://fgq233.github.io/imgs/js/plugins.png)

* 可以通过 `navigator.plugins` 检测浏览器是否安装了某个插件，除IE10及更低版本外的浏览器都支持
* 数组中的每一项都包含如下属性
  * `name`：插件名称，一般就是使用这个来判断浏览器是否包含某个插件
  * `description`：插件介绍
  * `filename`：插件的文件名
  * `length`：由当前插件处理的 MIME 类型数量
* IE10 及更低版本检测插件一般使用专有的`ActiveXObject`尝试实例化特定的插件，不报异常说明安装了该插件

```
// 插件检测（IE10及更低版本无效）
function hasPlugin(name) {
    name = name.toLowerCase();
    for (let plugin of window.navigator.plugins) {
        if (plugin.name.toLowerCase().indexOf(name) > -1) {
            return true;
        }
    }
    return false;
}

// 在旧版本 IE 中检测插件
function hasIEPlugin(name) {
    try {
        new ActiveXObject(name);
        return true;
    } catch (ex) {
        return false;
    }
}
```


### 二、 screen 对象
screen 对象在编程中很少用到，这个对象中保存的是客户端显示器的信息

```
screen.availHeight    屏幕像素高度减去系统组件高度（只读）
screen.availLeft      没有被系统组件占用的屏幕的最左侧像素（只读）
screen.availTop       没有被系统组件占用的屏幕的最顶端像素（只读）
screen.availWidth     屏幕像素宽度减去系统组件宽度（只读）
screen.colorDepth     表示屏幕颜色的位数；多数系统是 32（只读）
screen.height         屏幕像素高度
screen.left           当前屏幕左边的像素距离
screen.pixelDepth     屏幕的位深（只读）
screen.top            当前屏幕顶端的像素距离
screen.width          屏幕像素宽度
screen.orientation    返回 Screen Orientation API 中屏幕的朝向
```


### 三、 history 对象
* `history` 对象表示当前窗口首次使用以来的历史记录
* 因为 `history` 是 `window` 的属性，所以每个 `window` 都有自己的 `history` 对象
* 出于安全考虑，这个对象不会暴露用户访问过的URL，但可以使用其`API`前进、后退

#### 1. 导航
* go()方法接收一个整数参数，正值表示在历史记录中前进，负值表示在历史记录中后退
* go()有两个简写方法：back()和 forward()，模拟了浏览器的后退按钮和前进按钮

```
// 后退一页
history.go(-1);
// 前进一页
history.go(1);
// 前进两页
history.go(2);

// 后退一页
history.back();
// 前进一页
history.forward();
```

#### 2. 历史记录的数量
* `history` 对象的 `length` 属性，表示历史记录中有多个条目，反映了历史记录的数量
* 对于窗口或标签页中加载的第一个页面，`history.length` 等于 1，可以确定用户浏览器的起点是不是你的页面

```
if (history.length == 1){
  // 这是用户窗口中的第一个页面
}
```
