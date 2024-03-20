###  ActiveMQ 消息确认机制
![AQ](https://fgq233.github.io/imgs/mq/activeMQ1.png)

###  一、概念
####  1. 消息确认机制
* JMS 消息只有在被确认之后，才认为已经被成功地消费了，然后ActiveMQ才会删除消息
* 消息的成功消费通常包含三个阶段：
  * 消费者接收消息
  * 消费者处理消息内容
  * 消息确认

* 在事务性会话中，当一个事务被提交的时候，确认自动发生
* 非事务性会话中，消息何时被确认取决于创建会话时的应答模式（`Acknowledgement Mode`）


####  2. ACK 类型
* `JMS` 在 `javax.jms.Session` 中定义了4 种 `ACK` 类型
  * `AUTO_ACKNOWLEDGE = 1` 自动确认（默认级别）
  
  * `CLIENT_ACKNOWLEDGE = 2` 手动确认，在一个`session`中确认一个消息将自动确认所有已被会话消费的消息
  
  * `DUPS_OK_ACKNOWLEDGE = 3` 根据内部算法，在收到一定数量的消息后批量确认（基本不使用）
  
  * `SESSION_TRANSACTED = 0` 事务提交并确认，配合事务消息的

* `ActiveMQ` 比 `JMS` 多一种 `ACK` 类型，定义在 `org.apache.activemq.ActiveMQSession` 中

  * `INDIVIDUAL_ACKNOWLEDGE= 4`  手动确认（单条消息）

####  3. 注意  
* 在事务中，消息会在事务提交时自动确认，所以要使用 `ACK` 机制，需要关闭事务
* `JmsTemplate`  不支持 `CLIENT_ACKNOWLEDGE = 2`，要支持的话需要使用 `JMS` 原生`API`


###  二、INDIVIDUAL_ACKNOWLEDGE 手动确认
####  1. 关闭事务
```
@Configuration
public class ActiveMqConfig {

    /**
     * 关闭事务的JMS监听工厂
     */
    @Bean(name = "noTxJmsListenerContainerFactory")
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory(ConnectionFactory connectionFactory) {
        DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        // 关闭事务
        factory.setSessionTransacted(false);
        //  消息确认机制：手动单条确认 4
        factory.setSessionAcknowledgeMode(ActiveMQSession.INDIVIDUAL_ACKNOWLEDGE);
        return factory;
    }

}
```

####  2. 消费者监听
```
@JmsListener(destination = "ackQueue", containerFactory = "noTxJmsListenerContainerFactory")
public void listener1(TextMessage msg) throws JMSException {
    System.out.println(msg.getText());
    // msg.acknowledge();
}
```

* 使用自定义的关闭事务JMS监听工厂
* 启动服务，一开始不调用 `acknowledge()` 方法确认


####  3. 发送消息
```
jmsMessagingTemplate.convertAndSend("ackQueue", "AckTest");
```

* 此时消费者可以消费消息，但是因为没有确认，所以 ActiveMQ 没有删除消息
* 若重启消费者服务，该消息会被重复消费


![AQ](https://fgq233.github.io/imgs/mq/activeMQ2.png)

####  4. 手动确认
放开 `msg.acknowledge()` 注释，重启服务，此时消息再次被消费，ActiveMQ 删除消息

![AQ](https://fgq233.github.io/imgs/mq/activeMQ3.png)
