###  Gateway-跨域问题
####  一. 跨域
跨域主要包括：

* 域名不同： www.spring.io 和 www.github.com 
* 域名相同，端口不同：localhost:8080 和 localhost8088

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题


 
####  二. 跨域解决方案 CORS
#### 1、CORS简介
*  CORS是一个W3C标准，全称是跨域资源共享(Cross-origin resource sharing),
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制
*  CORS需要浏览器和服务器同时支持，目前所有浏览器都支持该功能，IE浏览器不能低于IE10

因此，实现CORS通信的关键是服务器，只要服务器实现了CORS接口，就可以跨域通信

#### 2、两种请求
*  浏览器将CORS请求分成两类：简单请求(simple request)和非简单请求(not-so-simple request)
*  对于简单请求，就是在头信息之中，增加一个Origin字段

```
Origin: https://www.spring.io
```

* Origin字段用来说明本次请求来自哪个源 (协议 + 域名 + 端口)，服务器根据这个值，决定是否同意这次请求
* 如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段

```
Access-Control-Allow-Origin: https://www.spring.io
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

#### 3、与JSONP的比较
* 使用目的相同，但CORS比JSONP更强大
* JSONP只支持GET请求，CORS支持所有类型的HTTP请求
* JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据


####  三. gateway 使用 CORS 解决跨域问题 
在服务的application.yml文件中，添加下面的配置：

``` 
spring:
  cloud:
    gateway:
      globalcors:   # 全局的跨域处理 
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins:  
              - "http://localhost:8080"
            allowedMethods: 
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*"  
            allowCredentials: true 
            maxAge: 360000  
```

* allowedOrigins: 允许哪些网站的跨域请求，可配置单个、多个、所有 "*"
* allowedMethods: 允许的跨域ajax的请求方式
* allowedHeaders: 允许在请求中携带的头信息
* allowCredentials: 是否允许携带cookie
* maxAge: 这次跨域检测的有效期
