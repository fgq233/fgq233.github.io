# ZooKeeper 介绍
### 一、介绍
ZooKeeper是一个分布式应用程序协调服务
 
### 二、ZooKeeper 作用
#### 1. 注册中心
* RPC框架中有3个重要的角色
    * 注册中心：保存所有服务的名字，服务提供者的IP列表，服务消费者的IP列表
    * 服务提供者：提供跨进程服务
    * 服务消费者：寻找到指定命名的服务并消费
* 发布者(producer)将数据发布到zk节点上，供订阅者(consumer)动态获取

#### 2. 配置中心
统一把配置文件存放zk，由zk统一分发修改的内容到各台机器

#### 3. 分布式锁
由zk统一进行协调，保证数据的一致性

#### 4. 集群的管理
Worker集群监控，保证主数据和备份数据的一致


### 三、ZooKeeper 的数据结构
#### 1. 结构图
* ZooKeeper的数据结构，跟Unix文件系统非常类似，是一个树形结构，树上每个节点叫做 `ZNode`
* 节点可以拥有子节点，同时也允许少量（1MB）数据存储在该节点之下
* 每个 `ZNode` 节点上都可以保存自己的数据和节点信息

![zk](https://fgq233.github.io/imgs/springcloud/zookeeper1.png)

#### 2. 节点类型
ZNode 节点可以分为四大类：
* PERSISTENT 持久化节点 : 当客户端和服务端断开连接后，所创建的Znode(节点)不会删除
* EPHEMERAL 临时节点 ：当客户端和服务端断开连接后，所创建的Znode(节点)会自动删除
* PERSISTENT_SEQUENTIAL 带序号的持久化节点 ：-s
* EPHEMERAL_SEQUENTIAL 带序号的临时节点  ：-es


### 四、ZooKeeper 注册中心原理
![zk](https://fgq233.github.io/imgs/springcloud/zookeeper2.png)


* 在 ZK 中进行服务注册，实际上就是在 ZK 中创建了 `znode` 节点，
节点中存储了服务的ip、端口、调用方式(协议、序列化方式)等信息 `/{service}/{version}/{ip:port}`
    
* `注册`：服务提供者启动时，将其服务名称，ip地址注册到配置中心
* `消费`：服务消费者在第一次调用服务时，会通过注册中心找到相应服务的ip地址列表，并缓存到本地，以供后续使用
* `负载均衡`：当消费者再次调用服务时，不会再去请求注册中心，而是直接通过负载均衡算法从缓存列表中取一个提供者
* `心跳检测`：定时向各个服务提供者发送一个请求检测服务是否正常，同时通知消费者


### 五、ZooKeeper 下载启动
#### 1. 下载
* [https://archive.apache.org/dist/zookeeper](https://archive.apache.org/dist/zookeeper)
* [https://zookeeper.apache.org/releases.html#download](https://zookeeper.apache.org/releases.html#download)
* 国内镜像：[https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper](https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper)
  

#### 2. 解压
* windows 系统上 解压会报错，可以打开Windows上的Linux环境，`win + R，输入：PowerShell`
* cd 进入文件所在目录，解压 `tar -zxvf xxx.gz`

#### 3. 配置文件
* 将 `conf` 目录下 `zoo_sample.cfg` 复制一份，修改名称为 `zoo.cfg`
* zookeeper 审核日志是默认关闭的， `zoo.cfg` 中 添加一行配置 `audit.enable=true`

#### 4. 启动
* windows 下启动  `zkServer.cmd`，启动后使用 `zkCli.cmd` 测试
* Linux 下启动  `zkServer.sh`，启动后使用 `zkCli.sh` 测试

#### 5. zkCli 测试
运行 `ls /` 命令

#### 6. zoo.cfg 其他配置
```
# session的会话时间,单位ms
tickTime=2000

# 服务器启动以后，master和slave通讯的时间
initLimit=10

# master和slave之间的心跳检测时间，检测slave是否存活
syncLimit=5

# 数据文件目录
dataDir=/tmp/zookeeper

# 客户端访问zk的端口
clientPort=2181
```


### 六、ZooKeeper 集群搭建步骤
#### 1. 安装 JDK
#### 2. 准备多台 `ZooKeeper` 服务器节点
下载 `ZooKeeper` 安装包，复制到各个服务器后解压

#### 3. 各服务器 ZooKeeper 相同操作
* 创建 data 目录
* 将 `conf`下 `zoo_sample.cfg` 文件改名为 zoo.cfg
* 配置 `dataDir` 为data 目录
* 配置 `clientPort`

#### 4. 创建 myid 文件
在每个ZooKeeper 的 `data` 目录下创建一个 `myid` 文件，内容分别是1、2、3 ，这个文件记录每个服务器的ID

#### 5. 配置集群服务器IP列表
在每个ZooKeeper 的 zoo.cfg 配置客户端访问端口（clientPort）和集群服务器IP列表

```
server.1=127.0.0.1:2881:3881
server.2=127.0.0.1:2882:3882
server.3=127.0.0.1:2883:3883
```

server.服务器ID=服务器IP地址：服务器之间通信端口：服务器之间投票选举端口

#### 6. 启动所有 ZooKeeper 实例
