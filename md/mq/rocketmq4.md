###  RocketMQ 使用案例

###  一、 使用步骤
###  一、 原生Api 
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
  consumer:
    group: FGQ_TEST_GROUP
```


#### 2. 生产者
* 同步消息：发送消息后，线程等待MQ客户端给出发送结果，才会继续向下执行

```
@SpringBootTest
class BaseProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    /**
     * 发送同步消息
     */
    @Test
    void sync() {
        rocketMQTemplate.convertAndSend("mq_base:Tag1", "Hello RocketMQ");
    }

    /**
     * 发送异步消息
     */
    @Test
    void async() {
        rocketMQTemplate.convertAndSend("mq_base:Tag1", "Hello RocketMQ");
    }

}
```


 
 
### 3. 消费者
```
@Component
@RocketMQMessageListener(topic = "mq_base", consumerGroup = "FGQ_TEST_GROUP")
public class BaseConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String msg) {
        System.out.println(msg);
    }
}
```