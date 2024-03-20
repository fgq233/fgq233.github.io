#### 一. 搭建注册中心 EurekaServer
###### 1. 引入server依赖
```
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```
###### 2. 编写启动类
```
@EnableEurekaServer
@SpringBootApplication
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

`@EnableEurekaServer`注解启用Euerka注册中心功能

###### 3.yml配置
```
server:
  port: 8088   # 服务端口
spring:
  application:
    name: eurekaserver   # 服务名称
eureka:
  client:
    register-with-eureka: false    # 是否注册到eureka服务中(默认会将自己作为一个服务注册到注册中心)
    fetch-registry: false          # 是否拉取其他的服务
    service-url:                   # eureka的地址信息
      defaultZone: http://127.0.0.1:8088/eureka
```

启动服务，访问地址：[http://localhost:8088](http://localhost:8088)  可以看到Eureka注册中心的界面
 
#### 二. 服务注册与发现
###### 1. 引入client依赖
```
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```
###### 2. yml配置
```
server:
  port: 8081
spring:
  application:
    name: orderservice     --服务名
eureka:
  client:
    service-url:  
      defaultZone: http://127.0.0.1:8088/eureka
```

###### 3. 编写启动类
```
@EnableDiscoveryClient
@SpringBootApplication
public class EurekaClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaClientApplication.class, args);
    }
}
```

* `@EnableDiscoveryClient` 注解表明是一个Eureka客户端
* 启动服务，查看注册中心 [http://localhost:8088](http://localhost:8088)，发现Eureka客户端已经成功注册


###### 4. 服务发现
服务发现是基于服务名称获取服务列表，然后通过负载均衡挑选一个服务，实现远程调用

```
 @Bean
 @LoadBalanced  // 开启负载均衡注解
 public RestTemplate getrestTemplate(){
     return new RestTemplate();
 }
 
 // 利用RestTemplate发起http请求，实现远程服务调用
  String url = "http://userservice/user/1";
  restTemplate.getForObject(url, User.class);
```

#### 三、Eureka常用配置
```
eureka:
  client:               # eureka客户端配置
    register-with-eureka: true      # 是否将自己注册到eureka服务端上去
    fetch-registry: true            # 是否获取eureka服务端上注册的服务列表
    service-url:
      defaultZone: http://localhost:8088/eureka/    # 指定注册中心地址
    enabled: true                                   # 启用eureka客户端
    registry-fetch-interval-seconds: 30             # 定义去eureka服务端获取服务列表的时间间隔
  instance:           # eureka客户端实例配置
    lease-renewal-interval-in-seconds: 30      # 定义服务多久去注册中心续约
    lease-expiration-duration-in-seconds: 90   # 定义服务多久不去续约认为服务失效
    metadata-map:
      zone: shanghai          # 所在区域
    hostname: localhost       # 服务主机名称
    prefer-ip-address: false  # 是否优先使用ip来作为主机名
  server:           # eureka服务端配置
    enable-self-preservation: false   # 关闭eureka服务端的保护机制
```
