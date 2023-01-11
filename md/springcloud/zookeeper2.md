# ZooKeeper 常用命令
![zk](https://fgq233.github.io/imgs/springcloud/zookeeper3.png)


### 一、服务端 zkServer 常用命令

* 启动服务: ./zkServer.sh start
* 查看服务状态: ./zkServer.sh status
* 停止服务: ./zkServer.sh stop 
* 重启服务: ./zkServer.sh restart 
 
 
 
### 二、客户端 zkCli 常用命令
#### 1. 连接、断开
* 连接ZooKeeper服务端 `./zkCli.sh –server ip:port`
* 断开连接 `quit`
* 查看帮助 `help`
* 显示指定目录下节点 `ls 目录`

#### 2. 增删改查
* 创建节点 `create /节点path value`，value可以不设置
* 获取节点值 `get /节点path`
* 设置节点值 `set /节点path value`
* 删除单个节点 `delete /节点path`
* 删除带有子节点的节点 `deleteall /节点path`


* 创建临时节点 `create -e /节点path value`
* 创建顺序节点 `create -s /节点path value`

#### 3. 节点信息
查询节点详细信息 `ls –s /节点path`

```
czxid：节点被创建的事务ID 
ctime: 创建时间 
mzxid: 最后一次被更新的事务ID 
mtime: 修改时间 
pzxid：子节点列表最后一次被更新的事务ID
cversion：子节点的版本号 

dataversion：数据版本号 
aclversion：权限版本号 
ephemeralOwner：用于临时节点，代表临时节点的事务ID，如果为持久节点则为0 
dataLength：节点存储的数据的长度 
numChildren：当前节点的子节点个数 
```



