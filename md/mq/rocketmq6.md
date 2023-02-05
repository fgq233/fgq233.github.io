###  RocketMQ 事务消息
![](https://fgq233.github.io/imgs/mq/rocketMQ6.png)

#### 一、 事务消息流程
事务消息分为两个流程
* 正常事务消息的发送及提交
* 事务消息的补偿流程


#### 1. 事务消息发送及提交
* 开启事务，发送消息，此时到Broker的为半消息(`Half Msg`)，不可见，不能被消费者消费

* Broker 响应给生产者消息写入结果

* 根据响应结果，执行本地事务
  * 生产者 Commit：`Half Msg` 变为正常消息，可以被消费
  * 生产者 Rollback：`Broker` 删除 `Half Msg`
  * 未操作：`Broker` 会进行消息回查，进入补偿阶段


#### 2. 事务补偿
补偿阶段用于解决消息 `Commit` 或者 `Rollback` 发生超时或者失败的情况。

* 对没有Commit/Rollback的事务消息（pending状态的消息），从服务端发起一次**回查**

* 生产者收到回查消息，检查回查消息对应的本地事务的状态

* 根据本地事务状态，重新Commit或者Rollback



#### 3. 事务消息状态
事务消息共有三种状态，提交状态、回滚状态、中间状态
* `TransactionStatus.CommitTransaction`: 提交事务，允许消费者消费此消息
* `TransactionStatus.RollbackTransaction`: 回滚事务，代表该消息将被删除，不允许被消费
* `TransactionStatus.Unknown`: 中间状态，它代表需要检查消息队列来确定状态


#### 二、 测试