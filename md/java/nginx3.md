### Nginx 静态资源部署
* 静态资源：在服务器真实存在、并且能直接展示的一些文件，如：`html、css、js、图片、音频、视频`等
* 动态资源：服务器端根据不同条件，返回不同的内容，如：用户数据、报表数据等


### 一、静态资源的配置指令
#### 1. listen
* 用来配置监听的端口
* 常用语法 listen address [:port] 或 listen port

```
listen  127.0.0.1：8080   监听指定的ip和端口
listen  127.0.0.1         监听指定ip的所有端口
listen  8080              监听指定的端口
listen  *.8080            监听指定的端口
```


#### 2. server_name
* 用来配置虚拟主机的服务名称
* 语法 `server_name name1...`，可以配置多个，以空格分割，配置格式有3种
  * 精确格式
  * 通配符格式，通配符只能出现在域名的首段或尾段
  * 正则表达式格式，必须以 `~` 作为开始标记
* 若都匹配上，优先级：`精确匹配 > *开始的通配符 > *结尾的通配符 > 正则表达式 > 默认的default_server`

```
server_name  127.0.0.1          
server_name  www.github.com     

server_name  192.168.0.*        
server_name  *.github.com       

server_name  ~^www\.(\w+)\.com  
```


#### 3. location 
* 用来配置 `url` 匹配规则
* 语法 `location [ = | ~ | ~* | ^~ | @]  uri{...}`
* 匹配规则：先使用不包含正则表达式进行匹配，找到匹配度最高的一个，然后使用包含正则表达式的③进行匹配，
如果能匹配到直接访问，匹配不到，就使用刚才匹配度最高的那个`location`来处理请求


```
3.1 不带符号，表示以指定路径开头，类似于SQL中的模糊查询 like 'url%'
location /abc {
    default_type text/plain;
    return 200 "111111";
}
以下访问都是正确的
http://127.0.0.1/abc
http://127.0.0.1/abc/
http://127.0.0.1/abc/def
http://127.0.0.1/abcdefg
http://127.0.0.1/abc?name=fgq


3.2 带 =   必须与指定的路径精确匹配
location =/abc {
    default_type text/plain;
    return 200 "222222";
}
可以匹配到
http://127.0.0.1/abc
http://127.0.0.1/abc?name=fgq
匹配不到
http://127.0.0.1/abc/
http://127.0.0.1/abc/def
http://127.0.0.1/abcdefg


3.3 带 ~    正则表达式匹配，区分大小写
    带 ~*   正则表达式匹配，不区分大小写
location ~* .*\.(jpg|gif|png|jpeg)$ {      该正则表示所有以 .jpg、.gif .png .jpeg 结尾的资源
     default_type text/plain;
     return 200 "333333";
}


3.4 带 ^~ : 和 3.1 功能一样，区别：如果匹配上，那么就停止匹配其他规则了
location ^~/abc {       
    default_type text/plain;
    return 200 "444444";
}
```


#### 4. root、alias
* `root` 设置请求的根目录，语法 `root path`，默认值`html`
* 查找方式 `root值 + location + url匹配的剩余部分`

```
location /imgs {                                    
}
location /imgs {                                    
    root  html;                              
}
location /imgs/ {                                  
    root  html;                              
}
请求路径：http://127.0.0.1/imgs/666.png
查找资源：html/imgs/666.png    (html + /imgs  + /666.png)
         html/imgs/666.png    (html + /imgs  + /666.png)
         html/imgs/666.png    (html + /imgs/ +  666.png)
```


* `alias`别名配置，请求路径替换掉`location`，语法 `alias path`
* 查找方式 `alias值 + url匹配的剩余部分`
 
```
location /imgs {                               
    alias  html;                              
}
location /imgs {                               
    alias  html/imgs;                              
}
location /imgs/ {                               
    alias  html/imgs/;                              
}
请求路径： http://127.0.0.1/imgs/666.png
查找资源： html/666.png           (html + /666.png)
          html/imgs/666.png      (html/imgs  + /666.png)
          html/imgs/666.png      (html/imgs/ + 666.png)
```


注意：如果 `location` 使用斜杠`/`结尾，那么`alias`值也要以`/`结尾，`root`不用



#### 5. index
* 设置网站的默认首页，默认值 `index.html`
* 可以设置多个值，如果请求路径`没有指定具体资源`，则从左到右依次进行查找，找到第一个为止

```
location / {                               
    root  html;                              
    index  index.html index.htm;                          
}
请求路径： http://127.0.0.1/
查找资源： html/index.html、html/index.htm  

location /imgs {                               
    root  html;                              
    index  666.png;                          
}
请求路径： http://127.0.0.1/imgs/
查找资源： html/imgs/666.png  
```


#### 6. error_page
* 用于当服务器返回对应的响应code后，如何来处理
* 语法 `error_page code ... [=[response]] uri;` 

```
6.1 可以指定具体跳转的地址
server {
    error_page   404  https://fgq233.github.io/md/blog;
}

6.2 可以指定重定向地址
server{
    error_page   500 502 503 504  /50x.html;
    
    location = /50x.html {
        root   html;
    }
}

6.3 使用location的@符号完成错误信息展示
server{
    error_page   404  @go404;
    
    location @go404 {
        default_type text/plain;
        return 404 '未找到资源';
    }
}

6.4 可选项=[response]的作用是用来将响应码更改为另外一个响应码
server{
    error_page   404 =200 /50x.html;
    
    location = /50x.html {
        root   html;
    }
}
当服务器返回404的时候，在浏览器上看到的响应码是200
```



### 二、静态资源的压缩指令
#### 1. 压缩相关指令
* `gzip`   开启后，静态资源文件在传输时会进行压缩，提高访问速度

* `gzip_types`  根据响应资源`mime`类型选择性地开启压缩功能，配置值参考同目录 `mime.types` 文件
  * 默认只会压缩 `text/html`
  * 可以配置多个值，以空格分割
  * `*`表示所有`mime`类型
  
* `gzip_comp_level` 压缩级别，范围 1~9，值越大表示压缩程度越高，但是也越费时间

* `gzip_min_length`  针对传输数据的大小`Content-Length`，低于配置大小则不压缩

* `gzip_buffers`  用于处理请求压缩的缓冲区数量和大小

* `gzip_http_version`  针对不同的`HTTP`协议版本，选择性地开启和关闭`gzip`压缩

* `gzip_vary`  开启后，压缩的资源添加了一个`响应头 Vary:Accept-Encoding`

* `gzip_disable`  用于排除一些不支持`gzip`的浏览器

* `gzip_proxied`  设置是否对服务端返回的结果进行`gzip`压缩


#### 2. 示例
``` 
gzip on;
gzip_types text/css application/javascript application/json;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_buffers 4 16K;
gzip_http_version 1.1;
gzip_vary on;
gzip_disable "MSIE [1-6]\.";
gzip_proxied off;
```

将这些配置单独抽取到一个配置文件`nginx_gzip.conf`，然后通过`include nginx_gzip.conf`加载


#### 3. gzip和sendfile共存问题
`gzip` 和 `sendfile` 默认是冲突的，需要使用`ngx_http_gzip_static_module`模块的`gzip_static`指令来解决



### 一、静态资源的缓存处理
### 一、静态资源的访问控制
* 跨域问题
* 防盗链问题
 



 