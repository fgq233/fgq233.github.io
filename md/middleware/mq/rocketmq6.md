###  RocketMQ 事务消息
![](https://fgq233.github.io/imgs/mq/rocketMQ6.png)

### 一、 事务消息流程
事务消息分为两个流程
* 正常事务消息的发送及提交
* 事务消息回查

#### 1. 事务消息发送及提交
* 发送方将事务消息发送至服务端

* 服务端将消息持久化成功之后，向发送方返回Ack确认消息已经发送成功，此时消息为半事务消息（不能投递，不能被消费者消费）

* 发送方开始执行本地事务逻辑

* 发送方根据本地事务执行结果向服务端提交二次确认（Commit或Rollback）
  * 服务端收到Commit状态则将半事务消息标记为可投递，订阅方将收到该消息
  * 服务端收到Rollback状态则删除半事务消息，订阅方不会收到该消息


#### 2. 事务消息回查
断网或应用宕机等情况下，上述步骤4提交的二次确认最终未到达服务端，经过固定时间后，服务端将对该消息发起消息回查

* 发送方收到消息回查后，需要检查对应消息的本地事务执行的最终结果

* 发送方根据检查结果再次提交二次确认，服务端仍按照上述步骤4对半事务消息进行操作
 

#### 3. 事务消息状态
事务消息共有三种状态，提交状态、回滚状态、中间状态
* `TransactionStatus.CommitTransaction`: 提交事务，允许消费者消费此消息
* `TransactionStatus.RollbackTransaction`: 回滚事务，代表该消息将被删除，不允许被消费
* `TransactionStatus.Unknown`: 中间状态，它代表需要检查消息队列来确定状态


### 二、 测试
#### 1. 生产者：事务消息发送
```java
@SpringBootTest
class TxProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    @Test
    void tx() {
        Message<String> message = MessageBuilder.withPayload("事务消息").build();
        TransactionSendResult result = rocketMQTemplate.sendMessageInTransaction("TRANSACTION_TOPIC", message, null);

        LocalTransactionState transactionState = result.getLocalTransactionState();
        System.out.println(result);
        // 事务状态
        System.out.println(transactionState);
    }
}
```


#### 2. 生产者：本地事务监听器
```java
@Component
@RocketMQTransactionListener
public class TXProducerListener implements RocketMQLocalTransactionListener {

    /**
     * 执行本地事务
     */
    @Override
    public RocketMQLocalTransactionState executeLocalTransaction(Message message, Object arg) {
        System.out.println("开始执行本地事务...");
        RocketMQLocalTransactionState result;
        try {
            // ... 模拟业务处理

            // 模拟异常
            // int i = 1 / 0;
            result = RocketMQLocalTransactionState.COMMIT;  // 成功
            System.out.println("本地事务执行成功...");
        } catch (Exception e) {
            result = RocketMQLocalTransactionState.ROLLBACK;
            System.out.println("本地事务执行失败...");
        }
        return result;
    }

    /**
     * 本地事务回查
     */
    @Override
    public RocketMQLocalTransactionState checkLocalTransaction(Message msg) {
        System.out.println("检查本地事务...");
        RocketMQLocalTransactionState result;
        try {
            // 检查本地事务，比如检查 msg 数据是否插入数据库，根据检查结果返回 COMMIT/ROLLBACK
            result = RocketMQLocalTransactionState.COMMIT;
        } catch (Exception e) {
            // 异常就回滚
            result = RocketMQLocalTransactionState.ROLLBACK;
        }
        return result;
    }
}
```


#### 3. 消费者
```java
@Component
@RocketMQMessageListener(
        topic = "TRANSACTION_TOPIC",
        consumerGroup = "FGQ_TEST_TRANSACTION")
public class TransactionConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String msg) {
        System.out.println(msg);
    }
}
```



#### 4. 注意
`rocketmq-spring-boot-starter < 2.1.0` 版本中
* `sendMessageInTransaction()` 有4个参数，第一个参数 `txProducerGroup` 用来发送不同类型的事务消息
* `@RocketMQTransactionListener` 也有个参数 `txProducerGroup`：来监听不同的事务消息

在`2.1.0`之后版本已经移除了`txProducerGroup`，一个项目中只能有一个`@RocketMQTransactionListener`
