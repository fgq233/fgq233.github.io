###  RabbitMQ 使用步骤
###  一、RabbitMQ中的角色
* publisher：生产者，消息发布者，将消息发送到队列queue
* consumer：消费者，订阅队列，处理队列中的消息
* exchange：交换机，负责消息路由
* queue：队列，负责接受并缓存消息
* virtualHost：虚拟主机，隔离不同租户的exchange、queue、消息的隔离
 

![RabbitMQ](https://fgq233.github.io/imgs/other/rabbitMQ.png)



###  二、官方demo
* RabbitMQ官方提供了 7 个入门demo，前5个与消息发送接收有关，对应了不同的消息模型，
这5个在Spring AMQP中都可以实现
* [官方demo](https://rabbitmq.com/getstarted.html)

| **消息模型**| **说明**  |
| ---------- | --------- |
| Hello World | 基本消息队列 |
| Work Queues | 工作消息队列 |
| Publish/Subscribe | 发布订阅模型，跟据交换机又分为三类Fanout Exchange、Direct Exchange、Topic Exchange |
| --- | --- |
| Fanout | 广播 |
| Direct | 路由 |
| Topics | 主题 |

###  三、SpringAMQP 中 RabbitMQ使用步骤
#### 1、安装 erl、rabbitmq
* 安装 erl，同时将 bin目录 配到环境变量
* 安装 rabbitmq，同时将 sbin目录 配到环境变量，rabbitmqctl status 命令检测是否安装成功，安装成功会自动注册为服务
* RabbitMQ服务端默认端口是：5672
* RabbitMQ图形界面默认端口是：15672，默认用户名密码都是 guest，使用前需要开启

```
rabbitmq-plugins.bat enable rabbitmq_management
```
* RabbitMQ图形界面创建用户，同时分配虚拟主机权限，然后重启 RabbitMQ 服务



#### 2、引入依赖
生产者、消费者都需要引入，如果是聚合项目，直接放在父pom中

```
<!--AMQP依赖，包含RabbitMQ-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

#### 3、yml配置
生产者、消费者都需要配置

```
spring:
  rabbitmq:
    host: 127.0.0.1     # 主机名
    port: 5672          # 端口
    virtual-host: /     # 虚拟主机
    username: fgq       # 用户名
    password: 123456    # 密码
```
 
 
#### 4、声明队列、交换机(跟据需求可选)

#### 5、发送消息

#### 6、监听消息

