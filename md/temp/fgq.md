# 消息队列使用说明

### 一、安装
#### 1、下载安装 erl，同时将 bin目录 配到环境变量
#### 2、下载安装 rabbitmq，同时将 sbin目录 配到环境变量
* 使用 `rabbitmqctl status` 命令检测是否安装成功，安装成功会自动注册为服务
* RabbitMQ服务端默认端口是：5672
* RabbitMQ图形界面默认端口是：15672，默认用户名密码都是 guest，使用前需要开启
```
rabbitmq-plugins.bat enable rabbitmq_management
```

* 注意：默认账号密码guest在程序中可能无法使用，所以需要在图像界面中创建新用户，并分配虚拟主机

### 二、程序中yml配置
#### 1、发送消息的服务配置
```yaml
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    virtual-host: /
    username: fgq
    password: 123456
```

#### 2、接收消息的服务配置
```
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    virtual-host: /
    username: fgq
    password: 123456
    listener:           # 接收消息 ack 回执手动处理，用于捕获消息消费异常情况
      simple:
        acknowledge-mode: manual
```


#### 三、程序中使用
#### 1、发送消息
```
@Autowired
private RabbitTemplate rabbitTemplate;

rabbitTemplate.convertAndSend(队列名称, 消息数据);
```

* 注入 RabbitTemplate，然后使用 convertAndSend 方法发送消息
* 通常情况下，使用上面最简单的消息模型发送消息即可

#### 2、接收消息
```
/**
* 监听消息
* @param message  消息，里面包含消息内容
* @param channel  通道，用于返回 ack 回执
* @param dwxx  消息数据，可以是任意类型
*/
@RabbitListener(queuesToDeclare = @Queue(消息名称))
public void dwxxAdd(Message message, Channel channel, Map<String, Object> msg) throws IOException {
    try {
        // 业务逻辑 .... do some thing
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    } catch (Exception e) {
        if (message.getMessageProperties().getRedelivered()) {
           // .... 非首次异常 .... do some thing
           channel.basicReject(message.getMessageProperties().getDeliveryTag(), false);
        } else {
           // 首次异常，消息重新入队
           channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }
}
```

* 简单模型消息，可通过 @RabbitListener(queuesToDeclare = @Queue(消息名称)) 来监听
