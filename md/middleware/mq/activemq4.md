###  ActiveMQ 消息事务
* 消息事务，是保证消息传递原子性的一个重要特征，和JDBC的事务特征类似
* 一个事务性发送，其中一组消息要么全部成功发送，要么全部失败
* 生产者、消费者都支持事务，ActionMQ 的事务主要偏向在生产者的应用


###  一、生产者：未开启事务
``` 
for (int i = 0; i < 10; i++) {
    if (i == 8) {
        int x = 1 / 0;
    }
    jmsMessagingTemplate.convertAndSend("txQueueX", "Hello ActiveMQ");
}
```
 
因为未添加事务，前8条消息会成功发送，后2条消息因为异常发送失败
 
 
 
###  二、生产者：开启事务
```
/**
 *  @Transactional 对消息发送加入事务管理，同时也对数据库的事务生效
 */
@Transactional
public void test() {
    for (int i = 0; i < 10; i++) {
        if (i == 8) {
            int x = 1 / 0;
        }
        jmsMessagingTemplate.convertAndSend("txQueueX", "Hello ActiveMQ");
    }
}
```
 
 
 
 
###  三、消费者事务
```
// 生产者
jmsMessagingTemplate.convertAndSend("txQueueX", "Hello ActiveMQ");

// 消费者
@JmsListener(destination = "test.queueX")
public void listener3(String msg, Session session) throws JMSException {
    try {
        System.out.println(msg);
        int i = 1 / 0;
        session.commit();
    } catch (Exception e) {
        session.rollback();
    }
}
```

* 此处打印了7次消息
* 如果在消费者异常了，消息会重发，最高重发6次，如果还是失败，消息进入死信队列 `ActiveMQ.DLQ`
