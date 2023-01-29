####  1、MQ
 MQ （MessageQueue）：消息队列，存放消息的队列，开发中常用的MQ技术如下
 
|            | **RabbitMQ**            | **ActiveMQ**                   | **RocketMQ** | **Kafka**  |
| ---------- | ----------------------- | ------------------------------ | ------------ | ---------- |
| 公司/社区  | Rabbit                  | Apache                         | 阿里         | Apache     |
| 开发语言   | Erlang                  | Java                           | Java         | Scala&Java |
| 协议支持   | AMQP，XMPP，SMTP，STOMP | OpenWire,STOMP，REST,XMPP,AMQP | 自定义协议   | 自定义协议 |
| 可用性     | 高                      | 一般                           | 高           | 高         |
| 单机吞吐量 | 一般                    | 差                             | 高           | 非常高     |
| 消息延迟   | 微秒级                  | 毫秒级                         | 毫秒级       | 毫秒以内   |
| 消息可靠性 | 高                      | 一般                           | 高           | 一般       |



####  2、AMQP
* AMQP：Advanced Message Queuing Protocol，一个提供统一消息服务的应用层标准高级消息队列协议，
是应用层协议的一个开放标准，为面向消息的中间件设计
* 该协议与语言、平台无关

####  3、Spring AMQP
基于AMQP协议封装的一套API规范，十分方便


* 自动声明队列、交换机及其绑定关系

* 基于注解的监听器模式，异步接收消息

* 封装了模板Template工具，用于发送消息 