###  RocketMQ 安装
###  一、 RocketMQ 服务端
#### 1. 下载
* 官网地址：[https://rocketmq.apache.org](https://rocketmq.apache.org)
* Apache地址：[https://archive.apache.org/dist/rocketmq](https://archive.apache.org/dist/rocketmq)
* 环境：`JDK 1.8+`

#### 2. RocketMQ 中角色
![](https://fgq233.github.io/imgs/mq/rocketMQ1.png)

* Producer：消息的发送者

* Consumer：消息接收者
  * 每一个 consumer 都属于一个 consumer group
  * 每一条消息只会被同一个 consumer group 里的一个 consumer 实例消费
  * 不同consumer group可以同时消费同一条消息

* Broker：暂存和传输消息

* NameServer：管理 Broker


#### 3. 启动前
* windows 启动需要配置 `JAVA_HOME、ROCKETMQ_HOME` 系统变量
* 默认启动占用内存太大，根据需要调整 `runserver.cmd、runbroker.cmd` 中占用内存大小
* `runbroker.cmd` 中 `CLASSPATH` 配置需要加上双引号

```
// runserver.cmd、runbroker.cmd 
set "JAVA_OPT=%JAVA_OPT% -server -Xms512m -Xmx512m -Xmn512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
set "JAVA_OPT=%JAVA_OPT% -server -Xms512m -Xmx512m"

// runbroker.cmd
set "JAVA_OPT=%JAVA_OPT% -cp "%CLASSPATH%""
```

#### 4. 启动 NameServer 服务
* 启动 `mqnamesrv.cmd`
* 默认 `NameServer` 端口为 9876，启动成功如下

![](https://fgq233.github.io/imgs/mq/rocketMQ2.png)

#### 5. 启动 Broker 服务
* 启动 `Broker` 服务需要指定 `NameServer` 地址
* 方式1：在命令行指定：`mqbroker.cmd -n localhost:9876 autoCreateTopicEnable=true`
* 方式2：配置文件指定：`mqbroker.cmd -c D:\MyDevelop\RocketMQX\rocketmq-4.9.4\conf\broker.conf`

<details><summary>broker.conf</summary><pre><code>
brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH

# NameServer 地址
namesrvAddr=127.0.0.1:9876
</code></pre></details>


![](https://fgq233.github.io/imgs/mq/rocketMQ3.png)


###  二、 可视化控制台 Rocketmq-Dashboard
#### 1. 下载
* 老版本的叫`rocketmq-console`，目前更名为`rocketmq-dashboard`
* github 下载地址：[https://github.com/apache/rocketmq-dashboard/tags](https://github.com/apache/rocketmq-dashboard/tags)
* apache 下载地址：[https://archive.apache.org/dist/rocketmq/rocketmq-dashboard](https://archive.apache.org/dist/rocketmq/rocketmq-dashboard)
* 环境：`JDK 1.8+`

#### 2. 修改配置
`rocketmq-dashboard`是一个`SpringBoot`项目，修改配置文件：`application.properties`

```yaml
# namesrvAddr 的地址，多个的话以逗号隔开
rocketmq.config.namesrvAddr=127.0.0.1:9876
```

#### 3. 打包、启动、访问
* 打包：在 pom.xml 所在位置打开命令行，使用 maven 打包命令打包
* 启动：使用 java -jar 启动项目
* 访问：若`application.properties` 未配置端口，直接通过 [http://localhost:8080](http://localhost:8080) 访问

```
打包
mvn clean package -Dmaven.test.skip=true

启动
java -jar target/rocketmq-dashboard-1.0.0.jar
```


###  三、 权限控制
* `RocketMQ` 在`4.4.0`版本开始支持`ACL`，在`conf`目录下`broker.conf`开启，在`plain_acl.yml`具体配置
* `ACL：Access Control List`，访问控制列表
  * 用户
  * 资源
  * 权限
  * 角色
  
#### 1. broker.conf 中启用访问控制
```
aclEnable=true
```

#### 2. plain_acl.yml 配置访问控制详情
```
globalWhiteRemoteAddresses:         # 全局IP白名单
  - 10.10.103.*
  - 192.168.0.*

accounts:                          # 账号(可以配置多个)
  - accessKey: RocketMQ            # 登录用户名
    secretKey: 12345678            # 登录密码
    whiteRemoteAddress:            # 用户级别的IP白名单
    admin: false                   # 是否是管理员
    defaultTopicPerm: DENY         # 默认 topic 权限
    defaultGroupPerm: SUB          # 默认 group 权限
    topicPerms:                    # topic 权限
      - topicA=DENY
      - topicB=PUB|SUB
      - topicC=SUB
    groupPerms:                   # group 权限
      # the group should convert to retry topic
      - groupA=DENY
      - groupB=PUB|SUB
      - groupC=SUB

  - accessKey: rocketmqX
    secretKey: 12345678
    whiteRemoteAddress: 192.168.1.*
    # if it is admin, it could access all resources
    admin: true
```


#### 3. 程序中 application.yaml 配置 
```
# 生产者
rocketmq:
  producer:
    access-key: rocketmqX
    secret-key: 12345678

# 消费者
rocketmq:
  consumer:
    access-key: rocketmqX
    secret-key: 12345678
```