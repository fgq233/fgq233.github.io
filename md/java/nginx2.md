### Nginx 核心配置文件 nginx.conf

### 一、简要
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


### 二、详细
```
#user  nobody;          用户或者用户组，用来控制访问权限
worker_processes  1;    生成工作进程的数量，值越大，支持的并发处理量越多，建议和CPU内核数保持一致

# daemon  off;                        Linux上设置Nginx以守护进程的方式启动，on开启，off关闭
#error_log  logs/error.log;           错误日志存储路径
#error_log  logs/error.log  notice;   错误日志存储路径，日志级别notice
#error_log  logs/error.log  info;     错误日志存储路径，日志级别info

#pid        logs/nginx.pid;           当前master进程的进程号PID存储的文件路径

events {
    # accept_mutex  on;         设置Nginx网络连接序列化，主要用来解决惊群问题（推荐开启）
    # multi_accept  on;         设置是否允许同时接收多个网络连接（推荐开启）
    # use  epoll;               设置Nginx服务器选择哪种事件驱动来处理网络消息，如select/poll/epoll/kqueue
    worker_connections  1024;   单个worker进程最大的连接数
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
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

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

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
