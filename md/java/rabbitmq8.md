### 惰性队列
RabbitMQ从3.6.0版本开始，增加了Lazy Queues的概念，也就是惰性队列，特征如下：
* 接收到消息后直接存入磁盘而非内存
* 消费者要消费消息时才会从磁盘中读取并加载到内存
* 支持数百万条的消息存储

要设置一个队列为惰性队列，只需要在声明队列时，指定x-queue-mode属性为lazy即可


#### 1. 基于@Bean声明lazy-queue
```
@Bean
    public Queue lazyQueue(){
        return QueueBuilder
                .durable("lazy.queue")
                .lazy()
                .build();
    }
```

#### 2. 基于@RabbitListener声明lazy-queue

```
@RabbitListener(queuesToDeclare = @Queue(
    name ="lazy.queue", durable = "true", 
    arguments = @Argument(name = "x-queue-mode", value = "lazy")
))
public void listenerLazyQueue(String msg) throws IOException {
    System.out.println(msg);
}
```

#### 3. 将运行的队列修改为惰性队列
通过下列命令，可以将运行的队列修改为惰性队列

```
rabbitmqctl set_policy Lazy "^lazy-queue$" '{"queue-mode":"lazy"}' --apply-to queues  
```

命令解读：

- `rabbitmqctl` ：RabbitMQ的命令行工具
- `set_policy` ：添加一个策略
- `Lazy` ：策略名称，可以自定义
- `"^lazy-queue$"` ：用正则表达式匹配队列的名字
- `'{"queue-mode":"lazy"}'` ：设置队列模式为lazy模式
- `--apply-to queues  `：策略的作用对象，是所有的队列


#### 4. 惰性队列优缺点
优点
* 基于磁盘存储，消息上限高
* 没有间歇性的page-out，性能比较稳定

缺点
* 基于磁盘存储，消息时效性会降低
* 性能受限于磁盘的IO

