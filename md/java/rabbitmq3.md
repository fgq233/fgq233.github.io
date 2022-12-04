###  消息转换器
#### 一、发送任意类型消息
* 发送时：convertAndSend 方法中，消息参数类型是Object，可以发送任意对象类型的消息，
SpringAMQP会帮我们序列化为字节后发送


#### 二、接收消息
* Spring的对消息对象的处理是org.springframework.amqp.support.converter.MessageConverter 类
* 默认实现是：SimpleMessageConverter，基于JDK的ObjectOutputStream完成序列化

#### 三、自定义接收消息类型
* 定义一个MessageConverter 类型的类，然后Bean注入

##### 1、引入jackson，生产者、消费者注入自定义的 MessageConverter
```
生产者消费者都需要

<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
    <version>2.9.10</version>
</dependency>

@Bean
public MessageConverter jsonMessageConverter(){
    return new Jackson2JsonMessageConverter();
}
```

##### 2、测试
```
生产者和消费者声明队列：
@Configuration
public class FanoutConfig {
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