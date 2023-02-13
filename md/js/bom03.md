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
navigator.userAgent         返回浏览器的用户代理字符串   ★★★
navigator.vibrate()         触发设备振动
```

#### 2. 检测插件
![](https://fgq233.github.io/imgs/js/plugins.png)

* 检测浏览器是否安装了某个插件是开发中常见的需求，除IE10及更低版本外的浏览器，都可以通过plugins数组来确定
* 数组中的每一项都包含如下属性
   name：插件名称。
   description：插件介绍。
   filename：插件的文件名。
   length：由当前插件处理的 MIME 类型数量。
  通常，name 属性包含识别插件所需的必要信息，尽管不是特别准确。检测插件就是遍历浏览器中
  可用的插件，并逐个比较插件的名称，如下所示：

。

