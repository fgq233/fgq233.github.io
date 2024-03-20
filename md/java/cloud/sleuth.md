## Spring Cloud Sleuth：分布式请求链路跟踪
随着系统越来越庞大，各个服务间的调用关系也变得越来越复杂，当客户端发起一个请求时，这个请求经过多个服务后，
最终返回了结果，经过的每一个服务都有可能发生延迟或错误，从而导致请求失败。
这时候就需要请求链路跟踪工具来帮助我们，理清请求调用的服务链路，解决问题

### 一、Sleuth 与 Zipkin
#### 1. Sleuth 作用
将一次分布式请求还原成调用链路，进行日志记录，性能监控

#### 2. Zipkin 作用
* Zipkin 可以用来获取和分析 Sleuth 中产生的请求链路跟踪日志，
并提供了UI界面来直观地查看请求链路跟踪信息
* Zipkin 提供了可插拔数据存储方式：In-Memory(内存)、MySql、Cassandra、ES

### 二、集成Sleuth与Zipkin
Zipkin分为服务端、客户端
* 客户端：在微服务应用中配置 Sleuth 的监听器监听、服务端URL 地址
* 服务端：接收客户端发送的信息

一旦发生服务间的调用，会被Sleuth监听到，并生成相应的 Trace 和 Span 信息发送给服务端

#### 1. 下载、启动 zipkin 服务端
* 下载地址：[https://repo1.maven.org/maven2/io/zipkin/zipkin-server](https://repo1.maven.org/maven2/io/zipkin/zipkin-server)
* 找到目标版本，点进去后找到 `zipkin-server-x.y.z-exec.jar`的jar包
* `java -jar`启动服务端，默认端口 9411，启动成功后通过 [http://localhost:9411](http://localhost:9411) 访问服务端 UI 界面

``` 
java -jar zipkin-server-2.21.7-exec.jar
java -jar zipkin-server-2.21.7-exec.jar -server.port=8088 

# 默认存放在内存中，把跟踪信息存储到 Elasticsearch里面，重新启动后也不会丢失
java -jar zipkin-server-2.21.7-exec.jar --STORAGE_TYPE=elasticsearch --ES_HOSTS=localhost:9200 
```

#### 2. 添加依赖
```
<!--包含了sleuth + zipkin-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
</dependency>
```

#### 3. yml配置
```
spring:
  zipkin:
    base-url: http://127.0.0.1:9411
  sleuth:
    sampler:
      probability: 1      # 设置Sleuth的抽样收集概率，采样率值介于0到1之间，1表示全部采集
```

#### 4. 测试
启动服务，随意调用一个接口，在 zipkin UI 界面查看请求链路跟踪信息
