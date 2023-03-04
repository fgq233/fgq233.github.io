### Nginx 跨域、防盗链

### 一、跨域问题
* 使用`add_header`指令来解决，该指令可以用来添加一些头信息
* 语法 `add_header name value...`
* 位置 `http、server、location`

```
location / {
    add_header  Access-Control-Allow-Origin *;
    add_header  Access-Control-Allow-Methods GET,POST;
    root   html;
}
```

当添加了这2个请求头后，所有`非同源`请求就能访问对应服务器的资源了
* `Access-Control-Allow-Origin`  允许哪些服务器跨域请求我
* `Access-Control-Allow-Methods` 允许哪些请求方法跨域请求我




### 二、防盗链
#### 1. 概念
* 资源盗链：指资源不在自己服务器上，通过技术手段绕过别的服务器限制，将其资源放到自己页面上展示给用户
 
* 防盗链实现原理
  * 当浏览器向web服务器发送请求时，一般会带上`Referer`，来告诉浏览器该网页是从哪个页面链接过来的
  * 服务器获取到这个`Referer`，判断是否为自己信任的网站地址，是则允许访问，否则拒绝访问
  
![](https://fgq233.github.io/imgs/java/nginx3.png)

#### 2. valid_referers 指令
* 语法`valid_referers none|blocked|server_names|string...`
  * `none`  表示`Referer`为空匹配上
  * `blocked`  表示`Referer`不为空，但是该值被防火墙或代理进行伪装过，如：不带`http://、https://`协议头
  * `server_names`  指定具体的域名或者IP
  * `string`  可以支持正则表达式和`*`的字符串。如果是正则表达式，需要以`~`开头表示
  
* 匹配方式
  * `nginx`会通就过`referer`自动和`valid_referers`后面的内容进行匹配，匹配过程不区分大小写
  * 匹配上了将变量 `$invalid_referer` 置`0`
  * 没有匹配上将变量` $invalid_referer`置为`1`


```
location /imgs {  
    valid_referers  none  blocked  127.0.0.1  www.github.com
    if ($invalid_referer){
        return 403;
    }
    root html;
}
```