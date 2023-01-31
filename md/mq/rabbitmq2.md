###  RabbitMQ五种消息模型

###  一、消息模型
####  1. 官方demo
* RabbitMQ官方提供了 7 个入门demo，前5个与消息发送接收有关，对应了不同的消息模型，
这5个在Spring AMQP中都可以实现
* [官方demo](https://rabbitmq.com/getstarted.html)

| **消息模型**| **说明**  |
| ---------- | --------- |
| Hello World | 基本消息队列 |
| Work Queues | 工作消息队列 |
| Publish/Subscribe | 发布订阅模型，根据交换机又分为三类Fanout Exchange、Direct Exchange、Topic Exchange |
| --- | --- |
| Fanout | 广播 |
| Direct | 路由 |
| Topics | 主题 |


#### 2. RabbitMQ中的角色
* publisher：生产者，消息发布者，将消息发送到队列queue
* consumer：消费者，订阅队列，处理队列中的消息
* exchange：交换机，负责消息路由
* queue：队列，负责接受并缓存消息
* virtualHost：虚拟主机，隔离不同租户的exchange、queue、消息的隔离
 
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ.png)


#### 3. 使用注意
* `RabbitTemplate` 通过 `convertAndSend()` 方法发送消息不会创建队列，所以需要先声明，不然消息发送不成功
* `RabbitListener`: 项目启动时监听类会监听所有配置的队列，若不存在，启动会失败
* 消息一旦消费就会从队列中移除， RabbitMQ 没有消息回溯功能
* 消费者有消费预取机制，默认平均预取队列中的消息，可以通过设置`prefetch`参数来控制每次预期消息数量





###  二、五种消息模型案例
####  1、基本消息队列
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ1.png)

* 官方HelloWorld是最基础的消息队列模型来实现的，只包括三个角色：
publisher、queue、consumer
* 特点：单个消费者监听一个队列

```
声明队列
@Configuration
public class RabbmitQueueConfig {
    @Bean
    public Queue queue(){
        return new Queue("test.queue");
    }
}
发布者：
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void test() {
        String queueName = "test.queue";
        String msg = "Hello, Spring AMQP!";
        rabbitTemplate.convertAndSend(queueName, msg);
    }
消费者：
@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "test.queue")
    public void listener(String msg) throws InterruptedException {
        System.out.println(msg);
    }
}
```

* 若不想手动声明队列，可以通过注解模式在消费者中声明

```
消费者(注解模式)
    @RabbitListener(queuesToDeclare = @Queue("test.queue"))
    public void listener(String msg) {
        System.out.println(msg);
    }
```


####  2、工作消息队列 WorkQueue
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ2.png)

* 特点1：多个消费者监听同一个队列，提高消息处理速度，避免队列消息堆积
* 特点2：同一条消息只会被一个消费者处理

```
发布者：
    public void test() throws InterruptedException {
        String queueName = "test.queue";
        String msg = "Hello Spring AMQP：";
        for (int i = 1; i <= 50; i++) {
            rabbitTemplate.convertAndSend(queueName, msg + i);
            Thread.sleep(20);
        }
    }
消费者：
    @RabbitListener(queues = "test.queue")
    public void listener1(String msg) throws InterruptedException {
        System.out.println(msg);
        Thread.sleep(20);
    }
    
    @RabbitListener(queues = "test.queue")
    public void listener2(String msg) throws InterruptedException {
        System.err.println(msg);
        Thread.sleep(200);
    }
    
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: fgq
    password: 123456
    virtual-host: /
    listener:
      simple:
        prefetch: 1  # 每次只能获取一条消息，处理完成才能获取下一个消息
```



####  X、发布订阅模型 Publish/Subscribe
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ3.png)

* 在发布订阅模型中多了一个exchange角色，过程略有变化：

* Publisher：生产者，不再发送到队列中，而是发给 Exchange
* Exchange：交换机，一方面，接收生产者发送的消息，另一方面，知道如何处理消息，
例如递交给某个特别队列、递交给所有队列、或是将消息丢弃。
如何操作，取决于Exchange的3种类型：
  *  Fanout：广播，将消息交给所有绑定到交换机的队列
  *  Direct：定向，把消息交给符合指定routing key 的队列
  *  Topic：通配符，把消息交给符合routing pattern（路由模式） 的队列
