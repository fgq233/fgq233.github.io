### Gateway使用
### 一. 网关的功能
* 身份认证和权限校验
* 服务路由和负载均衡
* 请求限流

在SpringCloud中网关的实现包括两种：

* gateway：基于Spring5中提供的WebFlux，属于响应式编程的实现
* zuul：基于Servlet的实现，属于阻塞式编程


### 二. Gateway使用步骤
#### 1. 创建gateway服务模块，引入依赖
```
<!--网关-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<!--nacos服务发现-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### 2. 编写启动类
```
@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
    	SpringApplication.run(GatewayApplication.class, args);
    }
}
```

#### 3. yml配置：端口、服务名、nacos地址、路由
```
server:
  port: 10010 
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
    gateway:
      routes:       
        - id: user-service 
          uri: http://127.0.0.1:8081 
          predicates: 
            - Path=/user/** 
            
        - id: order-service
          uri: lb://userservice 
          predicates:
            - Path=/order/** 
```

* routes 节点下可配置多个路由
* id ：路由id，自定义，只要唯一即可
* uri ：路由的目标地址，有2种写法，http是固定地址、lb是跟据服务名称负载均衡
* predicates ：路由断言，判断路由是否符合规则
* Path ：路由规则，可以有多个，这里按照路径匹配，只要以/user/开头就符合要求

#### 4. 配置项目需要的过滤器 filters
#### 5. 启动网关服务、测试
测试 [http://localhost:10010/user/1](http://localhost:10010/user/1) ，会自动路由到 [http://localhost:8081/user/1](http://localhost:8081/user/1)


### 三. 路由配置
#### 1. 基于java代码路由配置
```
@Configuration
public class RouterConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("order-service", r -> r.path("/order/**").uri("lb://orderservice"))
                .route("user-service", r -> r.path("/user/**").uri("lb://userservice"))
                .build();
    }
}
```

这种效果和yml配置是一样的


#### 2. 自动路由
```
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true                 # 开启自动路由
          lower-case-service-id: true   # 使用小写服务名，默认是大写
```

* 开启自动路由后，就不用配置routers了
* gateway 会自动从注册中心动态创建路由routers，利用微服务名称进行路由，同时会负载均衡
* 自动路由生成默认的 routers：lb://服务名 , path=/服务名/**
* 测试 [http://localhost:10010/userservice/user/1](http://localhost:10010/userservice/user/1) ，会自动路由到 [http://localhost:8081/user/1](http://localhost:8081/user/1)
