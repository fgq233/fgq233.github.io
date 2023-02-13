### 延迟队列
* 利用TTL结合死信交换机，实现消息发出后，消费者延迟收到消息的效果，这种消息模式就称为延迟队列（Delay Queue）
* RabbitMQ的官方也推出了一个插件 `DelayExchange` ，原生支持延迟队列效果

####  1. 下载安装
* `rabbitmq` 官方插件社区：[https://www.rabbitmq.com/community-plugins.html](https://www.rabbitmq.com/community-plugins.html)
* 延迟插件地址：[https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases)
* 下载完成后，将该插件放在`rabbitmq` 安装路径的 plugins 目录下，然后执行下述命令启用该插件

```
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```


####  2. 使用步骤
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ11.png)
 
* DelayExchange 插件原理是对官方原生 Exchange 功能的升级
    * 将 DelayExchange 接收到的消息暂存在内存中（官方 Exchange 无法存储消息）
    * 在 DelayExchange 中计时，超时后投递到消息队列

* 使用步骤分为2步：
    * 创建一个延时交换机
    * 发消息时，添加一个 Headers，`x-delay`，决定延时时间
 
 
#### 3. `DelayExchange` 原理
DelayExchange需要将一个交换机声明为delayed类型，当发送消息到delayExchange时，流程如下：

* DelayExchange 接收消息
* 判断消息是否具备x-delay属性
* 如果有x-delay属性，说明是延迟消息，持久化到硬盘，读取x-delay值，作为延迟时间
* 返回routing not found结果给消息发送者
* x-delay时间到期后，重新投递消息到指定队列

 
####  4. 使用
基于注解方式：唯一区别是多了个 `delayed = "true"`

```
@RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "delay.queue", durable = "true"),
            exchange = @Exchange(name = "delay.direct", delayed = "true"),
            key = "delay"
    ))
public void listenDelayExchange(String msg) {
    log.info("消费者接收到了delay.queue的延迟消息");
}
```


基于java代码方式：唯一区别是多了个 `delayed()`

```
@Configuration
public class DelayMsgConfig {

    @Bean
    public DirectExchange delayExchange() {
        return ExchangeBuilder
                .directExchange("delay.direct")
                .delayed()
                .durable(true)
                .build();
    }

    @Bean
    public Queue delayQueue() {
        return new Queue("delay.queue");
    }

    @Bean
    public Binding delayMessageBinding() {
        return BindingBuilder.bind(delayQueue()).to(delayExchange()).with("delay");
    }

}
```


发送消息时：`setHeader("x-delay", 5000)`

```
Message message = MessageBuilder
        .withBody("Hello".getBytes(StandardCharsets.UTF_8))
        .setDeliveryMode(MessageDeliveryMode.PERSISTENT)
        .setHeader("x-delay", 5000)
        .build();
CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
rabbitTemplate.convertAndSend("delay.direct", "delay", message, correlationData);
```


####  5. 与 Return CallBck 兼容
`DelayExchange` 是把消息放在交换机存储，没有立即发送到队列，
所以 Return CallBck 会收到路由失败结果，通过下列判断兼容：

```
rabbitTemplate.setReturnCallback((message, replyCode, replyText, exchange, routingKey) -> {
    // 判断是否是延迟消息，是的话忽略这个错误提示
    Integer receivedDelay = message.getMessageProperties().getReceivedDelay();
    if (receivedDelay != null && receivedDelay > 0) {
        return;
    }
   ......
});
```
