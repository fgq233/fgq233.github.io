###  ActiveMQ 安装
###  一、安装
#### 1. 下载、启动
* 官网地址：[https://activemq.apache.org](https://activemq.apache.org)
* Apache地址：[https://archive.apache.org/dist/activemq](https://archive.apache.org/dist/activemq)
* 启动：`activemq.bat`
* 注意：`ActiveMQ` 需要 `java` 环境

#### 2. 协议、端口
* 查看 `conf` 目录下配置文件：`activemq.xml`
* `ActiveMQ` 支持的五种协议连接分别是：`tcp://、ampq://、stomp://、mqtt://、ws://` 
* 其中 `amqp` 协议端口为 5672，注意：这个端口 `RabbitMQ` 服务默认也会使用
* 可以修改下面的协议默认端口，防止冲突

```
<transportConnectors>
    <transportConnector name="openwire" uri="tcp://0.0.0.0:61616?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="amqp" uri="amqp://0.0.0.0:5672?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="stomp" uri="stomp://0.0.0.0:61613?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="mqtt" uri="mqtt://0.0.0.0:1883?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
    <transportConnector name="ws" uri="ws://0.0.0.0:61614?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600"/>
</transportConnectors>
```

#### 3. 控制台
* java 代码访问 `ActiveMQ`：[http://localhost:61616](http://localhost:61616)
* 控制台：[http://localhost:8161](http://localhost:8161)，默认账号密码都是 `admin`
* 控制台配置在`conf` 目录下 `jetty.xml`，默认host为本机，可以修改为 `0.0.0.0`，通过具体ip 访问

```
<bean id="jettyPort" class="org.apache.activemq.web.WebConsolePort" init-method="start">
    <property name="host" value="127.0.0.1"/>
    <property name="port" value="8161"/>
</bean>
```




###  二、SpringBoot 中 ActiveMQ 使用步骤
#### 1. 引入依赖
生产者、消费者都需要引入

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
```

#### 2. yml配置
生产者、消费者都需要配置

```
server:
  port: 8081
spring:
  activemq:
    broker-url: tcp://127.0.0.1:61616
    user: admin
    password: admin
  jms:
    pub-sub-domain: false   # 点对点模式 false(默认)、发布订阅模式 true
```
 
 
#### 3. 生产者：发送信息
```
@SpringBootTest
class PublisherTest {

    @Autowired
    private JmsTemplate jmsTemplate;
    @Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;

    @Test
    void p2p() {
        String queueName = "test.queue";
        String msg = "Hello ActiveMQ";
//        jmsTemplate.convertAndSend(queueName, msg);
        jmsMessagingTemplate.convertAndSend(queueName, msg);
    }
}
```

`jmsTemplate、JmsMessagingTemplate` 都可以发送消息

#### 4. 消费者：监听消息
```
@Component
public class MsgListener {

    @JmsListener(destination = "test.queue")
    public void receiveMsg(String msg){
        System.out.println(msg);
    }
}
```

通过 `@JmsListener` 注解监听消息
