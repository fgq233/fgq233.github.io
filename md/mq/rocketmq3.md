###  RocketMQ 使用步骤

###  一、 使用步骤
#### 1. 生产者 producer
* 创建消息生产者，并指定生产者组名
* 指定 `NameServer` 地址
* 启动
* 创建消息对象，指定主题 `Topic、Tag(可选)、消息体`
* 发送消息
* 关闭生产者

#### 2. 消费者 consumer
* 创建消费者，并指定消费者组名
* 指定 `NameServer` 地址
* 订阅主题 `Topic` 和 `Tag`(可选)
* 设置回调函数，处理消息
* 启动消费者



###  二、 原生Api
#### 1. pom.xml 依赖 
```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-client</artifactId>
    <version>4.9.4</version>
</dependency>
```

#### 2. 生产者
* 同步消息：发送消息后，线程阻塞，等待`Broker服务器`返回发送结果，才会继续向下执行

```
// 1. 创建消息生产者，并指定生产者组名
DefaultMQProducer producer = new DefaultMQProducer("FGQ_TEST_GROUP");
// 2. 指定 NameServer 地址
producer.setNamesrvAddr("127.0.0.1:9001;127.0.0.1:9002");
// 3. 启动
producer.start();
// 4. 创建消息对象，指定主题Topic、Tag、消息体
Message msg = new Message("mq_base", "Tag1", "Hello RocketMQ".getBytes());
// 5. 发送消息
SendResult result = producer.send(msg);
System.out.println("发送结果:" + result);
// 6.关闭生产者
producer.shutdown();
```

* 异步消息：发送消息后，线程不阻塞，回调方法在一个新的线程中执行

```
// ... 同上
// 发送异步消息
producer.send(msg, new SendCallback() {
    /**
     * 发送成功回调
     */
    public void onSuccess(SendResult sendResult) {
        System.out.println("发送成功：" + sendResult);
    }

    /**
     * 发送失败回调
     */
    public void onException(Throwable e) {
        System.out.println("发送异常：" + e);
    }
});
// 线程睡眠 5s（直接关闭，会导致异步回调结果异常）
TimeUnit.SECONDS.sleep(5);
producer.shutdown();
```
 
 
* 单向消息：同步和异步都会有个结果，而单向消息没有发送结果

```
// ... 同上
Message msg = new Message("mq_base", "Tag3", "Hello RocketMQ，单向消息".getBytes());
producer.sendOneway(msg);
producer.shutdown();
```
 
 
 
### 3. 消费者
```
//  1. 创建消费者，并指定消费者组名
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("FGQ_TEST_GROUP");
//  2. 指定 NameServer 地址
consumer.setNamesrvAddr("127.0.0.1:9001;127.0.0.1:9002");
//  3. 订阅主题 Topic 和 Tag
consumer.subscribe("mq_base", "*");

// 设定消费模式：集群模式|广播模式
consumer.setMessageModel(MessageModel.BROADCASTING);

// 4. 设置回调函数，处理消息
consumer.registerMessageListener(new MessageListenerConcurrently() {

    // 接受消息内容
    @Override
    public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
        for (MessageExt msg : msgs) {
            System.out.println(new String(msg.getBody()));
        }
        return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
    }
});
// 5. 启动消费者
consumer.start();
```

RocketMQ 消息模式分为 2种，可以通过消费者`setMessageModel()`方法设置
* 集群模式(默认)：类似JMS中---点对点模型，一个消息只能被一个消费者消费，负载均衡
* 广播模式：类似JMS中---发布/订阅模型


###  三、 RocketMQTemplate、RocketMQListener
#### 1. pom.xml 依赖 
```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>
```

#### 2. application.yaml
生产者服务、消费者服务都需要配置

```
# 生产者
rocketmq:
  name-server: 127.0.0.1:9001;127.0.0.1:9002
  producer:
    group: FGQ_TEST_GROUP
    
# 消费者   
rocketmq:
  name-server: 127.0.0.1:9001;127.0.0.1:9002
```


#### 2. 生产者
* 同步消息：发送消息后，线程等待MQ客户端给出发送结果，才会继续向下执行

```java
@SpringBootTest
class BaseProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    @Test
    void convertAndSend() {
        rocketMQTemplate.convertAndSend("mq_base:Tag1", "Hello RocketMQ，普通消息");
    }

    @Test
    void syncSend() {
        SendResult sendResult = rocketMQTemplate.syncSend("mq_base:Tag1", "Hello RocketMQ，同步消息");
        System.out.println(sendResult);
    }

    @Test
    void asyncSend() throws InterruptedException {
        rocketMQTemplate.asyncSend("mq_base:Tag2", "Hello RocketMQ，异步消息", new SendCallback() {
            @Override
            public void onSuccess(SendResult sendResult) {
                System.out.println("发送成功：" + sendResult);
            }

            @Override
            public void onException(Throwable throwable) {
                System.out.println("发送异常：" + throwable.getMessage());
            }
        });
        TimeUnit.SECONDS.sleep(5);
    }

    @Test
    void sendOneWay() {
        rocketMQTemplate.sendOneWay("mq_base:Tag3", "Hello RocketMQ，单向消息");
    }
}
```


 
 
### 3. 消费者
```java
@Component
@RocketMQMessageListener(
        topic = "mq_base",
        consumerGroup = "FGQ_TEST_GROUP",
        selectorExpression = "Tag1 || Tag2 || Tag3",
        messageModel = MessageModel.BROADCASTING)
public class BaseConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String msg) {
        System.out.println(msg);
    }
}
```

使用 `@RocketMQMessageListener`注解监听消息
* 必选项
  * `topic` 主题 
  * `consumerGroup` 消费者组名，一条消息只能被同一个消费者组里的一个消费者消费
  
* 常用可选项
  * `messageModel` 消息模式：
    * 集群模式(默认值)
    * 广播模式
  * `selectorType` 消息选择器类型
    * `SelectorType.TAG` ，使用 `TAG` 选择(默认值)
    * `SelectorType.SQL92` ，使用SQL92表达式选择
  * `selectorExpression` 设置`TAG` 选择的值，不设置或设置为* 代表全部
  * `consumeMode` 消费模式
    * `ConsumeMode.CONCURRENTLY`，无序消费(默认值)
    * `ConsumeMode.ORDERLY`，顺序消费
  * `nameServer` NameServer服务器地址
  * `consumeThreadMax` 最大消费线程
