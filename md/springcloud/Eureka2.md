#### 一. 搭建注册中心 EurekaServer
###### 1. 引入server依赖
```
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```
###### 2. 编写启动类，添加@EnableEurekaServer注解
```
@EnableEurekaServer
@SpringBootApplication
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```
###### 3.yml配置
```
server:
  port: 8088   # 服务端口
spring:
  application:
    name: eurekaserver   # 服务名称
eureka:
  client:
    service-url:   #eureka的地址信息(将自己也注册到注册中心，集群之间通信使用)
      defaultZone: http://127.0.0.1:8088/eureka
```
 
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
通过步骤1、2将服务注册到注册中心
###### 3. 服务发现
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

 