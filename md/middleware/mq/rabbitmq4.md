###  RabbitMQ 消息持久化
* 因为 RabbitMQ 默认是内存存储，如果宕机的话，存储在队列中的消息会丢失，所以需要将消息持久化
* 确保消息在RabbitMQ中安全保存，必须开启消息持久化机制
    * 交换机持久化
    * 队列持久化
    * 消息持久化

### 一、交换机持久化
#### 1. RabbitMQ 控制台
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ6.png)

* Features 带上 `D` 标示的交换机都是持久化的，在重启后不会丢失
* 在控制台创建交换机时，将 `Durability` 属性设置为 `Durable`，那么就是一个持久化的交换机

#### 2. java 代码中
* 在创建交换机时有3个参数：交换机名称、是否持久化、当没有queue与其绑定时是否自动删除
* 下列2种方式效果一致，因为1个参数创建时，其源码中默认后2个参数是 true、false 

```
@Bean
public DirectExchange simpleDirect(){
    return new DirectExchange("simple.direct", true, false);
}

@Bean
public DirectExchange simpleDirect(){
    return new DirectExchange("simple.direct");
}
```



### 二、队列持久化
#### 1. RabbitMQ 控制台
和交换机一致，队列在创建时也是通过将 `Durability` 属性设置为 `Durable` 进行持久化

#### 2. java 代码中
下列三种方式创建的队列都是持久化的，都是将 durable 设置为 true

```
@Bean
public Queue simpleQueue(){
    return new Queue("simple.queue");
}

@Bean
public Queue simpleQueue(){
    return new Queue("simple.queue", true);
}

@Bean
public Queue simpleQueue(){
    return QueueBuilder.durable("simple.queue").build();
}
```



### 三、消息持久化
SpringAMQP发送消息时，可以设置消息的属性 `MessageProperties`，指定 `delivery-mode`
* 非持久化: MessageDeliveryMode.NON_PERSISTENT
* 持久化:  MessageDeliveryMode.PERSISTENT

```
// 1.准备消息
Message message = MessageBuilder.withBody("Hello!".getBytes(StandardCharsets.UTF_8))
        .setDeliveryMode(MessageDeliveryMode.PERSISTENT)
        .build();
// 2.发送消息
rabbitTemplate.convertAndSend("simple.queue", message);
```


PS: 默认情况下，SpringAMQP发出的任何消息都是持久化的，不用特意指定

