###  SpringAMQP 中 RabbitMQ五种消息模型

####  1、基本消息队列
![RabbitMQ](https://fgq233.github.io/imgs/other/rabbitMQ1.png)

官方的HelloWorld是基于最基础的消息队列模型来实现的，只包括三个角色：
publisher：消息发布者，将消息发送到队列queue
queue：消息队列，负责接受并缓存消息
consumer：订阅队列，处理队列中的消息
