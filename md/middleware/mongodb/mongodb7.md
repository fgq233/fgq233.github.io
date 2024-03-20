### MongoDB 分片集群搭建 - Windows
两个分片节点副本集（3+3）+一个配置节点副本集（3）+两个路由节点（2），共11个服务节点

| 节点    | ip        | port  |
| ------ | ----------| ----- |
| 分片节点副本集1     | 127.0.0.1 | 27001、27002、27003 |
| 分片节点副本集2     | 127.0.0.1 | 27004、27005、27006 |
| 配置节点副本集      | 127.0.0.1 | 27007、27008、27009 |
| 路由节点           | 127.0.0.1 | 27101、27102        |


9 个实例有一些通用配置，只有下面几个选项不一样

* `systemLog.path`：日志目录
* `storage.dbPath`：数据文件目录，路由服务不需要该配置
* `processManagement.pidFilePath`：进程pid文件
* `net.bindIp`：ip
* `net.port`：端口

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
```



### 一、搭建分片副本集、配置节点副本集
参考[副本集搭建](https://fgq233.github.io/md/nosql/mongodb6)

#### 1. 9个服务实例目录、配置文件
* `mongodb1/data/db、mongodb1/mongodb1.conf 、mongodb1/log`
* `mongodb2/data/db、mongodb2/mongodb2.conf 、mongodb2/log `
* `mongodb3/data/db、mongodb3/mongodb3.conf 、mongodb3/log `
* `mongodb4/data/db、mongodb4/mongodb4.conf 、mongodb4/log `
* `mongodb5/data/db、mongodb5/mongodb5.conf 、mongodb5/log `
* `mongodb6/data/db、mongodb6/mongodb6.conf 、mongodb6/log `
* `mongodb7/data/db、mongodb7/mongodb7.conf 、mongodb7/log `
* `mongodb8/data/db、mongodb8/mongodb8.conf 、mongodb8/log `
* `mongodb9/data/db、mongodb9/mongodb9.conf 、mongodb9/log `

#### 2. 配置文件内容
```
插入通用配置，更改为自己实例的
replication:
  replSetName: shard1        # 副本集名称，1~3为shard1，4~6为shard2，7~9为configShard
sharding:
  clusterRole: shardsvr      # 集群角色，1~6为shardsvr，7~9为configsvr
```

`sharding.clusterRole`：集群角色
* `configsvr`：配置服务
* `shardsvr`：分片服务

#### 3. 启动所有服务实例
```
mongod -f   D:\MyDevelop\MongoDB\mongodb1\mongodb1.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb2\mongodb2.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb3\mongodb3.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb4\mongodb4.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb5\mongodb5.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb6\mongodb6.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb7\mongodb7.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb8\mongodb8.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb9\mongodb9.conf
```

#### 4. 初始化3套副本集
```
# 分片1副本集
mongo --host=127.0.0.1 --port=27001
rs.initiate()
rs.add("127.0.0.1:27002")
rs.addArb("127.0.0.1:27003")

# 分片2副本集
mongo --host=127.0.0.1 --port=27004
rs.initiate()
rs.add("127.0.0.1:27005")
rs.addArb("127.0.0.1:27006")

# 配置副本集
mongo --host=127.0.0.1 --port=27007
rs.initiate()
rs.add("127.0.0.1:27008")
rs.add("127.0.0.1:27009")
```


### 二、搭建路由服务
参考[副本集搭建](https://fgq233.github.io/md/nosql/mongodb6)

#### 1. 2个服务实例目录、配置文件
路由节点主要负责分发，不需要data目录，只需要日志、配置文件
* `mongodb101/mongos101.conf 、mongodb101/log `
* `mongodb102/mongos102.conf 、mongodb102/log `

 
#### 2. 配置文件内容
```
systemLog:
  destination: file                                     
  path: D:\MyDevelop\MongoDB\mongodb101\log\mongod.log    
  logAppend: true                                                   
processManagement:
  pidFilePath: D:\MyDevelop\MongoDB\mongodb101\log\pid.txt  
net:
  bindIp: 127.0.0.1           
  port: 27102
sharding:
  configDB: configShard/127.0.0.1:27007,127.0.0.1:27008,127.0.0.1:27009
```

`configDB`：指定配置节点副本集


#### 3. 启动路由服务
启动路由服务使用的是 **mongos** 服务

```
mongos -f   D:\MyDevelop\MongoDB\mongodb101\mongos101.conf
mongos -f   D:\MyDevelop\MongoDB\mongodb102\mongos102.conf
```

#### 4. 添加分片
语法

```
# 添加分片
sh.addShard("ip:port")            # 添加单机
sh.addShard("副本集名称/ip:port")  # 添加副本集
或
use admin
db.runCommand({addshard:"shard1/127.0.0.1:27001,127.0.0.1:27002,127.0.0.1:27003"});

# 移除分片
use admin
db.runCommand( { removeShard: "shard1" } )
```

示例

```
# 先连接路由服务
mongo --host=127.0.0.1 --port=27101
# 添加分片
sh.addShard("shard1/127.0.0.1:27001,127.0.0.1:27002,127.0.0.1:27003")
sh.addShard("shard2/127.0.0.1:27004,127.0.0.1:27005,127.0.0.1:27006")
```

* 添加分片的ip:port 使用的是副本集中 `members` 下节点的`name`，可在副本集中通过 **rs.status()** 查看
* 添加完成通过 **sh.status()** 查看




#### 5. 开启分片功能
```
# 开启分片
sh.enableSharding("库名")
# 设置集合分片
sh.shardCollection(namespace, key, unique)


# 示例
sh.enableSharding("fgq")
sh.shardCollection("fgq.user",{"starnum":"1"})
sh.shardCollection("fgq.blog",{"starnum":"hashed"})
```

对集合分片，必须使用 `sh.shardCollection()` 方法指定集合和分片的键
* `namespace`：要分片的目标集合的命名空间，格式：库名.集合名
* `key`：根据哪个字段分片、分片策略
    * 一个集合只能指定一个分片的键，否则报错
    * 一旦对一个集合分片，分片键和分片值就不可改变
* `unique`：若key 有唯一索引，则设置为true可以提高性能，默认是false，注意：哈希策略片键不支持

分片策略
* 哈希策略：使用某个字段哈希值进行数据分片
* 范围策略：使用某个字段值的范围进行数据分片




### 三、SpringData MongoDB连接路由服务
使用路由服务连接

```
spring:
  data:
    mongodb:
      uri: mongodb://127.0.0.1:27101,127.0.0.1:27102/fgq
```

 