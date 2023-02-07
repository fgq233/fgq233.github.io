### location 对象
#### 1. 作用
* location对象提供了当前窗口中加载文档的信息，以及导航功能
* location对象既是 window 的属性，也是document的属性，`window.location = document.location`
* location 也保存着把 URL 解析为离散片段后能够通过属性访问的信息，如下

```
浏览器当前加载的URL为：https://fgq233.github.io/md/js/bom02?id=666#content

属性                   值                    
location.origin       "https://fgq233.github.io"   URL 的源地址(只读)
location.protocol     "https:"             页面使用的协议
location.host         "www.wrox.com:80"    服务器名及端口号
location.hostname     "www.wrox.com"       服务器名
location.port         "80"                 请求的端口

location.href         "https://fgq233.github.io/md/js/bom02?id=666#content"  当前加载页面的完整URL
location.pathname     "/md/js/bom02"       URL中的路径
location.search       "?id=666&age=18"     URL的查询字符串，以问号开头
location.hash         "#contents"          URL 散列值（井号后跟零或多个字符），如果没有则为空字符串
```

#### 2. 解析查询字符串
```
/**
 * 返回一个以每个查询参数为属性的对象
 */
function getQueryStringArgs() {
  let qs = (location.search.length > 0 ? location.search.substring(1) : ""), args = {};
  for (let item of qs.split("&").map(kv => kv.split("="))) {
    let name = decodeURIComponent(item[0]), value = decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  }
  return args;
}

/**
 * 根据key获取查询字符串中的值
 */
function getQueryString(key) {
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

getQueryStringArgs();   // 返回 {id: "666"}
getQueryString("id");   // 返回 "666"
```


#### 3. URLSearchParams 
* `URLSearchParams` 提供了一组标准API方法，可以检查和修改查询字符串 
* 给`URLSearchParams`构造函数传入一个查询字符串，就可以创建一个实例，这个实例上暴露了`get()、set()、delete()`等方法

```
let qs = "?id=666";
let searchParams = new URLSearchParams(qs);
console.log(searchParams.toString());     // "id=666"

searchParams.has("id"); // true
searchParams.get("id"); // "666"

searchParams.set("id", "888");
console.log(searchParams.toString());     // "id=888"

searchParams.delete("id");
console.log(searchParams.toString());     // ""
```


#### 4. 操作地址
* `assign()`  立即导航到新URL，同时在浏览器历史记录中增加一条记录
  * `window.location`
  * `location.href`
  
* `replace()`  替换当前页面重新加载（不会增加历史记录，调用之后用户不能回到前一页）

* `reload()`  重新加载当前页面
  * `location.reload()`       // 可能是从缓存加载
  * `location.reload(true)`   // 从服务器加载
  
* 除了`hash`之外，只要修改`location`的一个属性，都会导致页面重新加载新`URL`

```
//  3种方式是等价的
location.assign("https://fgq233.github.io");
window.location = "https://fgq233.github.io";
location.href = "https://fgq233.github.io";

location.replace("https://fgq233.github.io");

location.reload();

location.hash = "#section";             
location.search = "?id=888";            
location.pathname = "/md/js/bom01";     
```

