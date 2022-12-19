###  RabbitMQ 消息确认机制
消息从发送到消费者接收会经历多个过程，其中的每一步都可能导致消息丢失，常见的丢失原因包括：
* 发送时丢失：                  
  * 生产者发送的消息未送达exchange
  * 消息到达exchange后未到达queue
* MQ宕机，queue将消息丢失----------------可以通过MQ持久化保证消息不会丢失
* consumer接收到消息后未消费就宕机

针对这些问题，RabbitMQ分别给出了解决方案：

- 发送时：生产者确认机制
- 消费时：消费者确认机制、失败重试机制

![RabbitMQ](https://fgq233.github.io/imgs/other/rabbitMQ7.png)

### 一、生产者确认机制
#### 1. 过程
* RabbitMQ 提供了publisher confirm机制来避免消息发送到MQ过程中丢失，
消息发送到MQ以后，会返回一个结果给发送者，表示消息是否处理成功，返回结果有两种方式

* `publisher-confirm`，发送者确认
  * 消息成功投递到交换机，返回 `ack`
  * 消息未投递到交换机，返回 `nack`
* `publisher-return`，发送者回执
  * 消息投递到交换机了，但是没有路由到队列，返回 `ack`，及路由失败原因 `publisher return`
  
  
  
#### 2. yml添加配置，开启确认机制 
```yaml
spring:
  rabbitmq:
    publisher-confirm-type: correlated
    publisher-returns: true
    template:
      mandatory: true
```

* `publish-confirm-type`：开启publisher-confirm，支持两种类型：
  * `simple`：同步等待confirm结果，直到超时
  * `correlated`：异步回调，定义ConfirmCallback，MQ返回结果时会回调这个ConfirmCallback
  
* `publish-returns`：开启publish-return功能，同样是基于callback机制，不过是定义ReturnCallback

* `template.mandatory`：定义消息路由失败时的策略，true调用ReturnCallback，false则直接丢弃消息


#### 3. 生产者服务中定义 ReturnCallback
* 每个RabbitTemplate只能配置一个ReturnCallback，因此需要在项目加载时配置
* 处理消息投递到交换机了，但是没有路由到队列的逻辑

```java
@Configuration
public class MqReturnConfig implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        // 获取RabbitTemplate
        RabbitTemplate rabbitTemplate = applicationContext.getBean(RabbitTemplate.class);
        // 设置ReturnCallback
        rabbitTemplate.setReturnCallback((message, replyCode, replyText, exchange, routingKey) -> {
            // 投递失败，记录日志
            log.info("消息发送失败，应答码{}，原因{}，交换机{}，路由键{},消息{}",
                     replyCode, replyText, exchange, routingKey, message.toString());
            // 如果有业务需要，可以重发消息
        });
    }
}
```
 
#### 4. 定义 ConfirmCallback
* ConfirmCallback需要在发送消息时指定，因为每个业务处理confirm成功或失败的逻辑不一定相同

```
// 1.消息体
String message = "Hello, Spring AMQP!";
// 2.全局唯一的消息ID，需要封装到CorrelationData中
CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
// 3.添加callback
correlationData.getFuture().addCallback(
    result -> {
        if(result.isAck()){
            // ack：消息成功
            log.debug("消息发送成功, ID:{}", correlationData.getId());
        } else{
            // nack：消息失败
            log.error("消息发送失败, ID:{}, 原因{}",correlationData.getId(), result.getReason());
        }
    },
    ex -> log.error("消息发送异常, ID:{}, 原因{}",correlationData.getId(),ex.getMessage())
);
// 4.发送消息
rabbitTemplate.convertAndSend("test.direct", "test", message, correlationData);
```
  
* 确认机制发送消息时，必须给每个消息指定一个全局唯一ID，用来区分不同消息，避免 ack 冲突








### 二、消费者确认机制
#### 1. 三种确认模式
* RabbitMQ 通过消费者回执来确认是否成功处理消息，
在消费者获取消息后，向 RabbitMQ 发送 ack 回执，表明自己已经处理消息，
而RabbitMQ确认消息被消费后会立刻删除，这就是所谓的阅后即焚

所以可能存在这种场景：

* 1）RabbitMQ 投递消息给消费者
* 2）消费者获取消息后，返回 ack 给RabbitMQ
* 3）RabbitMQ删除消息
* 4）消费者宕机，消息尚未处理

这样消息就丢失了，因此消费者返回ACK的时机非常重要，SpringAMQP则允许配置三种确认模式：

```
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: auto # 默认就是auto
```

* manual：手动ack，需要在业务代码结束后，手动调用api发送ack
* auto：自动ack，由spring监测listener代码是否出现异常，没有异常则返回ack，抛出异常则返回nack
* none：关闭ack，MQ假定消费者获取消息后会成功处理，因此消息投递后立即被删除（不可靠，可能丢失消息）

一般使用默认的auto即可



#### 2. 消费失败重试机制
* 当消费者出现异常后，消息会不断requeue（重入队）到队列，再重新发送给消费者，
然后再次异常，再次requeue，无限循环，导致mq的消息处理飙升，带来不必要的压力

* 可以利用 Spring 的retry机制，在消费者出现异常时利用本地重试，而不是无限制的requeue到mq队列

修改消费者服务的 application.yml文件，添加内容：

```
spring:
  rabbitmq:
    listener:
      simple:
        retry:
          enabled: true             # 开启消费者失败重试
          initial-interval: 1000ms  # 初识的失败等待时长为1秒
          multiplier: 1             # 失败的等待时长倍数，下次等待时长 = multiplier * last-interval
          max-attempts: 3           # 最大重试次数
          stateless: true           # 默认值为true无状态，false是有状态，如果业务中包含事务，这里改为false
```
 
* 在重试达到最大次数后，如果还是失败的，SpringAMQP 默认会抛出异常 AmqpRejectAndDontRequeueException，
此时返回ack，mq删除消息



#### 3. 重试策略
在开启重试模式后，重试次数耗尽，如果消息依然失败，则需要有`MessageRecovery接口`来处理，它包含三种策略：

* `RejectAndDontRequeueRecoverer`：重试耗尽后，直接reject，丢弃消息，默认就是这种方式

* `ImmediateRequeueMessageRecoverer`：重试耗尽后，返回nack，消息重新入队

* `RepublishMessageRecoverer`：重试耗尽后，将失败消息投递到指定的交换机


推荐方案是`RepublishMessageRecoverer`，失败后将消息投递到一个指定的专门存放异常消息的队列，
后续由人工集中处理

```
@Configuration
public class ErrorMsgConfig {
    
    // 定义专门处理的交换机
    @Bean
    public DirectExchange errorExchange(){
        return new DirectExchange("error.direct");
    }
    
    // 定义专门处理的队列
    @Bean
    public Queue errorQueue(){
        return new Queue("error.queue");
    }

    // 绑定队列和交换机
    @Bean
    public Binding errorMsgBinding(){
        return BindingBuilder.bind(errorQueue()).to(errorExchange()).with("error");
    }

    // 定义失败重试策略
    @Bean
    public MessageRecoverer republishMessageRecoverer(RabbitTemplate rabbitTemplate){
        return new RepublishMessageRecoverer(rabbitTemplate, "error.direct", "error");
    }
}
```
  
* 上面达到最大重试次数后，若还是失败，会将消息发送到交换机 error.direct 交换机上