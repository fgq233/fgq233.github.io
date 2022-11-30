###  过滤器工厂 GatewayFilterFactory
####  1. 过滤器作用
* 对进入网关的请求和微服务返回的响应做处理
![过滤器作用](https://fgq233.github.io/imgs/springcloud/gateway1.png)


####  2. 过滤器工厂
* [官网 Route Predicate Factories](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories)

常用的有：

| **名称**             | **说明**                     |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 给请求添加一个请求头     |
| RemoveRequestHeader  | 移除请求中的一个请求头       |
| AddResponseHeader    | 给响应结果中添加一个响应头   |
| RemoveResponseHeader | 从响应结果中移除一个响应头 |
| RequestRateLimiter   | 限制请求的流量               |


####  3. 过滤器使用
```
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://userservice
          predicates:
            - Path=/user/**
          filters:     # 过滤器，可以有多个  
            - AddRequestHeader=X-Request-red, blue
```

####  4. 默认过滤器 DefaultFilters
* 默认过滤器对所有路由都生效

```
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://userservice
          predicates:
            - Path=/user/**
      default-filters:      
      - AddResponseHeader=X-Response-Default-Red, Default-Blue
      - PrefixPath=/httpbin
```


####  5. 全局过滤器 GlobalFilters
* 全局过滤器对所有路由都生效
* DefaultFilters通过配置定义，处理逻辑是固定的，而GlobalFilter的逻辑需要自己写代码实现
* 放行：chain.filter(exchange);
* 拦截：exchange.getResponse().setComplete();


使用方式是实现GlobalFilter接口：

```
public interface GlobalFilter {
    /**
     * @param exchange 请求上下文，里面可以获取Request、Response等信息
     * @param chain    放行给下一个过滤器 
     * @return 返回标示当前过滤器业务结束
     */
    Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain);
}

@Order(-1)   # 越小越先执行，也可以实现 Ordered接口达到效果
@Component
public class CustomGlobalFilter implements GlobalFilter{

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("custom global filter");
        return chain.filter(exchange);
    }
}
```


####  6. 过滤器执行顺序
* a) DefaultFilters
* b) GatewayFilters：某个路由的 filters
* c) GlobalFilters

* 每一个过滤器最终都有一个int类型的order值，order值越小，执行顺序越靠前
* GatewayFilters、DefaultFilters的order由Spring指定，声明顺序是从1递增
* GlobalFilter通过实现Ordered接口，或者添加@Order注解来指定order值
* 当过滤器的order值一样时，会按照 DefaultFilters > GatewayFilters > GlobalFilter的顺序执行


```
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://userservice
          predicates:
            - Path=/user/**
          filters:
            - AddRequestHeader=X-Request-1, blue      order=1
            - AddRequestHeader=X-Request-2, red       order=2
            - AddRequestHeader=X-Request-3, yellow    order=3
      default-filters:
        - AddRequestHeader=Y-Request-1, 111           order=1
        - AddRequestHeader=Y-Request-2, 222           order=2
        - AddRequestHeader=Y-Request-3, 333           order=3
```
