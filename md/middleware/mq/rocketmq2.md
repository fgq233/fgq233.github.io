###  RocketMQ 集群搭建
###  一、 RocketMQ 服务端
#### 1. 集群架构图
![](https://fgq233.github.io/imgs/mq/rocketMQ1.png)

#### 2. 集群特点
* `NameServer`是一个无状态节点，可集群部署，节点之间无任何信息同步

* `Broker`部署相对复杂，是主从架构，分为`Master`与`Slave`，每个`Broker`与`NameServer`集群中的所有节点建立长连接，
定时注册`Topic`信息到所有`NameServer`
    * 同一个主从：`BrokerName`相同，`BrokerId`不同，`BrokerId`为0表示`Master`，非0表示`Slave`
    * 不同的主从：`BrokerName` 不同
    
* `Producer、Consumer` 都是与`NameServer`集群中随机一个节点建立长连接，定期取`Topic`路由信息
  * `Producer`向提供`Topic`服务的`Master`建立长连接
  * `Consumer`向提供`Topic`服务的`Master、Slave`建立长连接，订阅规则由`Broker`配置决定

 
### 3. 部署模式
![](https://fgq233.github.io/imgs/mq/rocketMQ4.png)

* 单Master模式：风险大，一旦Broker重启或者宕机，会导致整个服务不可用

* 多Master模式：一个集群无Slave，全是Master
  * 优点：配置简单，单个Master宕机或重启对应用无影响，性能最高
  * 缺点：单台机器宕机期间，这台机器上未被消费的消息在机器恢复之前不可订阅，消息实时性会受到影响

* 多Master多Slave模式（异步）：每个Master配置一个Slave，有多对Master-Slave，HA采用异步复制方式
  * 优点：即使磁盘损坏，消息丢失的非常少，且实时性不会受影响，同时Master宕机后，消费者仍然可以从Slave消费 
  * 缺点：Master宕机，磁盘损坏情况下会丢失少量消息

* 多Master多Slave模式（同步）：和上面不同的是HA采用同步双写方式，即只有主备都写成功，才向应用返回成功
  * 优点：数据与服务都无单点故障，Master宕机情况下，消息无延迟，服务可用性与数据可用性都非常高
  * 缺点：性能比异步复制模式略低

 

###  二、 双主双从同步集群搭建 2m-2s-async
#### 1. 模拟服务器
```
# NameServer
127.0.0.1:9001 rocketmq-nameserver1
127.0.0.1:9002 rocketmq-nameserver2

# Broker
127.0.0.1:10011 rocketmq-master1
127.0.0.1:10021 rocketmq-slave1
127.0.0.1:10031 rocketmq-master2
127.0.0.1:10041 rocketmq-slave2
```
 

#### 2. NameServer配置、启动
新增二台 NameServer 服务器配置文件
* `nameserver-1.properties`，文件内容：`listenPort=9001`
* `nameserver-2.properties`，文件内容：`listenPort=9002`

```
# 指定配置文件启动 NameServer1
start mqnamesrv.cmd -c D:\MyDevelop\RocketMQX\rocketmq-4.9.4\conf\2m-2s-async\nameserver-1.properties

# 指定配置文件启动 NameServer2
start mqnamesrv.cmd -c D:\MyDevelop\RocketMQX\rocketmq-4.9.4\conf\2m-2s-async\nameserver-2.properties
```

#### 3. Broker 配置
`Broker` 集群各个节点之间有区别的主要是：`brokerName、brokerId、listenPort、brokerRole、存储路径`

* `brokerClusterName`：Broker集群名字

* `brokerName`：Broker名字

* `brokerId`：0表示Master，>0表示 Slave

* `namesrvAddr`：NameServer地址

* `listenPort`：对外服务的监听端口

* `deleteWhen`：删除文件时间点，默认凌晨 4点

* `fileReservedTime`：文件保留时间，默认 48 小时

* `brokerRole`：Broker 的角色
  * `ASYNC_MASTER` 异步的主
  * `SYNC_MASTER` 同步的主
  * `SLAVE` 从

* `flushDiskType`：刷盘方式
  * `SYNC_FLUSH`  同步刷盘
  * `ASYNC_FLUSH `  异步刷盘

* 文件存储路径
  * `storePathRootDir`：存储路径
  * `storePathCommitLog`：commitLog 存储路径
  * `storePathConsumeQueue`：消费队列存储路径存储路径
  * `storePathIndex`：消息索引存储路径
  * `storeCheckpoint`：checkpoint 文件存储路径
  * `abortFile`：abort 文件存储路径


```
brokerClusterName=fgq-rocketmq-cluster
brokerName=broker-a
brokerId=0
namesrvAddr=127.0.0.1:9001;127.0.0.1:9002
listenPort=10001
deleteWhen=04
fileReservedTime=48
brokerRole=SYNC_MASTER
flushDiskType=SYNC_FLUSH
 
storePathRootDir=../data/broker-a-master
storePathCommitLog=../data/broker-a-master/commitlog
storePathConsumeQueue=../data/broker-a-master/consumequeue
storePathIndex=../data/broker-a-master/index
storeCheckpoint=../data/broker-a-master/checkpoint
abortFile=../data/broker-a-master/abort
```

其他3个节点配置分别如下


<details><summary>broker-a-s.properties</summary>
<pre><code>
brokerClusterName=fgq-rocketmq-cluster
brokerName=broker-a
brokerId=1
namesrvAddr=127.0.0.1:9001;127.0.0.1:9002
listenPort=10011
deleteWhen=04
fileReservedTime=48
brokerRole=SLAVE
flushDiskType=SYNC_FLUSH

storePathRootDir=../data/broker-a-slave
storePathCommitLog=../data/broker-a-slave/commitlog
storePathConsumeQueue=../data/broker-a-slave/consumequeue
storePathIndex=../data/broker-a-slave/index
storeCheckpoint=../data/broker-a-slave/checkpoint
abortFile=../data/broker-a-slave/abort
</code></pre>
</details>

<details><summary>broker-b.properties</summary>
<pre><code>
brokerClusterName=fgq-rocketmq-cluster
brokerName=broker-b
brokerId=0
namesrvAddr=127.0.0.1:9001;127.0.0.1:9002
listenPort=10031
deleteWhen=04
fileReservedTime=48
brokerRole=SYNC_MASTER
flushDiskType=SYNC_FLUSH

storePathRootDir=../data/broker-b-master
storePathCommitLog=../data/broker-b-master/commitlog
storePathConsumeQueue=../data/broker-b-master/consumequeue
storePathIndex=../data/broker-b-master/index
storeCheckpoint=../data/broker-b-master/checkpoint
abortFile=../data/broker-b-master/abort
</code></pre>
</details>

<details><summary>broker-b-s.properties</summary>
<pre><code>
brokerClusterName=fgq-rocketmq-cluster
brokerName=broker-b
brokerId=1
namesrvAddr=127.0.0.1:9001;127.0.0.1:9002
listenPort=10041
deleteWhen=04
fileReservedTime=48
brokerRole=SLAVE
flushDiskType=SYNC_FLUSH

storePathRootDir=../data/broker-b-slave
storePathCommitLog=../data/broker-b-slave/commitlog
storePathConsumeQueue=../data/broker-b-slave/consumequeue
storePathIndex=../data/broker-b-slave/index
storeCheckpoint=../data/broker-b-slave/checkpoint
abortFile=../data/broker-b-slave/abort
</code></pre>
</details>


#### 4. 创建存储路径
* 将配置里面的`storePathRootDir`存储路径创建出来
* 注意：同一台机器上模拟Broker节点时，存储路径不能一样，否则会冲突，导致启动不了

#### 5.  Broker 启动
```
# broker-a 主从
start mqbroker.cmd -c D:\MyDevelop\RocketMQX\rocketmq-4.9.4\conf\2m-2s-async\broker-a.properties
start mqbroker.cmd -c D:\MyDevelop\RocketMQX\rocketmq-4.9.4\conf\2m-2s-async\broker-a-s.properties

# broker-b 主从
start mqbroker.cmd -c D:\MyDevelop\RocketMQX\rocketmq-4.9.4\conf\2m-2s-async\broker-b.properties
start mqbroker.cmd -c D:\MyDevelop\RocketMQX\rocketmq-4.9.4\conf\2m-2s-async\broker-b-s.properties
```


#### 6.  Rocketmq-dashboard 修改配置、启动
```
application.properties 配置
rocketmq.config.namesrvAddr=127.0.0.1:9001;127.0.0.1:9002

打包
mvn clean package -Dmaven.test.skip=true

启动
java -jar target/rocketmq-dashboard-1.0.0.jar
```

![](https://fgq233.github.io/imgs/mq/rocketMQ5.png)