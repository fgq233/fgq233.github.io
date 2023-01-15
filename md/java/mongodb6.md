### MongoDB 副本集搭建 - Windows
一主一副本一仲裁

| 节点    | ip        | port  |
| ------ | ----------| ----- |
| 主     | 127.0.0.1 | 27017 |
| 副本   | 127.0.0.1 | 27018 |
| 仲裁   | 127.0.0.1 | 27019 |


 
### 一、副本集搭建
#### 1. 3个服务实例
* 建立3个目录，分别是：`mongodb1、mongodb2、mongodb3`
* 3份安装目录下分别建立存放数据、日志、配置文件
    * `mongodb1/data/db、mongodb1/mongodb1.conf 、mongodb1/log`
    * `mongodb2/data/db、mongodb2/mongodb2.conf 、mongodb2/log `
    * `mongodb3/data/db、mongodb3/mongodb3.conf 、mongodb3/log `

#### 2. 配置文件内容
配置文件添加配置，下列配置需要修改为各自实例的
* `systemLog.path`
* `storage.dbPath`
* `processManagement.pidFilePath`
* `net.bindIp`
* `net.port`

```
systemLog:
  destination: file                                     
  path: D:\MyDevelop\MongoDB\mongodb1\log\mongod.log    
  logAppend: true                        
storage:
  dbPath: D:\MyDevelop\MongoDB\mongodb1\data\db        
  journal:
    enabled: true                           
processManagement:
  pidFilePath: D:\MyDevelop\MongoDB\mongodb1\log\pid.txt  
net:
  bindIp: 127.0.0.1           
  port: 27017  
replication:
  replSetName: fgq233    # 副本集名称
```

#### 3. 启动所有服务实例
```
mongod -f   D:\MyDevelop\MongoDB\mongodb1\mongodb1.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb2\mongodb2.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb3\mongodb3.conf
```

#### 4. 初始化副本集
* 所有节点启动后，一开始是没有任何关系的
* 连接主节点，进行副本集初始化

```
# 连接主节点
mongo --host=127.0.0.1 --port=27017

# 初始化副本集(使用默认副本集配置)
rs.initiate()
```

![mongodb](https://fgq233.github.io/imgs/java/mongodb2.png)

* `ok` 的值为1，说明创建成功
* 命令行提示符发生变化，变成了一个从节点角色，此时默认不能读写，稍等片刻，回车，变成`主节点`



#### 5. 查看副本集配置、状态
```
# 查看副本集配置，configuration：可选，如果没有配置，则使用默认主节点配置
rs.conf(configuration)
rs.config(configuration)

# 查看副本集状态，返回的数据和conf差不多
rs.status()

配置修改
# 1、定义变量
var cfg = rs.conf()
# 2、修改变量
cfg.members[1].priority=2
# 3、使用变量重新加载配置
rs.reconfig(cfg)
```

<details>
<summary>副本集配置</summary>
<pre><code>
{
        "_id" : "fgq233",
        "version" : 1,
        "term" : 1,
        "members" : [
                {
                        "_id" : 0,
                        "host" : "127.0.0.1:27017",
                        "arbiterOnly" : false,
                        "buildIndexes" : true,
                        "hidden" : false,
                        "priority" : 1,
                        "tags" : {

                        },
                        "secondaryDelaySecs" : NumberLong(0),
                        "votes" : 1
                }
        ],
        "protocolVersion" : NumberLong(1),
        "writeConcernMajorityJournalDefault" : true,
        "settings" : {
                "chainingAllowed" : true,
                "heartbeatIntervalMillis" : 2000,
                "heartbeatTimeoutSecs" : 10,
                "electionTimeoutMillis" : 10000,
                "catchUpTimeoutMillis" : -1,
                "catchUpTakeoverDelayMillis" : 30000,
                "getLastErrorModes" : {

                },
                "getLastErrorDefaults" : {
                        "w" : 1,
                        "wtimeout" : 0
                },
                "replicaSetId" : ObjectId("63c238b0f2ab0cef182e6e75")
        }
}
</code></pre>
</details>



副本集配置的查看命令，本质查询的是 `local` 库下 `system` 集合 `replset` 文档中的数据
* `id` : 副本集名称
* `members` ：副本集成员数组
    * host：主机的`ip：port`
    * arbiterOnly：是否仲裁节点
    * priority：优先级（权重值）
* `settings`：副本集的参数配置


 


#### 6. 添加从节点：副本成员、仲裁
在主节点添加从节点，将其他成员加入到副本集

```
# 添加副本集成员
rs.add(host, arbiterOnly)
# 添加仲裁节点
rs.addArb(host)

rs.add("127.0.0.1:27018")
rs.addArb("127.0.0.1:27019")
```

* host：要添加到副本集的新成员，指定为字符串(`主机ip:port`)或配置文档(rs.conf查询出来members的配置文档)
* arbiterOnly：可选参数，仅在 host 值为字符串时适用，如果为true，则表示添加的主机是仲裁者
    * Mongodb 5.x的版本中，添加仲裁节点的话可能会遇到执行命令后卡主而导致无法添加仲裁节点的问题
    * 主节点执行 `db.adminCommand({"setDefaultRWConcern" : 1,"defaultWriteConcern" : {"w" : 2}})` 再添加即可



#### 7. 副本集、仲裁节点的数据读写操作
* 默认情况下，从节点是没有读写权限的，可以增加读的权限，但需要进行设置(`slaveOk 或 secondaryOk`)
* 仲裁者节点，不存放任何业务数据 

```
# 连接从节点：副本成员
mongo --host=127.0.0.1 --port=27018

# 在从节点中，设置副本成员获取到读权限，参数省略表示true，获取到读权限，false失去读权限
rs.slaveOk()  或  rs.slaveOk(true)
rs.slaveOk(false)

# 在从节点中，设置副本成员获取到读权限，参数省略表示true，获取到读权限，false失去读权限
rs.secondaryOk() 或  rs.secondaryOk(true)
rs.secondaryOk(false)
```

到此实现了副本集集群搭建






### 二、自动故障转移测试
#### 1. 副本节点挂掉
关闭 27018 服务 
* 主节点 27017 读写不受影响
* 重启副本节点 27018 服务，主节点在此期间写入的数据，会自动同步给从节点


#### 2. 主节点挂掉
关闭 27017 服务
* 副本集有3个节点，自己1票、仲裁者1票，大于N/2 + 1，副本节点升级为主节点，具备读写功能
* 重启 27017，27017 变成副本节点，数据自动从 27018 同步


#### 3. 仲裁节点、主节点挂掉
先关闭 27019服务、再关闭 27017服务
* 副本节点 还是 副本节点，因为选票只有 1票，不满足`大多数`要求
* 只重启 27019，27018 获取2票，变成主节点
* 先重启 27017，再重启 27019， 27017和27018票数一致，但27018数据更新，成为主节点


#### 4. 仲裁节点、从节点挂掉
先关闭 27019服务、再关闭 27018服务
* 10秒后，27017主节点自动降级为副本节点
* 副本集故障，不可写数据，只能读取数据






### 三、SpringData MongoDB连接副本集
```
# MongoDB客户端连接语法
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

# 副本集连接
spring:
  data:
    mongodb:                                                                            
      uri: mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/fgq?connect=replicaSet&slaveOk=true&replicaSet=fgq233
```

* `slaveOk=true`：开启副本节点读的功能
* `connect=replicaSet`：自动到副本集中选择读写的主机，如果slaveOK是打开的，则实现了读写分离
* `replicaSet=fgq233`：副本集名称
 
 