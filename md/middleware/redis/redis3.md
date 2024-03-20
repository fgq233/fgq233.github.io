### Redis 主从集群 
* 单节点Redis的并发能力是有上限的，搭建主从集群，实现读写分离，进一步提高Redis的并发能力
* Redis 集群结构比较特殊，因为读多写少，所以采用的是主从集群，写主节点，读分节点
* Redis 集群，主节点要用RDB 持久化，尽量减小对主节点网络的负担

### 一. 搭建主从集群 
#### 1. 模拟3台集群中的服务器

| IP   | PORT         | 角色 |
| ------ | ----------| ---- |
| 127.0.0.1 | 7001 | master |
| 127.0.0.1 | 7002 | slave |
| 127.0.0.1 | 7003 | slave |


* 新建 Redis1、Redis2、Redis3 三个目录
* 将配置文件分别复制到3个目录 `redis1.conf、redis2.conf、redis3.conf`


![Redis主从集群](https://fgq233.github.io/imgs/springcloud/redis1.png)


#### 2. 修改3个目录下配置文件 
```
# 3个Redis端口修改，分别为7001、7002、7003
port 6379

# 3个服务文件保存目录修改
dir D:\MyDevelop\RedisX\Redis1

# 如果是虚拟机，因为虚拟机本身有多个IP，为了避免混乱，需要指定每个节点ip信息
replica-announce-ip 127.0.0.1

# 在所有从节点配置slaveof或replicaof，启动主从关系
slaveof 127.0.0.1 7001
或
replicaof 127.0.0.1 7001
```

slaveof：5.0以前，replicaof：5.0以后

主从分永久和临时两种模式：
* 永久：在redis.conf中配置主节点ip port
* 临时：在redis-cli客户端连接到redis服务，执行命令，这个会在重启后失效

#### 3. 启动所有节点
```
redis-server D:\MyDevelop\RedisX\Redis1\redis1.conf
redis-server D:\MyDevelop\RedisX\Redis2\redis2.conf
redis-server D:\MyDevelop\RedisX\Redis3\redis3.conf
```

#### 4. 测试主从复制
```
# 连接主服务，添加数据
redis-cli -h 127.0.0.1 -p 7001
set name fgq

# 退出
exit

# 连接从服务，获取数据
redis-cli -h 127.0.0.1 -p 7002
get name
```



### 二. 主从同步原理
#### 1. 同步步骤
主从第一次建立连接时，会执行 RDB 全量同步，后续采用增量同步，步骤如下:

* 1、第一次：slave节点请求增量同步
* 2、master节点判断replid，发现不一致，拒绝增量同步
* 3、master将完整内存数据生成RDB，发送RDB到slave
* 4、slave清空本地数据，加载master的RDB
* 5、master将RDB期间的命令记录在repl_backlog，并持续将log中的命令发送给slave
* 6、slave执行接收到的命令，保持与master之间的同步



#### 2. 概念

* Replication Id：简称replid，数据集的标记，id一致则说明是同一数据集，
每一个master都有唯一的replid，slave则会继承master节点的replid

* offset：偏移量，随着记录在repl_backlog中的数据增多而逐渐增大，slave完成同步时也会记录当前同步的offset,
如果slave的offset小于master的offset，说明slave数据落后于master，需要更新

#### 3. 全量、增量判断原理
* slave做数据同步，必须向master声明自己的replid和offset，master才可以判断到底需要同步哪些数据
* 首次：首次replid不一致，说明这是一个全新的slave，要做全量同步
* 后续：replid一致，根据offset做增量同步，只更新slave与master存在差异的部分数据


#### 4.repl_backlog文件
* 这个文件是一个固定大小的数组，只不过数组是环形，角标到达数组末尾后，会再次从0开始读写，
数组头部的数据会被覆盖

* repl_baklog中会记录Redis处理过的命令日志及offset，包括master当前的offset，和slave已经拷贝到的offset


* slave与master的offset之间的差异，就是salve需要增量同步的数据
* 如果slave出现网络阻塞，导致master的offset远远超过了slave的offset，就无法增量同步了，只能重新全量同步



#### 5. 主从集群同步优化


* 在master中配置 `repl-diskless-sync yes` 启用无磁盘复制，避免全量同步时的磁盘IO
* Redis单节点上的内存占用不要太大，减少RDB导致的过多磁盘IO
* 适当提高repl_baklog的大小，发现slave宕机时尽快实现故障恢复，尽可能避免全量同步
* 限制一个master上的slave节点数量，如果实在是太多slave，则可以采用主-从-从链式结构，减少master压力

![Redis主从集群](https://fgq233.github.io/imgs/springcloud/redis2.png)


