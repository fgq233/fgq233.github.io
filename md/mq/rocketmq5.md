###  RocketMQ 过滤消息
RocketMQ 中消息过滤分为2类
* `SelectorType.TAG`   根据tag过滤（默认值）
* `SelectorType.SQL92` 根据sql过滤

#### 一、 TAG 过滤
#### 1. 生产者
```
rocketMQTemplate.syncSend("TAG_TOPIC", "无TAG");
rocketMQTemplate.syncSend("TAG_TOPIC:Tag1", "有TAG1");
rocketMQTemplate.syncSend("TAG_TOPIC:Tag2", "有TAG2");
rocketMQTemplate.syncSend("TAG_TOPIC:Tag3", "有TAG3");
```


#### 2. 消费者
`selectorExpression` 
* 不设置的话表示*，全部
* 可以设置单个、多个，多个TAG 以 `||` 拼接

```
@Component
@RocketMQMessageListener(
        topic = "TAG_TOPIC",
        consumerGroup = "FGQ_TEST_TAG",
        selectorExpression = "Tag1 || Tag2")
public class TagFilterConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String msg) {
        System.out.println(msg);
    }
}
```



#### 二、 SQL 过滤
* 默认不支持SQL 过滤，需要在 Broker 配置文件添加配置 `enablePropertyFilter=true`
* SQL 过滤只支持一些基本SQL语法
  * 数值比较：`>、>=、<、<=、BETWEEN、=`
  * 字符比较：`=、<>、IN`
  * `IS NULL、IS NOT NULL`
  * 逻辑符号 `AND、OR、NOT`

#### 1. 生产者
```
List<Message> list = new ArrayList<>();
for (int i = 0; i < 10; i++) {
    list.add(MessageBuilder
            .withPayload("SQ过滤消息" + i)
            .setHeader("age", i)
            .build());
}
SendResult result = rocketMQTemplate.syncSend("SQL_TOPIC", list);
System.out.println(result);
```


#### 2. 消费者
```
@Component
@RocketMQMessageListener(
        topic = "SQL_TOPIC",
        consumerGroup = "FGQ_TEST_SQL",
        selectorType = SelectorType.SQL92,
        selectorExpression = "age > 6")
public class SqlFilterConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String msg) {
        System.out.println(msg);
    }
}
```