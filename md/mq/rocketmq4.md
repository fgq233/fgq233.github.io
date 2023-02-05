###  RocketMQ 批量消息、有序消息、延迟消息

#### 一、 批量消息
#### 1. 生产者
将所有消息构建为 List<Message> 集合数据，然后发送出去
* 批量消息可以提高传递性能
* 限制1：需要有相同的 Topic
* 限制2：消息总大小不能超过 4M

```java
@SpringBootTest
class BatchProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    @Test
    void syncSend() {
        List<Message> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            list.add(MessageBuilder.withPayload("批量同步消息" + i).build());
        }
        SendResult sendResult = rocketMQTemplate.syncSend("Batch_Topic", list);

        System.out.println(sendResult);
    }

    @Test
    void asyncSend() throws InterruptedException {
        List<Message> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            list.add(MessageBuilder.withPayload("批量异步消息" + i).build());
        }
        rocketMQTemplate.asyncSend("Batch_Topic", list, new SendCallback() {
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
        List<Message> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            list.add(MessageBuilder.withPayload("批量单向消息" + i).build());
        }
        rocketMQTemplate.sendOneWay("Batch_Topic", list);
    }
}
```




#### 3. 消费者
无特殊设置



#### 二、 延迟消息
* 延时消息不是延迟发送，消息是实时发送的，只是消费者延迟消费
* 延迟消息是通过对 `Message` 设置延迟级别来实现
* RocketMQ 延迟消息分为18个level，1到18分别对应下面的延迟时间

``
1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
``

#### 1. 生产者
```java
@SpringBootTest
class DealyProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;


    @Test
    void syncSend() {
        Message message = MessageBuilder.withPayload("同步延迟消息".getBytes()).build();
        // 最后一个参数 delayLevel 未延迟级别，此处表示延迟10s
        rocketMQTemplate.syncSend("Dealy_Topic", message, 8000, 3);
    }

    @Test
    void asyncSend() throws InterruptedException {
        Message message = MessageBuilder.withPayload("异步延迟消息".getBytes()).build();
        // 最后一个参数 delayLevel 未延迟级别，此处表示延迟5s
        rocketMQTemplate.asyncSend("Dealy_Topic", message, new SendCallback() {
            @Override
            public void onSuccess(SendResult sendResult) {
                System.out.println("发送成功：" + sendResult);
            }

            @Override
            public void onException(Throwable throwable) {
                System.out.println("发送异常：" + throwable.getMessage());
            }
        }, 8000, 2);
        TimeUnit.SECONDS.sleep(20);
    }
}

```
 
#### 2. 消费者
无特殊设置





#### 三、 有序消息
* 无序消息：Broker中消息队列有多个，在消息发送过来时，会分发到各个队列的，是无序的

* 有序消息：消息发送，指定同一个队列进行发送，同一个队列消费时按照顺序消费
    * 发送时：保持顺序
    * 存储时：保持和发送的顺序一致
    * 消费时：保持和存储的顺序一致

注意：广播模式消费 `MessageModel.BROADCASTING` ，不支持消息顺序，因为一个消息会被多个消费者消费
#### 1. 订单
要求同一个orderId的消息发送到同一个队列消费

```java
@Data
public class Order implements Serializable {

    private int orderId;
    private String desc;

    public Order(int id, int orderId, String desc) {
        this.orderId = orderId;
        this.desc = desc;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", desc='" + desc + '\'' +
                '}';
    }
}
```



#### 2. 生产者
```java
@SpringBootTest
class OrderProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;
    private List<Order> list;

    @BeforeEach
    void before() {
        list = Arrays.asList(
                new Order(1, "巴黎世家1"),
                new Order(1, "巴黎世家2"),
                new Order(1, "巴黎世家3"),
                new Order(2, "华伦天奴1"),
                new Order(2, "华伦天奴2"),
                new Order(2, "华伦天奴3"),
                new Order(3, "维多利亚的秘密1"),
                new Order(3, "维多利亚的秘密2"),
                new Order(3, "维多利亚的秘密3")
        );
        rocketMQTemplate.setMessageQueueSelector(new MessageQueueSelector() {
            @Override
            public MessageQueue select(List<MessageQueue> list, Message message, Object o) {
                String orderId = (String) o;  // hashKey
                int index = Integer.parseInt(orderId) % list.size();
                return list.get(index);
            }
        });
    }

    @Test
    void syncSendOrderly() {
        for (Order order : list) {
            SendResult result = rocketMQTemplate.syncSendOrderly("Order_Topic", order.getDesc(), String.valueOf(order.getOrderId()));
            System.out.println("发送结果：" + result.getMessageQueue());
        }
    }
}

```


* 通过设置 `setMessageQueueSelector()` 选择发送到哪个队列
* `setMessageQueueSelector(String destination, Object payload, String hashKey)` 
* `destination`：发送的目的地（主题、Tag）
* `payload`：发送的数据
* `hashKey`：会回传到 `setMessageQueueSelector()` 中，`select()`方法的第三个参数


#### 3. 消费者
使用参数 `consumeMode = ConsumeMode.ORDERLY` 有序消费

```java
@Component
@RocketMQMessageListener(
        topic = "Order_Topic",
        consumerGroup = "TEST_GROUP_ORDERLY",
        consumeMode = ConsumeMode.ORDERLY)
public class OrderConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String msg) {
        System.out.println(Thread.currentThread().getName() + ":" + msg);
    }
}
```


 
 