* Queue：与以前一样，接收消息、缓存消息。
* Consumer：消费者，与以前一样，订阅队列，没有变化
* 注意：exchange负责消息路由，而不是存储，路由失败则消息丢失


####  3、Fanout Exchange
* Fanout Exchange 会将接收到的消息广播到每一个跟其绑定的queue
* 注意：绑定的时候是按照类型的名称注入，所以Queue、FanoutExchange的key值必须和方法名一致

```
声明队列、交换机
@Configuration
public class FanoutConfig {

    // 声明交换机
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange("test.fanout");
    }
    // 声明队列1
    @Bean
    public Queue queue1() {
        return new Queue("fanout.queue1");
    }
    // 声明队列2
    @Bean
    public Queue queue2() {
        return new Queue("fanout.queue2");
    }

    // 绑定队列1到交换机
    @Bean
    public Binding fanoutBinding1(Queue queue1, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(queue1).to(fanoutExchange);
    }

    // 绑定队列2到交换机
    @Bean
    public Binding fanoutBinding2(Queue queue2, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(queue2).to(fanoutExchange);
    }

}
发布者：
    public void test() {
        String exchangeName = "test.fanout";
        String msg = "Hello, Fanout Exchange";
        rabbitTemplate.convertAndSend(exchangeName, "", msg);
    }
消费者：
    @RabbitListener(queues = "fanout.queue1")
    public void listener1(String msg) throws InterruptedException {
        System.out.println(msg);
    }

    @RabbitListener(queues = "fanout.queue2")
    public void listener2(String msg) throws InterruptedException {
        System.err.println(msg);
    }
```


####  4、Direct Exchange 
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ4.png)

* Direct Exchange 会将接收到的消息根据规则路由到指定的Queue，因此称为路由模式(Routing)
* A：发布者发送消息时，指定消息的RoutingKey 
* B：每一个 Queue 都要与 Exchange 设置 BindingKey
* C：Exchange 将消息路由到 BindingKey、RoutingKey 一致的队列

* 基于@Bean的方式声明队列和交换机比较麻烦，Spring还提供了基于注解方式来声明

```
发布者：
    public void test() {
        String exchangeName = "test.direct";
        String msg = "Hello, DirectExchange!";
        rabbitTemplate.convertAndSend(exchangeName, "keyA", msg);
    }
消费者：
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "direct.queue1"),
            exchange = @Exchange(name = "test.direct", type = ExchangeTypes.DIRECT),
            key = {"keyA", "keyB"}
    ))
    public void listener1(String msg){
        System.out.println(msg);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "direct.queue2"),
            exchange = @Exchange(name = "test.direct", type = ExchangeTypes.DIRECT),
            key = {"keyB", "keyC"}
    ))
    public void listener2(String msg){
        System.err.println(msg);
    }
```


####  5、Topic Exchange 
![RabbitMQ](https://fgq233.github.io/imgs/mq/rabbitMQ5.png)

Topic 与 Direct 类似，区别在于：
* 发布时：routingKey 必须是2个及以上单词，并以 . 分割的写法
* 绑定时：BindingKey是通配符写法，#代指0个或多个单词，*代指一个单词


```
发布者：
    public void test() {
        String exchangeName = "test.topic";
        String msg = "Hello TopicExchange";
        rabbitTemplate.convertAndSend(exchangeName, "china.weather", msg);
    }
消费者：
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "topic.queue1"),
            exchange = @Exchange(name = "test.topic", type = ExchangeTypes.TOPIC),
            key = "china.#"
    ))
    public void listenTopicQueue1(String msg){
        System.out.println(msg);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "topic.queue2"),
            exchange = @Exchange(name = "test.topic", type = ExchangeTypes.TOPIC),
            key = "#.news"
    ))
    public void listenTopicQueue2(String msg){
        System.err.println(msg);
    }
```
