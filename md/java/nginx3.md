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
① 不带符号，表示以指定路径开头，类似于SQL中的 like 'url%'
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


② =   表示必须与指定的路径精确匹配，类似于SQL中的 = url
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


③ ~    表示当前uri中包含了正则表达式，区分大小写
  ~*   表示当前uri中包含了正则表达式，不区分大小写
location ~^/abc[a-z]$ {        此处正则：^表示开头为 /abc，[a-z]$表示结尾为[a-z]中一个字符
    default_type text/plain;
    return 200 "333333";
}
可以匹配到
http://127.0.0.1/abcd
匹配不到
http://127.0.0.1/ABC
http://127.0.0.1/abc6
http://127.0.0.1/abcde


④ ^~ : 和 ① 功能一样，区别：如果匹配上，那么就停止匹配其他规则了
location ^~/abc {       
    default_type text/plain;
    return 200 "444444";
}
可以匹配到
http://127.0.0.1/abcd
匹配不到
http://127.0.0.1/ABC
http://127.0.0.1/abc6
http://127.0.0.1/abcde
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
* 查找方式 `alias值 + 匹配上url的剩余部分`
 
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
* 设置默认首页，默认值 `index.html`
* 可以跟多个设置，用空格隔开
* 如果请求路径没有指定具体资源，则依次进行查找，找到第一个为止

```
location / {                               
    root  html;                              
    index  index.html index.htm;                          
}
请求路径： http://127.0.0.1/
查找资源： html/index.html、html/index.htm，从左到右找到第一个存在的资源返回   

location /imgs {                               
    root  html;                              
    index  666.png;                          
}
请求路径： http://127.0.0.1/imgs/
查找资源： html/imgs/666.png  
```

### 一、静态资源的配置优化
### 一、静态资源的压缩配置
### 一、静态资源的缓存处理
### 一、静态资源的访问控制
* 跨域问题
* 防盗链问题
 



 