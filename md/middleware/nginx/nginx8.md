### Nginx 负载均衡

### 一、负载均衡常用方式
* 用户手动选择，比如某些视频网站上的线路1、线路2
* DNS轮询方式
    * DNS：主要用于域名与 IP 地址的相互转换，让用户输入域名也可以访问到服务器
    * 轮询：同一个域名绑定多个IP地址，大多数域名注册商都支持
* 四/七层负载均衡
    * 四层负载均衡指的是**传输层**，主要是基于`IP+PORT`的负载均衡
      * 硬件：`F5、BIG-IP、Radware`等
      * 软件：`LVS、Nginx、Hayproxy`等
    * 七层负载均衡指的是**应用层**，主要是基于`虚拟的URL`或`主机IP`的负载均衡
      * 软件：`Nginx、Hayproxy`等
    * 四层负载均衡性能 > 七层负载均衡
    
![](https://fgq233.github.io/imgs/java/nginx4.png)

  
### 二、Nginx 七层负载均衡
* `Nginx` 实现七层负载均衡用到 `upstream、server`指令
* `Nginx` 的负载均衡是在反向代理基础上，把用户的请求根据指定的算法分发到一组`upstream`服务器

#### 1. upstream 指令
* 用来定义一组服务器，它们可以是监听不同端口的服务器
* 语法 `upstream name {...}`，服务器可以指定不同的权重，默认为1

#### 2. server 指令
* 用来指定后端服务器的名称和一些参数，可以使用域名、IP、端口
* 语法 `server name [paramerters]`


#### 3. Nginx 实现七层负载均衡
```
http {
    upstream my_upstream {
        server 127.0.0.1:8081;
        server 127.0.0.1:8082;
        server 127.0.0.1:8083;
    }
    
    server {
        listen   80;
        server_name  localhost;
        location / {
            proxy_pass http://my_upstream;
        }
    }
}
```

当访问 `http://localhost` 时，`Nginx`会采用轮询的方式将请求转发到 `upstream` 中定义的 3 台服务器


#### 4. Nginx 负载均衡状态

| 状态         | 概述                              |
| ------------ | --------------------------------- |
| `down` | 当前的`server`暂时不参与负载均衡    |
| `backup ` | 备份服务器，当主服务器不可用时，才会用来传递请求   |
| `max_fails` | 允许请求失败的次数，默认为1                |
| `fail_timeout` | 经过`max_fails`失败后, 服务暂停时间，默认10秒 |
| `max_conns` | 最大的连接数，默认0，表示不限制    |


```
http {
    upstream my_upstream {
        server 127.0.0.1:8081 down;
        server 127.0.0.1:8082 backup;
        server 127.0.0.1:8083 max_fails=3 fail_timeout=30;
        server 127.0.0.1:8084 max_conns=666;
    }
}
```



#### 5. Nginx 负载均衡策略

| 算法名称   | 说明             | 作用             |
| ---------- | ---------------- |---------------- |
| 轮询         | 默认方式         |
| `weight`     | 权重方式        |  权重越大，被分配到请求的几率越大，不配置的话默认值为1 |
| `ip_hash`    | ip分配方式      |  客户端IP进行哈希算法，相同ip会始终定位到同一台后端服务器上  |
| `uri_hash`   | URI分配方式     |  相同uri请求始终定向到同一个后端服务器，要配合缓存命中来使用 |
| `least_conn` | 最少连接方式    |  把请求转发给连接数较少的后端服务器，适合请求处理时间长短不一造成服务器过载的情况 |
| `fair`       | 响应时间方式    |  智能负载均衡，默认不支持，需要添加`nginx-upstream-fair`模块 |


```
upstream my_upstream {
    server 127.0.0.1:8081 weight=6;
    server 127.0.0.1:8082 weight=3;
    server 127.0.0.1:8083 weight=1;
}
upstream my_upstream {
    ip_hash;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}
upstream my_upstream {
    hash &request_uri;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}
upstream my_upstream {
    least_conn;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}
upstream my_upstream {
    fair;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}
```
