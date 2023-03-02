###  Gateway-跨域问题
####  一. 跨域
* `http:127.0.0.1:8080`

* 协议、域名、端口，只要三者一个不一样，就属于跨域

* 跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题

 
####  二. 跨域解决方案 CORS
#### 1、CORS简介
*  `CORS` 全称是跨域资源共享`(Cross-origin resource sharing)`,它允许浏览器向跨源服务器，
发出`XMLHttpRequest`请求，从而克服了AJAX只能同源使用的限制

*  `CORS`需要浏览器和服务器同时支持，目前所有浏览器都支持该功能，IE浏览器不能低于`IE10`

因此，实现`CORS`通信的关键是服务器，只要服务器实现了`CORS`接口，就可以跨域通信

#### 2、两种请求
*  浏览器将CORS请求分成两类：简单请求`(simple request)`和非简单请求`(not-so-simple request)`
*  对于简单请求，就是在头信息之中，增加一个`Origin`字段

```
Origin: https://www.spring.io
```

* `Origin`字段用来说明本次请求来自哪个源 (协议 + 域名 + 端口)，服务器根据这个值，决定是否同意这次请求
* 如果`Origin`指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段

```
Access-Control-Allow-Origin: https://www.spring.io
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

#### 3、与JSONP的比较
* 使用目的相同，但`CORS`比`JSONP`更强大
* `JSONP`只支持`GET`请求，`CORS`支持所有类型的`HTTP`请求
* `JSONP`的优势在于支持老式浏览器，以及可以向不支持`CORS`的网站请求数据


####  三. gateway 使用 CORS 解决跨域问题 
在服务的`application.yml`文件中，添加下面的配置：

``` 
spring:
  cloud:
    gateway:
      globalcors:   # 全局的跨域处理 
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins:  
              - "*"
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

* `allowedOrigins` 允许哪些网站的跨域请求，可配置单个、多个、所有`*`
* `allowedMethods` 允许的跨域`ajax`的请求方式，可配置单个、多个、所有`*`
* `allowedHeaders` 允许在请求中携带的头信息，可配置单个、多个、所有`*`
* `allowCredentials` 是否允许携带`cookie`
* `maxAge` 这次跨域检测的有效期
