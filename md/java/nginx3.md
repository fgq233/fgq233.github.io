### Nginx 静态资源部署
* 静态资源：在服务器真实存在、并且能直接展示的一些文件，如：`html、css、js、图片、音频、视频`等
* 动态资源：服务器端根据不同条件，返回不同的内容，如：用户数据、报表数据等
* 动静分离：静态资源部署在`CDN、Nginx`之类服务器，动态资源部署在`Tomcat、WebLogic`之类服务器

### 一、ip、端口、路径
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


| 优先级   | 匹配规则   | 说明     |
| ------  | ------- | --------- |
| 1      | `=`         | 精确匹配                       |
| 2      | `^~`         |  前缀匹配：以某个字符串开头，类似于SQL中的模糊查询 `like 'url%'`  |
| 3      | `~`和`~*`    |  正则表达式匹配，区分大小写 `~`、不区分大小写 `~*`          |
| 4      | `/`         |   通用前缀匹配，类似于SQL中的模糊查询 `like 'url%'` |

* `1、2 `一旦匹配成功，则不再查找其他匹配项

```
3.1  = 
location =/abc {
    default_type text/plain;
    return 200 "111111";
}
可以匹配到
http://127.0.0.1/abc
http://127.0.0.1/abc?name=fgq
匹配不到
http://127.0.0.1/abc/
http://127.0.0.1/abc/def
http://127.0.0.1/abcdefg

3.2  ^~  
location ^~/abc {       
    default_type text/plain;
    return 200 "222222";
}
都可以匹配到
http://127.0.0.1/abc
http://127.0.0.1/abc/
http://127.0.0.1/abc/def
http://127.0.0.1/abcdefg
http://127.0.0.1/abc?name=fgq

3.3 ~* 
location ~* .*\.(jpg|gif|png|jpeg)$ {    该正则表示所有以 .jpg、.gif .png .jpeg 结尾的资源
     default_type text/plain;
     return 200 "333333";
}

3.4  通用前缀匹配，和 3.2 匹配一样，不过优先级最低
location /abc {
    default_type text/plain;
    return 200 "444444";
}
```



### 二、资源目录配置
#### 1. root
* 设置请求的根目录，语法 `root path`，默认值`html`
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


#### 2. alias
* 别名配置，请求路径替换掉`location`，语法 `alias path`
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



#### 2. index
* 设置网站的默认首页，默认值 `index.html`
* 可以设置多个值，如果请求路径**没有指定具体资源**，则从左到右依次进行查找，找到第一个为止

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


### 三、错误页 error_page
* 用于当服务器返回对应的响应code后，如何来处理
* 语法 `error_page code ... [=[response]] uri;` 

```
可以指定具体跳转的地址
server {
    error_page   404  https://fgq233.github.io/md/blog;
}

可以指定重定向地址
server{
    error_page   500 502 503 504  /50x.html;
    
    location = /50x.html {
        root   html;
    }
}

使用location的@符号完成错误信息展示
server{
    error_page   404  @go404;
    
    location @go404 {
        default_type text/plain;
        return 404 '未找到资源';
    }
}

可选项=[response]，用来更改响应码，如下：当服务器返回404时，在浏览器上看到的响应码是200
server{
    error_page   404 =200 /50x.html;
    
    location = /50x.html {
        root   html;
    }
}
```
