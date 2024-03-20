### Nacos 注册中心
#### 1. 添加依赖
父工程引入 SpringCloudAlibaba 依赖：

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.6.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

客户端引入 nacos-discovery 依赖：

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```


#### 2. 配置nacos地址
```
spring:   
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848   # nacos服务地址
```


#### 3. nacos分级存储模型
* 一个服务可以有多个实例，例如userservice，可以有: 127.0.0.1:8081、127.0.0.1:8082
* Nacos就将同一机房内、同一个城市内的实例划分为一个集群
* 一个服务可以包含多个集群，每个集群下可以有多个实例，形成分级模型：服务-集群-实例
* 微服务互相访问时，应该尽可能访问同集群实例，因为本地访问速度更快，当本集群内不可用时，才访问其它集群，见4


#### 4. 配置一个服务的集群属性 
```
spring:
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      discovery:
        cluster-name: BJ   # 集群名称
```

#### 5. nacos 负载均衡
Nacos默认负载均衡规则并没用优先访问同集群实例，可以通过配置来实现优先访问同一集群

```
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule  # 负载均衡规则
```


#### 6. nacos 服务实例的权重设置 (范围：0~1)
* 默认情况Nacos是随机挑选实例，可以通过在Nacos权重配置来控制访问频率，权重越大则访问频率越高
* 如果权重修改为0，则该实例永远不会被访问
 


#### 7. nacos 环境隔离 ----- 命名空间namespace
* Nacos提供namespace来实现环境隔离功能，不同namespace之间相互隔离，服务互相不可见
* Nacos中可以有多个namespace，默认namespace都是public
* namespace下可以有group、service等
* a) 在 Nacos 创建新的命名空间
* b) 复制新命名空间的ID
* c) yml配置命名空间
 
```
spring:
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      discovery:
        cluster-name: BJ
        namespace: 7ad1ed15-68eb-48c5-b66a-256638613cae  # 命名空间ID
```
 
#### 8. nacos 永久实例
Nacos的服务实例分为两种类型
* 临时实例：如果实例宕机超过一定时间，会立马从服务列表剔除，默认的类型
* 非临时实例：如果实例宕机，不会从服务列表剔除，也可以叫永久实例


#### 9. nacos 注册中心与 eureka 对比
共同点
* 支持服务注册、服务拉取
* 支持服务提供者以心跳方式做健康检测

不同点
* nacos支持服务端主动检测提供者状态：临时实例采用心跳模式，永久实例采用主动检测模式
* nacos支持服务端列表变更主动推送，不正常服务消息主动推送给消费者，服务列表更新更及时
* nacos集群默认采用AP方式，当集群中存在永久实例，采用CP模式，Eureka采用AP方式
```
spring:
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      discovery:
        ephemeral: false # 设置为永久实例
```
