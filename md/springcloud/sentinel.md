### 微服务保护
### 一. 相关概念
#### 1. 雪崩
微服务调用链路中的某个服务故障，引起整个链路中的所有微服务都不可用，这就是雪崩

#### 2. 雪崩解决方案
* 超时处理：设定超时时间，请求超过一定时间没有响应就返回错误信息，不会无休止等待

* 舱壁模式：限定每个业务能使用的线程数，避免耗尽整个服务器的资源，因此也叫线程隔离

* 熔断降级：由断路器统计业务执行的异常比例，如果超出阈值则会熔断该业务，拦截访问该业务的一切请求

#### 3. 流量控制
限制业务访问的QPS，避免服务因流量的突增而故障






### 二. 微服务保护技术
在SpringCloud当中支持多种服务保护技术：

- [Sentinel](https://github.com/alibaba/Sentinel)
- [Netfix Hystrix](https://github.com/Netflix/Hystrix)
- [Resilience4J](https://github.com/resilience4j/resilience4j)


|                | **Sentinel**                                   | **Hystrix**                   |
| -------------- | ---------------------------------------------- | ----------------------------- |
| 隔离策略       | 信号量隔离                                     | 线程池隔离/信号量隔离         |
| 熔断降级策略   | 基于慢调用比例或异常比例                       | 基于失败比率                  |
| 规则配置       | 支持多种数据源                                 | 支持多种数据源                |
| 基于注解的支持 | 支持                                           | 支持                          |
| 限流           | 基于 QPS，支持基于调用关系的限流               | 有限的支持                    |
| 流量整形       | 支持慢启动、匀速排队模式                       | 不支持                        |
| 系统自适应保护 | 支持                                           | 不支持                        |
| 控制台         | 开箱即用，可配置规则、查看秒级监控、机器发现等 | 不完善                        |
| 常见框架的适配 | Servlet、Spring Cloud、Dubbo、gRPC  等         | Servlet、Spring Cloud Netflix |



### 三. Sentinel 使用
#### 1. 下载安装包
* 官网：[https://sentinelguard.io](https://sentinelguard.io)
* 使用说明：[https://sentinelguard.io/zh-cn/docs/introduction.html](https://sentinelguard.io/zh-cn/docs/introduction.html)
* GitHub主页：[https://github.com/alibaba/Sentinel](https://github.com/alibaba/Sentinel)
* 下载页：[https://github.com/alibaba/Sentinel/releases](https://github.com/alibaba/Sentinel/releases)

#### 2. 启动
将下载的包解压到任意非中文目录下
* 项目是 基于SpringBoot打成的jar包： sentinel-dashboard-x.x.x.jar 
* 启动：`java -jar sentinel-dashboard-1.8.6.jar`

#### 3. 访问
浏览器访问：[http://localhost:8080](http://localhost:8080)，默认的账号和密码都是 `sentinel`


#### 4. 默认配置

|  配置项  | 默认值 | 说明 |
| ------ | ----------| ---- |
| server.port | 8080 | 服务端口 |
| sentinel.dashboard.auth.username | sentinel | 默认用户名 |
| sentinel.dashboard.auth.password | sentinel | 默认密码 |


修改启动端口：`java -jar sentinel-dashboard-1.8.6.jar -Dserver.port=8888`


#### 5. 微服务整合Sentinel
引入依赖

```
<dependency>
    <groupId>com.alibaba.cloud</groupId> 
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

yml配置

```
spring:
  cloud: 
    sentinel:
      transport:
        dashboard: localhost:8888
```

若 Feign整合Sentinel，需要开启：

```
feign:
  sentinel:
    enabled: true
```

#### 6. 触发监控
访问服务的任意端点，触发sentinel的监控
