### Nginx 反向代理
`Nginx` 可以作为正向代理服务器、反向代理服务器

### 一、概念
客户端 A，代理服务器 B，目标服务器 C

#### 1. 正向代理
* A处于局域网，访问不了 C，B 可以访问 C，A通过B代理去访问C
* 正向代理是为了`帮助客户端`
  * 突破访问限制，如：翻墙
  * 提高访问速度：通常代理服务器都设置一个较大的硬盘缓冲区，会将部分请求的响应缓冲，以提高访问速度
  * 隐藏客户端真实`ip`，目标服务器接收到的是`B`的`ip`


#### 2. 反向代理
* C 处于局域网，A 访问不了 C，B 可以访问 C，C通过B代理接收请求、发出响应
* 反向代理是为了`帮助服务端`
  * 对于客户端，正向代理需要配置代理服务器，而反向代理不需要做任何设置
  * 反向代理是代理服务器，为服务器收发请求，使真实服务器对客户端不可见，起到保护作用
  
  
  
### 二、Nginx 反向代理
`Nginx`反向代理相关指令参考 [官方文档](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)

#### 1. proxy_pass 指令
* 用来设置被代理的服务器 C 的地址
* 语法 `proxy_pass URL`，URL可以是主机名称、传输协议 + ip + 端口形式
* `proxy_pass`值最后的 /
  * 不加 /，会拼接上请求路径中 `location`
  * 加了 /，会去除请求路径中 `location`

 
```
server {
    listen 80;
    server_name localhost;
    location / {
    	proxy_pass https://www.github.com;
    }
}
对于 location / ，客户端访问 http://localhost/index.html，加不加斜杠效果是一样的

server{
    listen 80;
    server_name localhost;
    location /server {
    	# proxy_pass http://127.0.0.1:8080;
    	proxy_pass http://127.0.0.1:8080/;
    }
}
客户端访问 http://localhost/server/user
不加斜杠，第1个proxy_pass访问的是test1接口 --- http://localhost:8080/server/user
加了斜杠，第2个proxy_pass访问的是test2接口 --- http://localhost:8080/user
```

```
/**
 * 测试接口
 */
@Controller
public class TestController {

    @RequestMapping("/server/user")
    @ResponseBody
    public String test1() {
        return "test1";
    }

    @RequestMapping("/user")
    @ResponseBody
    public String test2() {
        return "test2";
    }
}   
```


#### 2. proxy_set_header 指令
* 该指令可以设置请求头信息，然后在被代理的服务器 C 上可以接收到这些请求头信息
* 语法 `proxy_set_header field value;`

 