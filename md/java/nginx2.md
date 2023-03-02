### Nginx 核心配置文件 nginx.conf
`Nginx` 三大功能：**静态资源部署、反向代理、负载均衡**都是通过配置 `nginx.conf` 来实现的

### 一、简要说明
#### 1. 大致结构
* 全局块：`events` 和 `http` 之外的内容，用来配置影响`nginx`全局的指令

* `events`块，用来配置网络连接相关内容

* `http`块，可以配置多个`server`块
  * `server`块，配置虚拟主机相关内容，可以配置多个`location`块
  * `location`块，配置匹配请求`url`的路由，以及匹配成功后的处理逻辑

#### 2. 大致流程
* 当前`nginx`监听`localhost`的`80`端口，若请求`url`是`http:localhost:80`，则被拦截下来，交给`location`块
* 请求的`url` 和`location`块的路由进行匹配
* 匹配上`location`块后，就取出里面配置的内容，返回给用户


```
worker_processes  1;        

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```


### 二、详细说明
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

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```


* `error_log`错误日志级别：`debug|info|notice|warn|error|crit|alert|emerg`

* 常用的`mime`类型，可以配置在 `http、server、location`，就近原则
  * `default_type  application/octet-stream;`   二进制流，浏览器会以下载附件的方式处理
  * `default_type  text/plain;`        浏览器会展示文本字符串
  * `default_type  text/html;`         浏览器会展示文本字符串(`字符串中dom元素会被浏览器解析`)
  * `default_type  application/json;`  浏览器会展示json数据      
  
* `access_log` 访问日志，可以配置在 `http、server、location`，就近原则
  