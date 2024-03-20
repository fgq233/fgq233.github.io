### TTL 与 死信

###  一、TTL
####  1. 概念
* Time-To-Live，存活时间
* 可以给队列、单个消息设置TTL
    * 队列TTL：当前队列中所有的消息过期时间都一样
    * 单个消息TTL：单个消息的过期时间
* 队列中的消息如果超时未消费，则会变为死信，当队列、消息都设置了TTL时，任意一个到期就会成为死信

####  2. 消息设置TTL
```
Message message = MessageBuilder
        .withBody("Hello, SpringAMQP!".getBytes(StandardCharsets.UTF_8))
        .setExpiration("5000")   // 设置消息的超时时间，5秒
        .build();
```

`setExpiration` 方法设置TTL


####  3. 队列设置TTL
```
@Bean
public Queue ttlQueue(){
    return QueueBuilder.durable("ttl.queue") 
        .ttl(5000) // 设置队列的超时时间，5秒
        .build();
}
```

`ttl()` 方法本质是 添加了 `x-message-ttl` 属性



###  二、死信
#### 1. 概念
当一个队列中的消息满足下列情况之一时，就成为死信 (`dead letter`)：

* 超过 TTL 时间，消息超时无人消费
* 消费者使用 `basic.reject` 或 `basic.nack` 声明消费失败，并且 `requeue=false`，不再重新入队
* 消息队列满了，无法投递，最早的消息就可能成为死信


#### 2. 死信交换机、死信队列
* 如果包含死信的队列配置了`dead-letter-exchange`属性，指定了一个交换机，
那么队列中的死信就会投递到这个交换机中，而这个交换机称为死信交换机 (`Dead Letter Exchange`，简称DLX)

* 如果死信交换机也绑定了一个队列，则消息最终会进入这个存放死信的队列

![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ9.png)


#### 3. 定义死信交换机、死信队列
* 在失败重试策略中，默认的策略`RejectAndDontRequeueRecoverer`会在本地重试次数耗尽后，
发送`reject`给`RabbitMQ`，消息变成死信，被丢弃

* 此时可以使用 `deadLetterExchange()` 定义死信交换机、死信队列，这样消息变成死信后也不会丢弃，
而是最终投递到死信交换机，路由到死信队列

```
// 声明普通的队列，并且为其指定死信交换机：dl.direct
@Bean
public Queue simpleQueue2(){
    return QueueBuilder.durable("simple.queue") 
        .deadLetterExchange("dl.direct")    // 指定死信交换机
        .build();
}

// 声明死信交换机 dl.direct
@Bean
public DirectExchange dlExchange(){
    return new DirectExchange("dl.direct");
}

// 声明存储死信的队列 dl.queue
@Bean
public Queue dlQueue(){
    return new Queue("dl.queue", true);
}

// 将死信队列与死信交换机绑定
@Bean
public Binding dlBinding(){
    return BindingBuilder.bind(dlQueue()).to(dlExchange()).with("dl");
}
```

* 最后只要给死信队列定义消费者，就能重新消费死信了
* 这个逻辑和重试策略 `RepublishMessageRecoverer` 很像，不同的是死信是队列投递的，
而 `RepublishMessageRecoverer` 的消息是消费者投递的



### 三. TTL + 死信交换机实现消息延迟的效果
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ10.png)

当消息TTL超时未被消费(`没有消费者`)，成为死信，投递到死信交换机、路由到死信队列，被死信队列的消费者消费，
达到消息延迟的效果


#### 1. 声明死信交换机、死信队列
在`consumer`服务中，定义一个新的消费者，声明死信交换机、死信队列

```
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "dl.ttl.queue", durable = "true"),
    exchange = @Exchange(name = "dl.ttl.exchange"),
    key = "dl"
))
public void listenDlQueue(String msg){
    log.info("接收到延迟消息：{}", msg);
}
```


#### 2. 声明普通交换机、队列，并且指定TTL、死信交换机 
```
@Bean
public Queue ttlQueue(){
    return QueueBuilder.durable("ttl.queue") 
        .ttl(5000) // 设置队列的超时时间，5秒
        .deadLetterExchange("dl.ttl.exchange") // 指定死信交换机
        .deadLetterRoutingKey("dl")            // 死信交换机 RoutingKey
        .build();
}

@Bean
public DirectExchange ttlExchange(){
    return new DirectExchange("ttl.direct");
}
@Bean
public Binding ttlBinding(){
    return BindingBuilder.bind(ttlQueue()).to(ttlExchange()).with("ttl");
}
```
 
#### 3. 发送消息 
```
String msg = "Hello, ttl queue";
CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
rabbitTemplate.convertAndSend("ttl.direct", "ttl", msg, correlationData);
```





