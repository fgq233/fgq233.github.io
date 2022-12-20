### TTL 与 死信

###  一、TTL
####  1. 概念
* Time-To-Live，存活时间
* 在准备消息时，或者声明队列时，可以设置TTL

####  2. 准备消息时：设置TTL
```
Message message = MessageBuilder
        .withBody("Hello, SpringAMQP!".getBytes(StandardCharsets.UTF_8))
        .setExpiration("5000")
        .build();
```

* `setExpiration` 方法设置TTL


####  3. 声明队列时：设置TTL
```
@Bean
public Queue ttlQueue(){
    return QueueBuilder.durable("ttl.queue") 
        .ttl(10000) // 设置队列的超时时间，10秒
        .build();
}
```


###  二、死信
#### 1. 概念
当一个队列中的消息满足下列情况之一时，就成为死信 (`dead letter`)：

* 超过 TTL 时间，消息超时无人消费
* 消费者使用 `basic.reject` 或 `basic.nack` 声明消费失败，并且消息的 `requeue` 参数设置为 `false`
* 消息队列满了，无法投递，最早的消息就可能成为死信


#### 2. 死信交换机
* 如果包含死信的队列配置了`dead-letter-exchange`属性，指定了一个交换机，
那么队列中的死信就会投递到这个交换机中，而这个交换机称为死信交换机 (`Dead Letter Exchange`，简称DLX)

![RabbitMQ](https://fgq233.github.io/imgs/other/rabbitMQ9.png)

