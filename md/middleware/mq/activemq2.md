###  JMS 消息组成
`JMS Message` 消息由三部分组成
* 消息头
* 消息体
* 消息属性

###  一、消息头
#### 1、说明
* `JMSDestination`：消息发送的目的地 Destination
* `JMSMessageID`：消息唯一标识
* `JMSDeliveryMode`：消息持久化，值 `DeliveryMode.PERSISTENT` 或 `DeliveryMode.NON_PERSISTENT`
* `JMSTimestamp`：消息发送的时间
* `JMSExpiration`：消息失效的时间，单位：毫秒，值为0表明消息不会过期
* `JMSPriority`：消息的优先级，范围：0~9，值越大优先级越高，默认4
* `JMSCorrelationID`：消息关联ID，用来链接响应消息与请求消息
* `JMSReplyTo`：请求程序用它来指出回复消息应发送的地方
* `JMSType`：消息的类型
* `JMSRedelivered`：消息的重发标志，false代表该消息是第一次发生，true代表该消息为重发的消息

大部分消息头是 JMS 决定，不用设置


#### 2、示例
```
// 生产者
String queueName = "test.queue";
String msg = "Hello ActiveMQ";

jmsTemplate.send(queueName, new MessageCreator() {
    @Override
    @NonNull
    public Message createMessage(@NonNull Session session) throws JMSException {
        TextMessage textMessage = session.createTextMessage(msg);
        textMessage.setJMSMessageID("001");
        textMessage.setJMSCorrelationID("666");
        return textMessage;
    }
});

// 消费者
@JmsListener(destination = "test.queue")
public void listener2(TextMessage msg) throws JMSException {
    System.out.println(msg.getText());
    System.out.println("JMSDestination:" + msg.getJMSDestination());
    System.out.println("JMSMessageID:" + msg.getJMSMessageID());
    System.out.println("JMSDeliveryMode:" + msg.getJMSDeliveryMode());
    System.out.println("JMSTimestamp:" + msg.getJMSTimestamp());
    System.out.println("JMSExpiration:" + msg.getJMSExpiration());
    System.out.println("JMSPriority:" + msg.getJMSPriority());
    System.out.println("JMSCorrelationID:" + msg.getJMSCorrelationID());
    System.out.println("JMSReplyTo:" + msg.getJMSReplyTo());
    System.out.println("JMSType:" + msg.getJMSType());
    System.out.println("JMSRedelivered:" + msg.getJMSRedelivered());
}
```


###  二、消息属性
* 生产者设置属性：`setStringProperty()、setIntProperty()` ...
* 消费者获取属性：`getStringProperty()、getIntProperty()` ...

``` 
// 生产者
jmsTemplate.send("test.queue", new MessageCreator() {
    @Override
    @NonNull
    public Message createMessage(@NonNull Session session) throws JMSException {
        TextMessage textMessage = session.createTextMessage("Hello ActiveMQ");
        textMessage.setStringProperty("prop1", "666");
        textMessage.setIntProperty("prop2", 888);
        return textMessage;
    }
});

// 消费者
@JmsListener(destination = "test.queueX3")
public void listener3(TextMessage msg) throws JMSException {
    System.out.println(msg.getText());
    System.out.println(msg.getStringProperty("prop1"));
    System.out.println(msg.getIntProperty("prop2"));
}
```




###  三、消息体
在消息体中，JMS API定义了五种类型的消息格式

* `TextMessage`：字符串
* `MapMessage`：键值对
* `ObjectMessage`：对象
* `BytesMessage`：字节流，一般是文件类型
* `StreamMessage`：数据流

ActiveMQ 高版本中，不接受自定义的序列化对象(对象格式)，需要加入到受信任的列表：

```
spring:
  activemq:
    packages:
      trust-all: true
```

#### 1、发送消息
```
jmsTemplate.send("test.queue1", new MessageCreator() {
    @Override
    @NonNull
    public Message createMessage(@NonNull Session session) throws JMSException {
        return session.createTextMessage("Hello ActiveMQ");
    }
});
jmsTemplate.send("test.queue2", new MessageCreator() {
    @Override
    @NonNull
    public Message createMessage(@NonNull Session session) throws JMSException {
        MapMessage map = session.createMapMessage();
        map.setString("name", "fgq");
        map.setInt("age", 18);
        return map;
    }
});
jmsTemplate.send("test.queue3", new MessageCreator() {
    @Override
    @NonNull
    public Message createMessage(@NonNull Session session) throws JMSException {
        SysUser user = new SysUser();
        user.setName("fgq");
        user.setAge(88);
        return session.createObjectMessage(user);
    }
});
jmsTemplate.send("test.queue4", new MessageCreator() {
    @Override
    @NonNull
    public Message createMessage(@NonNull Session session) throws JMSException {
        BytesMessage bytesMessage = session.createBytesMessage();
        bytesMessage.writeBytes("fgq666".getBytes());
        return bytesMessage;
    }
});
jmsTemplate.send("test.queue5", new MessageCreator() {
    @Override
    @NonNull
    public Message createMessage(@NonNull Session session) throws JMSException {
        StreamMessage streamMessage = session.createStreamMessage();
        streamMessage.writeString("你好啊，范老师");
        streamMessage.writeInt(666);
        return streamMessage;
    }
});
```

#### 2、接收消息
```
@JmsListener(destination = "test.queue1")
public void listener1(TextMessage msg) throws JMSException {
}

@JmsListener(destination = "test.queue2")
public void listener2(MapMessage msg) throws JMSException {
}

@JmsListener(destination = "test.queue3")
public void listener3(ObjectMessage msg) throws JMSException {
}

@JmsListener(destination = "test.queue4")
public void listener4(BytesMessage msg) throws JMSException {
}

@JmsListener(destination = "test.queue5")
public void listener5(StreamMessage msg) throws JMSException {
}
```

使用 `Message` 可以接收任意类型消息



