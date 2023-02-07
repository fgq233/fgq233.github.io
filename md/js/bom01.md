### window 对象
* BOM 的核心是 window 对象，表示浏览器的实例 
* window 对象在`浏览器`中有两重身份
  * ECMAScript 中的 Global 对象
  * 浏览器窗口的 JavaScript 接口

#### 1. Global 作用域
* `Global`对象是`EMCAScript`的内置对象，所有在全局作用域中定义的属性和函数，都是`Global`对象的属性
* Web浏览器都是将`Global`全局对象作为`window`对象的一部分加以实现的
* 因此，在全局作用域中声明的所有变量和函数，就都成为了`window`对象的属性了



#### 2. 窗口关系
* `top` 对象：最上层窗口，即浏览器窗口本身
* `parent` 对象：当前窗口的父窗口，如果当前窗口是最上层窗口，则 parent = top
* `self` 对象：当前窗口自身的引用

```js
var b = window.top == window.self;
console.log ("当前窗口是否是顶层窗口：" + (b ? "是": "否"));
```



#### 3. 导航与打开新窗口
`window.open()`方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口

```
window.open(url, target, features, replace)

window.open("http://www.baidu.com","_blank", "width=400,height=400");
```

* `url`：要加载的 URL
* `target`：目标窗口
  * `_self` 在当前窗口打开
  * `_parent` 在父窗口打开
  * `_top` 在顶层窗口打开
  * `_blank` 在新窗口打开(默认值)
  * `framename` 在指定name的iframe窗口中打开
* `features`：用于指定新窗口的配置，不传的话则新窗口会带有所有默认的浏览器特性
* `replace`：新窗口在浏览器历史记录中是否替代当前加载页

