####  1、lucene 索引结构图
lucene 在存储它的全文索引结构时，是有层次结构的，这涉及到5个层次：
![RabbitMQ](https://fgq233.github.io/imgs/other/lucene1.png)


索引(Index)；段(Segment)；文档(Document)；域(Field)；词(Term)，他们的关系如下图所示：（lucene 索引存储结构概念图）


####  2、AMQP
* AMQP：Advanced Message Queuing Protocol，一个提供统一消息服务的应用层标准高级消息队列协议，
是应用层协议的一个开放标准，为面向消息的中间件设计
* 该协议与语言、平台无关

####  3、Spring AMQP
基于AMQP协议封装的一套API规范，十分方便


* 自动声明队列、交换机及其绑定关系

* 基于注解的监听器模式，异步接收消息

* 封装了模板Template工具，用于发送消息 