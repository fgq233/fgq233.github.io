###  消息转换器
### 一、发送任意类型消息
发送时：convertAndSend 方法中消息参数类型是Object，可以发送任意对象类型的消息，
SpringAMQP会序列化为字节后发送


### 二、接收消息
* Spring的对消息对象的处理是`org.springframework.amqp.support.converter.MessageConverter` 类
* 默认实现是：`SimpleMessageConverter`，基于`JDK`的`ObjectOutputStream`完成序列化


### 三、RabbitListener 搭配 RabbitHandler 接收不同类型参数消息
```
@Component
@RabbitListener(queues = "test.queue")
public class Receiver {

    @RabbitHandler
    public void testHandler1(String msg) {
    }

    @RabbitHandler
    public void testHandler2(Map<String, Object> msg) {
    }
}
```

* @RabbitListener 可以标注在类上面，需配合 @RabbitHandler 注解一起使用

* @RabbitListener 标注在类上面，表示收到消息的时候，就交给 @RabbitHandler 的方法处理，
具体使用哪个方法处理，根据 MessageConverter 转换后的参数类型来决定，这样一个队列就能接收不同类型参数消息了

* @RabbitHandler 也可以使用 Message 处理所有类型参数

```
@Component
@RabbitListener(queues = "test.queue")
public class Receiver {
    
    @RabbitHandler
    public void test(Channel channel, Message message) throws IOException {
    }
    
}
```


### 四、自定义接收消息类型
* 定义一个`MessageConverter` 实现类，然后注入`Spring IOC` 容器
* 注意：发送方与接收方必须使用相同的 `MessageConverter`

#### 1、注入自定义MessageConverter
```
生产者消费者都需要注入
@Bean
public MessageConverter jsonMessageConverter(){
    return new Jackson2JsonMessageConverter();
}
```

#### 2、测试
```
生产者和消费者声明队列：
@Configuration
public class QueueConfig {
    @Bean
    public Queue queue(){
        return new Queue("object.queue");
    }
}
生产者：
    public void test() {
        Map<String, Object> msg = new HashMap<>();
        msg.put("name", "fgq");
        msg.put("age", "18");
        rabbitTemplate.convertAndSend("object.queue", msg);
    }
消费者：
    @RabbitListener(queues = "object.queue")
    public void listenObjectQueue(Map<String,Object> msg){
        System.out.println(msg);
    }
```

 