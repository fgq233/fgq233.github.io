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

![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ7.png)

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


#### 3. 定义 ConfirmCallback
* 为了监测消息是否到达交换机，可以给 RabbitTemplate 设置 ConfirmCallback
* ConfirmCallback可以定义成全局的，也可以为单个消息个性化设置

```
// 全局设置
@Configuration
public class MqCommonConfig implements ApplicationContextAware {

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        RabbitTemplate template = applicationContext.getBean(RabbitTemplate.class);

        template.setConfirmCallback((correlationData, ack, cause) -> {
            String correlationId = correlationData == null ? "null" : correlationData.getId();
            Message message = correlationData == null ? null : correlationData.getReturnedMessage();
            if (ack) {
                log.info("消息到达交换机，消息ID => {}", correlationId);
            } else {
                log.info("消息未到达交换机, 消息ID => {}，原因：{}，消息内容：{}", correlationId, cause, message);
            }
        });
    }
}

String message = "Hello, Spring AMQP!";
CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
rabbitTemplate.convertAndSend("test.direct", "test", message, correlationData);
```

全局的需要对correlationData进行判空，因为发送消息时，如果没有传递一个CorrelationData对象，
回调中correlationData参数就为空

```
// 单个消息设置
String message = "Hello, Spring AMQP!";
CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
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
rabbitTemplate.convertAndSend("test.direct", "test", message, correlationData);
```

确认机制发送消息时，必须给每个消息指定一个全局唯一ID，用来区分不同消息，避免 ack 冲突



#### 4. 定义 ReturnCallback
* 处理消息投递到交换机了，但是没有路由到队列的逻辑
* 每个RabbitTemplate只能配置一个ReturnCallback，因此需要在项目加载时配置

```
@Configuration
public class MqCommonConfig  implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        RabbitTemplate template = applicationContext.getBean(RabbitTemplate.class);
        template.setReturnCallback((message, replyCode, replyText, exchange, routingKey) -> {
            // 路由失败
            log.info("消息路由失败，应答码{}，原因{}，交换机{}，路由键{}，消息{}",
                    replyCode, replyText, exchange, routingKey, message.toString());
            // 如果有业务需要，可以重发消息
            // template.convertAndSend(exchange, routingKey, message.getBody());
        });
    }
}
```
 









### 二、消费者确认机制
#### 1. 三种确认模式
RabbitMQ 通过消费者回执来确认是否成功处理消息，
在消费者获取消息后，向 RabbitMQ 发送 ack 回执，表明自己已经处理消息，
而RabbitMQ确认消息被消费后会立刻删除，这就是所谓的阅后即焚

所以可能存在这种场景：

* 1）RabbitMQ 投递消息给消费者
* 2）消费者获取消息后，返回 ack 给RabbitMQ
* 3）RabbitMQ删除消息
* 4）消费者宕机，消息尚未处理

这样消息就丢失了，因此消费者返回 ack 的时机非常重要，SpringAMQP允许配置三种确认模式：

```
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: auto # 默认就是auto
```

* **manual**：手动ack，需要在业务代码结束后，手动调用api发送ack
* **auto**：自动ack，由spring监测listener代码是否出现异常，没有异常则返回ack，抛出异常则返回nack
* **none**：关闭ack，MQ假定消费者获取消息后会成功处理，因此消息投递后立即被删除（不可靠，可能丢失消息）

> 默认模式为auto，使用了 Spring 的retry 重试机制，消费失败后， 消息会不断requeue（重新入队）到队列，
再重新发送给消费者， 然后再次异常，再次requeue， 无限循环，直到消费成功，
所以使用默认模式 auto，重试机制一定要有相关配置



#### 2. 重试机制配置
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
 
默认重试机制策略为`RejectAndDontRequeueRecoverer`，添加如上配置后，在重试达到最大次数后，如果还是失败的，
会抛出异常 `AmqpRejectAndDontRequeueException`， 此时返回ack，mq删除消息



#### 3. 重试策略
重试策略可以通过 `MessageRecovery接口`来定制，它包含三种策略：

* `RejectAndDontRequeueRecoverer`：重试耗尽后，直接reject，丢弃消息，默认就是这种方式

* `ImmediateRequeueMessageRecoverer`：重试耗尽后，返回nack，消息重新入队

* `RepublishMessageRecoverer`：重试耗尽后，消费者将失败消息投递到指定的交换机


推荐方案是`RepublishMessageRecoverer`，失败后将消息投递到一个指定的专门存放异常消息的队列

![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ8.png)


```
@Configuration
public class ErrorMsgConfig {

    private static String errorExchange = "error.direct";
    private static String errorQueue = "error.queue";
    private static String errorRoutingKey = "error.routing.key";
    
    // 定义专门处理的交换机
    @Bean
    public DirectExchange errorExchange(){
        return new DirectExchange(errorExchange);
    }
    
    // 定义专门处理的队列
    @Bean
    public Queue errorQueue(){
        return new Queue(errorQueue);
    }

    // 绑定队列和交换机
    @Bean
    public Binding errorMsgBinding(){
        return BindingBuilder.bind(errorQueue()).to(errorExchange()).with(errorRoutingKey);
    }

    // 定义失败重试策略
    @Bean
    public MessageRecoverer republishMessageRecoverer(RabbitTemplate rabbitTemplate){
        return new RepublishMessageRecoverer(rabbitTemplate, errorExchange, errorRoutingKey);
    }
}
```
  
上面达到最大重试次数后，若还是失败，会将消息发送到交换机 error.direct 交换机上

#### 4. 使用手动模式 manual
当 `acknowledge-mode` 配置为 `manual` 手动模式后，就需要消费者手动控制 `ack` 

```
/**
 * deliveryTag 消息投递序号
 * multiple 是否批量应答，值为 true则会一次性 ack/ nack所有小于当前消息deliveryTag的消息
 * requeue 是否重新入队，值为 true表示重新投入队列中，为false 时消息丢弃，变成死信
 */

// 成功消费，返回ack，消息会被 mq 删除             
void basicAck(long deliveryTag, boolean multiple) 

// 失败消费，返回nack，根据 requeue 决定是否重新入队
void basicNack(long deliveryTag, boolean multiple, boolean requeue)

// 拒绝消息，根据 requeue 决定是否重新入队，和 basicNack 很像，只不过不能批量处理
void basicReject(long deliveryTag, boolean requeue)



@Component
@RabbitListener(queues = "test.manual")
public class Receiver {

    @RabbitHandler
    public void testManual(Channel channel, Message message) {
        try {
            // 业务逻辑
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e){
            // 业务逻辑
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false,  true);
        }
    }
}
```


* 死循环问题：如果代码有异常且设置了重新入队，就会造成下面这种死循环：
异常 > nack > 重新入队 > 异常 > nack > 重新入队 .....

* 所以一定不能一直入队，可以通过 `message.getMessageProperties().getRedelivered()` 判断，
该方法表示是否是重复投递，首次为false，第二次为true，所以解决方式可以这样：

```
@RabbitHandler
public void testManual(Channel channel, Message message) throws IOException {
    try {
        // ...业务逻辑
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    } catch (Exception e) {
        if (message.getMessageProperties().getRedelivered()) {
            // 消息已重复处理失败, 拒绝接受消息, 消息变为死信
            // 此处可以将异常数据记录在数据库中
            channel.basicReject(message.getMessageProperties().getDeliveryTag(), false);
        } else {
            // 返回 nack, 重新入队
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }
}
```

 
