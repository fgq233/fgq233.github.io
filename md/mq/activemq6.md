###  ActiveMQ 死信队列
`DLQ-Dead Letter Queue`，死信队列，用来保存处理失败或者过期的消息

###  一、概念
####  1. 死信队列
在下面 3 种情况，会造成消息重发
* 在事务消息中，调用了 `session.rollback() `
* 在事务消息中，未调用 `session.commit() `
* 在非事务消息手动模式中，调用 `session.recover()`

当一个消息被重发超过6次数时，`broker`会将这个消息发送到死信队列

####  2. 注意
* 持久化消息过期，才会被送到死信队列，非持久消息不会送到DLQ
* 默认死信队列名称是 `ActiveMQ.DLQ`
* 使用 `Message` 的 `getJMSRedelivered()` 方法判断是否重发的消息，重发消息为true，首次为false

###  二、测试
#### 1. 三种死信情况
```
@JmsListener(destination = "deadQueue1")
public void listener1(TextMessage msg, Session session) throws JMSException {
    System.out.println(msg.getText());
    session.rollback();
}

@JmsListener(destination = "deadQueue2")
public void listener2(TextMessage msg, Session session) throws JMSException {
    System.out.println(msg.getText());
    int i = 1 / 0;
    session.commit();
}

@JmsListener(destination = "deadQueue3", containerFactory = "noTxJmsListenerContainerFactory")
public void listener3(TextMessage msg, Session session) throws JMSException {
    System.out.println(msg.getText());
    session.recover();
}
```

#### 2. 发送消息
```
jmsMessagingTemplate.convertAndSend("deadQueue1", "session.rollback()");
jmsMessagingTemplate.convertAndSend("deadQueue2", "session not commit()");
jmsMessagingTemplate.convertAndSend("deadQueue3", "session.recover()");
```


###  三、配置自己的死信队列
* 默认死信队列名称是 `ActiveMQ.DLQ`，所有死信都会发到这个队列
* 修改 `activemq.xml` 配置可以自定义死信队列名称
* 定义重发策略类覆盖默认重发策略

#### 1. 自定义死信队列名称
```
<beans>
	
    <broker brokerName="localhost" dataDirectory="${activemq.data}">

        <destinationPolicy>
            <policyMap>
              <policyEntries>
              
                 <!-- 自定义死信队列 -->
                <policyEntry queue=">">
                    <deadLetterStrategy>
                    	<individualDeadLetterStrategy queuePrefix="DLQ." useQueueForQueueMessages="true" />
                    </deadLetterStrategy>
                </policyEntry>
			  
                <policyEntry topic=">" >
                  <pendingMessageLimitStrategy>
                    <constantPendingMessageLimitStrategy limit="1000"/>
                  </pendingMessageLimitStrategy>
                </policyEntry>
				
				
              </policyEntries>
            </policyMap>
        </destinationPolicy>
    </broker>
	
</beans>
```

* 使用 `<policyEntry></policyEntry>` 自定义死信队列
* `queuePrefix` 属性定义死信队列名称前缀
* 再次测试上面的3个死信机制，3个死信分别发送到死信队列 `DLQ.deadQueue1、DLQ.deadQueue2、DLQ.deadQueue3`


#### 2. 重发策略
```
/**
 * 消息重发策略
 */
@Bean
public RedeliveryPolicy redeliveryPolicy(){
    RedeliveryPolicy redeliveryPolicy= new RedeliveryPolicy();
    //  是否在每次尝试重新发送失败后,增长这个等待时间
    redeliveryPolicy.setUseExponentialBackOff(true);
    //  重发次数，默认为6次
    redeliveryPolicy.setMaximumRedeliveries(3);
    //  重发时间间隔，默认为1秒
    redeliveryPolicy.setInitialRedeliveryDelay(3000);
    //  第一次失败后重新发送之前等待500毫秒,第二次失败再等待500 * 2毫秒,这里的2就是value
    redeliveryPolicy.setBackOffMultiplier(2);
    //  是否避免消息碰撞
    redeliveryPolicy.setUseCollisionAvoidance(false);
    //  设置重发最大拖延时间-1 表示没有拖延只有UseExponentialBackOff(true)为true时生效
    redeliveryPolicy.setMaximumRedeliveryDelay(-1);
    return redeliveryPolicy;
}


/**
 * 将重发策略注入到 ActiveMQ 连接工厂
 */
@Bean
public ActiveMQConnectionFactory activeMQConnectionFactory (@Value("${spring.activemq.broker-url}")String url, RedeliveryPolicy redeliveryPolicy){
    ActiveMQConnectionFactory activeMQConnectionFactory = new ActiveMQConnectionFactory("admin", "admin", url);
    activeMQConnectionFactory.setRedeliveryPolicy(redeliveryPolicy);
    return activeMQConnectionFactory;
}
```