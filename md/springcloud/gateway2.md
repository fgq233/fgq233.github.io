###  断言工厂

* 在配置文件中写的路由规则只是字符串，这些字符串会被断言工厂产Predicate Factory读取并处理，
最终判断请求是否符合规则

* 最常用的是 `Path`，这个规则是由`PathRoutePredicateFactory` 工厂类来处理的

```
org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory
```


Gateway提供了大量断言工厂：

| **名称**   | **说明**                       | **示例**                                                     |
| ---------- | ------------------------------ | ------------------------------------------------------------ |
| After      | 是某个时间点后的请求           | -  After=2037-01-20T17:42:47.789-07:00[America/Denver]       |
| Before     | 是某个时间点之前的请求         | -  Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]       |
| Between    | 是某两个时间点之前的请求       | -  Between=2037-01-20T17:42:47.789-07:00[America/Denver],  2037-01-21T17:42:47.789-07:00[America/Denver] |
| Cookie     | 请求必须包含某些cookie         | - Cookie=user,fgq                                     |
| Header     | 请求必须包含某些header         | - Header=X-Request-Id, \d+                                   |
| Host       | 请求必须是访问某个host（域名） | -  Host=\*\*.somehost.org,**.anotherhost.org                   |
| Method     | 请求方式必须是指定方式         | - Method=GET                                            |
| Path       | 请求路径必须符合指定规则       | - Path=/user/{segment},/order/**                               |
| Query      | 请求参数必须包含指定参数       | - Query=name                        |
| RemoteAddr | 请求者的ip必须是指定范围       | - RemoteAddr=192.168.1.1/24                                  |

[官网 Route Predicate Factories](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories)


