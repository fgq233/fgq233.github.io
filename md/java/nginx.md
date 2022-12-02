### 一、Nginx 介绍
* Nginx可作为HTTP服务器、反向代理服务器、邮件服务器
* Nginx常用功能：反向代理、负载均衡、动静分离



### 二、Nginx 配置文件
#### 1. 大致结构
```
全局块

events {        events块
    
}

http {          http块
    
    
    server {    server块
       
         location [PATTERN]{   location块
              
         }
    }
    
    server {            
       
    }
}

```
* 全局块: 配置影响nginx全局的指令，和服务器的硬件相关

* events块: 设置的是影响 Nginx 服务器与用户的网络连接
* http块: 可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置
* server块: 配置虚拟主机的参数，一个server块就是一个虚拟服务，可以指定端口、服务名、路由规则等信息
* location块: 一个server块可以配置多个location块，配置请求的路由，以及路由匹配成功进行的处理逻辑



#### 2、配置文件详解
```
#user  nobody;                      # 配置用户或者组，例：user administrator administrators;   
worker_processes  1;                # 允许生成的进程数

#error_log  logs/error.log;         # 制定日志路径，级别，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;         # 指定nginx进程运行文件存放地址


events {
    worker_connections  1024;       # 最大连接数
}


http {
    include       mime.types;                   # 文件扩展名与文件类型映射表
    default_type  application/octet-stream;     # 默认文件类型

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '      # 自定义日志格式
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;    # 服务日志   

    sendfile        on;     # 允许sendfile方式传输文件
    #tcp_nopush     on;     # 该指令必须在sendfile打开的状态下才会生效，主要是用来提升网络包的传输效率
 
    #keepalive_timeout  0;      # 连接超时时间，单位：秒
    keepalive_timeout  65;  

    #gzip  on;          # 开启Gzip压缩功能，可以使网站的css、js 、xml、html 文件在传输时进行压缩，提高访问速度
        
        
    upstream my_servers {         # 负载均衡
        server 192.168.0.1:8000 weight=5;   # weight越高，权重越大
        server 192.168.0.2:8000 weight=1;
        server 192.168.0.3:8000;
        server 192.168.0.4:8000 backup;     # 热备
        ip_hash;                            # 每个请求按访问ip的hash结果分配，固定访问一个服务器，可以解决session共享问题
     }
        
    server {
        listen       80;            # 监听端口
        server_name  localhost;     # 域名

        #charset koi8-r;            # 字符集
        
        #client_max_body_size 10M; # 限制用户上传文件大小
        
        #access_log  logs/host.access.log  main;        # 服务日志  

        location / {                                # 匹配以 / 开头的
            root   html;                            # 文件的存放根目录   
            index  index.html index.htm;            # index 指令匹配文件
        }
        
        location / admin {          # 匹配以 /admin 开头的请求
            deny 192.24.40.8;       # 拒绝的ip或者网段
            allow 192.24.40.6;      # 允许的ip或者网段   
        }

        location /api {                       # 匹配以 /api 开头的请求   
           proxy_pass    http://my_servers;   # 转发请求到通过upstream定义的一组应用服务器 my_servers
        } 

         
         location ~* .*\.(jpg|gif|png|jpeg)$ {  # 拒绝访问所有图片格式文件
             deny all;
         }
          
        #error_page  404              /404.html;     # 状态码是 404 的 错误页
        error_page   500 502 503 504  /50x.html;     # 状态码是 500 502 503 504 的 错误页
        location = /50x.html {
            root   html;
        }

    }

     # http请求重定向到https请求
     server {
         listen 8090;
         server_name Domain.com;
         return 301 https://$server_name$request_uri;
     }
}

```

#### 3、root、alias
* root指令：根路径配置，root值和location值进行拼接，然后再拼接上url剩余的部分

```
        location /img {                               
            root  html;                              
        }
        请求：localhost/img/root.png
        查找：html/img/root.png
```



* alias指令：别名配置，会直接替换location，然后再拼接上url剩余的部分

```
        location /img2 {                               
           alias  html;                                
        }
        请求：localhost/img2/alias.png
        查找：html/alias.png
        
        注意：如果location使用斜杠结尾，那么alias也要用斜杠结尾
        location /img2/ {                               
           alias  html/;                                
        }
```


  
#### 4、index 指令
* 该指令指定具体的资源名字，可以跟多个文件，用空格隔开
* 如果包括多个文件，Nginx会根据文件的枚举顺序来检查，直到查找的文件存在
* 文件可以是相对路径也可以是绝对路径，绝对路径需要放在最后
* 该指令拥有默认值，index index.html，即如果没有给出index，默认初始页为index.html


#### 5、Location匹配优先级
Location配置支持普通字符串匹配和正则匹配，优先级从先到后如下：

| 优先级   | 匹配规则   | 说明     |
| ------  | ------- | --------- |
| 1      | =           | 精确匹配                       |
| 2      | ^~          |  前缀匹配：以某个字符串开头               |
| 3      | ~           |  区分大小写的正则匹配           |
| 4      | ~*          |  不区分大小写的正则匹配        |
| 5      | !~          |   区分大小写的不匹配正则       |
| 6      | !~*         |   不区分大小写的不匹配正则    |
| 7      | /           |   通用匹配，任何请求都会匹配到 |

#### 6、Nginx提供的全局变量
Location配置支持普通字符串匹配和正则匹配，优先级如下：
* $args, 请求中的参数
* $content_length, HTTP请求信息里的"Content-Length"
* $content_type, 请求信息里的"Content-Type"
* $document_root, 针对当前请求的根路径设置值;
* $document_uri, 与$uri相同
* $host, 请求信息中的"Host"，如果请求中没有Host行，则等于设置的服务器名
* $limit_rate, 对连接速率的限制;
* $request_method, 请求的方法，比如"GET"、"POST"等
* $remote_addr, 客户端地址
* $remote_port, 客户端端口号
* $remote_user, 客户端用户名，认证用
* $request_filename, 当前请求的文件路径名
* $request_body_file,当前请求的文件
* $request_uri, 请求的URI，带查询字符串
* $query_string, 与$args相同
* $scheme, 所用的协议，比如http或者是https，比如rewrite ^(.+)$
* $scheme://example.com$1 redirect        
* $server_protocol, 请求的协议版本，"HTTP/1.0"或"HTTP/1.1";
* $server_addr, 服务器地址
* $server_name, 请求到达的服务器名
* $server_port, 请求到达的服务器端口号
* $uri, 请求的URI，可能和最初的值有不同，比如经过重定向之类的