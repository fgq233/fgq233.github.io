### 核心配置文件 nginx.conf
`Nginx` 三大功能：**静态资源部署、反向代理、负载均衡**都是通过配置 `nginx.conf` 来实现的

### 一、简要说明
#### 1. 大致结构
* 全局块：`events` 和 `http` 之外的内容，用来配置影响`nginx`全局的指令

* `events`块，用来配置网络连接相关内容

* `http`块，可以配置多个`server`块
  * `server`块，配置虚拟主机相关内容，可以配置多个`location`块
  * `location`块，配置匹配请求`url`的路由，以及匹配成功后的处理逻辑

#### 2. 详解

```
#user  nobody;          用户或者用户组，用来控制访问权限
worker_processes  1;    生成工作进程的数量，值越大，支持的并发处理量越多，建议和CPU内核数保持一致

# daemon  off;                        Linux上设置Nginx以守护进程的方式启动，on开启，off关闭
#error_log  logs/error.log;           错误日志存储路径
#error_log  logs/error.log  notice;   错误日志存储路径，日志级别notice
#error_log  logs/error.log  info;     错误日志存储路径，日志级别info

#pid        logs/nginx.pid;           master进程的进程号PID存储的文件路径

events {
    # accept_mutex  on;         设置Nginx网络连接序列化，主要用来解决惊群问题（推荐开启）
    # multi_accept  on;         设置是否允许同时接收多个网络连接（推荐开启）
    # use  epoll;               设置Nginx服务器选择哪种事件驱动来处理网络消息，如select/poll/epoll/kqueue
    worker_connections  1024;   单个worker进程最大的连接数 
}

http {
    include       mime.types;                文件扩展名与文件类型映射表
    default_type  application/octet-stream;  Nginx默认响应前端请求的mime类型，可以配置在http、server、location块

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '    自定义日志格式
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;             访问日志

    sendfile        on;       Nginx服务器是否使用sendfile()传输文件，用于提高处理静态资源的性能          
    #tcp_nopush     on;       该指令必须在sendfile打开的状态下才会生效，是用来提升网络包的传输效率

    #keepalive_timeout  0;   长连接的超时时间(单位：秒)，
    keepalive_timeout  65;

    #gzip  on;               开启Gzip压缩功能，可以使网站的静态资源文件在传输时进行压缩，提高访问速度

    server {
        listen       80;            监听的端口
        server_name  localhost;     服务名称，可以是ip、localhost、域名等

        #charset koi8-r;

        #access_log  logs/host.access.log  main;    访问日志

        location / {                        
            root   html;                    root指令：资源存放的根目录  
            index  index.html index.htm;    index指令：匹配返回的资源文件
        }

        #error_page  404              /404.html;    服务器返回状态码是 404 时跳转到 /404.html

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;    服务器返回状态码是 500 502 503 504 时跳转到 /50x.html
        location = /50x.html {
            root   html;            
        }

    }

}
```


* `error_log`错误日志级别：`debug|info|notice|warn|error|crit|alert|emerg`

* 常用的`mime`类型，可以配置在 `http、server、location`，就近原则
  * `default_type  application/octet-stream;`   二进制流，浏览器会以下载附件的方式处理
  * `default_type  text/plain;`        浏览器会展示文本字符串
  * `default_type  text/html;`         浏览器会展示文本字符串(`字符串中dom元素会被浏览器解析`)
  * `default_type  application/json;`  浏览器会展示json数据      
  
* `access_log` 访问日志，可以配置在 `http、server、location`，就近原则
  
  
  
### 二、Nginx 常用全局变量
请求URL: `http://127.0.0.1/auth?name=fgq&age=18`  


| URL相关   | 含义        | 示例 |
| ------ | ----------| ---- |
| `$scheme`        |    访问协议                                       | `127.0.0.1` |
| `$host`          |    访问服务器的`server_name`值                     | `http` |
| `$uri`           |    当前请求的URI, 可能和最初的值有不同，比如经过重定向 | `/auth` |
| `$document_uri`  |    与`$uri`相同                                   |  |
| `$document_uri`  |    当前请求的URI，并且携带查询参数                  |`/auth?name=fgq&age=18` |
| `$args`          |    URL中的查询参数                                | `name=fgq&age=18` |
| `$query_string` |    与`$args`相同                                  |  |



| 请求头、响应头相关   | 含义        | 
| ------ | ----------|
| `$status`     | 响应的状态码 | 
| `$http_cookie`     | 客户端的`cookie`信息 | 
| `$content_length`  | 响应头中的`Content-Length` | 
| `$content_type`    | 请求头中的`Content-Type` | 
| `$http_user_agent` | 请求头中的`User-Agent` | 



| 服务端、客户端相关   | 含义        | 
| ------ | ----------|
| `$server_protocol`     | 客户端请求协议的版本，`HTTP/1.0`或`HTTP/1.1` | 
| `$server_addr`     | 服务端的地址 | 
| `$server_name`     | 服务端的名称 | 
| `$server_port`     | 服务端的端口号 |
|  `$remote_addr`    |   客户端的IP地址| 
|  `$remote_port`    |  客户端与服务端建立连接的端口号| 
|  `$remote_user`     |  客户端的用户名，需要有认证模块才能获取| 
| `$request_method`   |  客户端的请求方式，比如`GET、POST`等|
| `$request_filename`   |  当前请求的资源文件名|
| `$request_body_file`   |  存储了发给后端服务器的本地文件资源的名称|



| `nginx.conf`相关   | 含义        | 
| ------ | ----------|
| `$document_root`     | 当前请求对应`location`的`root`值，默认指向`Nginx`自带`html`目录所在位置  | 
| `$limit_rate`  | `Nginx`对网络连接速率的限制，也就是`nginx.conf`中`limit_rate`指令设置的值，默认是0，不限制 | 







