### 一、常用 MQ 中间件 
####  1、MQ
 `MQ （MessageQueue）`：消息队列，存放消息的队列
 
####  2、常用 MQ 中间件 
* RabbitMQ：Erlang 语言开发，并发能力非常好、延时很低

* RocketMQ：Java 语言开发，阿里产品，默认就支持分布式结构，高可用

* Kafka：Scala 语言开发，默认就支持分布式结构，在大数据中应用比较广

* ActiveMQ：Java 语言开发，比较早的 MQ 中间件，性能一般 

####  3、性能对比
* 单机吞吐量：`Kafka > RocketMQ > RabbitMQ、ActiveMQ`
* 时效性：`RabbitMQ  > ActiveMQ、RocketMQ、Kafka`


### 二、JMS
####  1、说明 
`JMS：Java Message Service`，Java消息服务，是Java平台中关于面向消息中间件（MOM）的API

![jms](https://fgq233.github.io/imgs/mq/jms.png)

####  2、JMS两种消息模型
*  `P2P (Point to Point) `点对点模型
   * `每个消息只有一个消费者`
   * `如果没有被消费，就会在中间件中一直等待，直到被消费`
   * `接受者确认消息接受和处理成功`
   
*  `Pub/Sub (Publish/Subscribe)` 发布/订阅模型
   * `每个消息可以有多个消费者`
   * `只有订阅后才能接收消息`
   * `消费者如果在生产者发送消息之后启动，之前的消息是接收不到的，除非对消息进行了持久化`


### 三、AMQP 协议
* `AMQP：Advanced Message Queuing Protocol`，一个提供统一消息服务的应用层标准高级消息队列协议，
是应用层协议的一个开放标准，为面向消息的中间件设计

* 该协议与语言、平台无关

* `Spring AMQP`：`Spring` 家族基于AMQP协议封装的一套API规范，十分方便
  * `自动声明队列、交换机及其绑定关系`
  * `基于注解的监听器模式，异步接收消息`

![AMQP](https://fgq233.github.io/imgs/mq/amqp.png) 
