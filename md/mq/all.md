### 一、常用 MQ 中间件 
####  1、MQ
 `MQ （MessageQueue）`：消息队列，存放消息的队列
 
####  2、MQ 中间件 
|            | **RabbitMQ**            | **ActiveMQ**            | **RocketMQ** | **Kafka**  |
| ---------- | ----------------------- | ----------------------- | ---------- | ---------- |
| 公司/社区  | Rabbit                  | Apache                   | 阿里       | Apache     |
| 开发语言   | Erlang                  | Java                     | Java      | Scala&Java |
| 协议支持   | AMQP、XMPP、STOMP、SMTP | AMQP、XMPP、STOMP、REST   | 自定义协议 | 自定义协议 |
| 单机吞吐量 | 一般                    | 差                       | 高        | 非常高     |
| 消息延迟   | 微秒级                  | 毫秒级                   | 毫秒级     | 毫秒级  |
| 消息可靠性 | 高                      | 一般                    | 高        | 一般       |


### 二、相关概念
####  1、JMS 
* `JMS：Java Message Service`，Java消息服务，是Java平台中关于面向消息中间件（MOM）的API

JMS两种消息模型
*  `P2P (Point to Point) `点对点模型
   * `每个消息只有一个消费者`
   * `如果没有被消费，就会在中间件中一直等待，直到被消费`
   * `接受者确认消息接受和处理成功`
   
*  `Pub/Sub (Publish/Subscribe)` 发布/订阅模型
   * `每个次消息可以有多个消费者`
   * `只有订阅后才能接收消息`
   * `消费者如果在生产者发送消息之后启动，之前的消息是接收不到的，除非对消息进行了持久化`



####  2、AMQP 协议
* `AMQP：Advanced Message Queuing Protocol`，一个提供统一消息服务的应用层标准高级消息队列协议，
是应用层协议的一个开放标准，为面向消息的中间件设计

* 该协议与语言、平台无关

* `Spring AMQP`：`Spring` 家族基于AMQP协议封装的一套API规范，十分方便
  * `自动声明队列、交换机及其绑定关系`
  * `基于注解的监听器模式，异步接收消息`
  
   
