###  RocketMQ 顺序消息
* 无序消息：Broker中消息队列有很多个，在消息发送过来时，会分发到各个队列的，是无序的

* 有序消息：消息发送，指定同一个队列进行发送，而消费的消息也是一个接着一个消费
    * 生产顺序性
    * 消费顺序性

注意：广播模式消费 `MessageModel.BROADCASTING` ，不支持消息顺序，因为一个消息会被多个消费者消费


#### 1. 订单
要求同一个orderId的消息在一个线程、队列消费

```
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



#### 1. 生产者
```
public class OrderProducer {

    public static void main(String[] args) throws Exception {
        DefaultMQProducer producer = new DefaultMQProducer("FGQ_TEST_GROUP");
        producer.setNamesrvAddr("127.0.0.1:9876");
        producer.start();
        List<Order> list = Arrays.asList(
                new Order(1, 111, "巴黎世家订单"),
                new Order(5, 222, "华伦天奴付款"),
                new Order(2, 111, "巴黎世家付款"),
                new Order(7, 333, "维多利亚的秘密订单"),
                new Order(3, 111, "巴黎世家完成"),
                new Order(4, 222, "华伦天奴订单"),
                new Order(8, 333, "维多利亚的秘密付款"),
                new Order(6, 222, "华伦天奴完成"),
                new Order(9, 333, "维多利亚的秘密完成")
        );
        for (Order order : list) {
            Message message = new Message("Order_Topic", "X", order.getDesc().getBytes());
            SendResult sendResult = producer.send(message, new MessageQueueSelector() {
                /**
                 * @param mqs：Broker中队列集合
                 * @param msg：消息对象
                 * @param arg：业务标识的参数，为send()方法第三个参数
                 * @return 返回消息发送到哪个队列
                 */
                @Override
                public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {
                    int orderId = (int) arg;
                    int index = orderId % mqs.size();
                    // 分区顺序：同一个模值的消息在同一个队列中
                    return mqs.get(index);

                    // return mqs.get(mqs.size() - 1);
                    // 全局顺序：所有的消息都在同一个队列中
                }
            }, order.getOrderId());

            System.out.println("发送结果：" + sendResult);
        }
        producer.shutdown();
    }
}

MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=3]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=2]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=1]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=3]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=2]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=1]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=3]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=2]
MessageQueue [topic=Order_Topic, brokerName=fgq, queueId=1]
```



#### 2. 消费者
```
public class OrderConsumer {

    public static void main(String[] args) throws MQClientException {
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("FGQ_TEST_GROUP");
        consumer.setNamesrvAddr("127.0.0.1:9876");
        consumer.subscribe("Order_Topic", "*");
        consumer.registerMessageListener(new MessageListenerOrderly() {

            @Override
            public ConsumeOrderlyStatus consumeMessage(List<MessageExt> msgs, ConsumeOrderlyContext context) {
                for (MessageExt msg : msgs) {
                    System.out.println("线程：" + Thread.currentThread().getName() + "，消息：" + new String(msg.getBody()));
                }
                return ConsumeOrderlyStatus.SUCCESS;
            }
        });
        consumer.start();
    }
}

线程：ConsumeMessageThread_FGQ_TEST_GROUP_1，消息：维多利亚的秘密订单
线程：ConsumeMessageThread_FGQ_TEST_GROUP_1，消息：维多利亚的秘密付款
线程：ConsumeMessageThread_FGQ_TEST_GROUP_1，消息：维多利亚的秘密完成
线程：ConsumeMessageThread_FGQ_TEST_GROUP_2，消息：巴黎世家订单
线程：ConsumeMessageThread_FGQ_TEST_GROUP_2，消息：巴黎世家付款
线程：ConsumeMessageThread_FGQ_TEST_GROUP_2，消息：巴黎世家完成
线程：ConsumeMessageThread_FGQ_TEST_GROUP_3，消息：华伦天奴付款
线程：ConsumeMessageThread_FGQ_TEST_GROUP_3，消息：华伦天奴订单
线程：ConsumeMessageThread_FGQ_TEST_GROUP_3，消息：华伦天奴完成
线程：ConsumeMessageThread_FGQ_TEST_GROUP_3，消息：华伦天奴付款
线程：ConsumeMessageThread_FGQ_TEST_GROUP_3，消息：华伦天奴订单
线程：ConsumeMessageThread_FGQ_TEST_GROUP_3，消息：华伦天奴完成

```


 
###  二、 原生Api 
#### 1. 生产者
```
@SpringBootTest
class OrderProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;
    private List<Order> list;

    @BeforeEach
    void before() {
        list = Arrays.asList(
                new Order(111, "巴黎世家订单"),
                new Order(222, "华伦天奴订单"),
                new Order(333, "维多利亚的秘密订单"),
                new Order(111, "巴黎世家付款"),
                new Order(222, "华伦天奴付款"),
                new Order(333, "维多利亚的秘密付款"),
                new Order(111, "巴黎世家完成"),
                new Order(222, "华伦天奴完成"),
                new Order(333, "维多利亚的秘密完成")
        );
    }

    @Test
    void syncSendOrderly() {
        rocketMQTemplate.setMessageQueueSelector(new MessageQueueSelector() {
            @Override
            public MessageQueue select(List<MessageQueue> list, Message message, Object o) {
                String orderId = (String) o;
                int index = Integer.parseInt(orderId) % list.size();
                return list.get(index);
            }
        });
        for (Order order : list) {
            SendResult result = rocketMQTemplate.syncSendOrderly("Order_Topic", order.getDesc(), String.valueOf(order.getOrderId()));
            System.out.println(result.getMessageQueue());
        }
    }
}
```

#### 2. 消费者
```


```