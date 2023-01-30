###  RabbitMQ 安装
###  一、安装
#### 1、安装 erl、rabbitmq
* 安装 erl，同时将 bin目录 配到环境变量
* 安装 rabbitmq，同时将 sbin目录 配到环境变量
  * 命令行使用 rabbitmqctl status 命令检测是否安装成功，安装成功会自动注册为服务
  * RabbitMQ服务端默认端口是：5672

#### 2、图形界面
RabbitMQ图形界面默认端口是：15672，默认用户名密码都是 guest，使用前需要开启

```
rabbitmq-plugins.bat enable rabbitmq_management
```


###  二、SpringBoot 中 RabbitMQ使用步骤
在RabbitMQ图形界面创建用户，同时分配虚拟主机权限，然后重启 RabbitMQ 服务

#### 1、引入依赖
生产者、消费者都需要引入

```
<!--AMQP依赖，包含RabbitMQ-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

#### 2、yml配置
生产者、消费者都需要配置

```
spring:
  rabbitmq:
    host: 127.0.0.1     # 主机名
    port: 5672          # 端口
    virtual-host: /     # 虚拟主机
    username: fgq       # 用户名
    password: 123456    # 密码
```
 
 
#### 4、声明队列、交换机(根据需求可选)
```
@Configuration
public class QueueConfig {

    @Bean
    public Queue queue(){
        return new Queue("test.queue");
    }
}
```

#### 5、生产者：发送信息
```
@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void test() {
        String msg = "Hello RabbitMQ";
        rabbitTemplate.convertAndSend("test.queue", msg);
    }
}
```

#### 6、消费者：监听消息
```
@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "test.queue")
    public void listener(String msg){
        System.out.println(msg);
    }
}
```