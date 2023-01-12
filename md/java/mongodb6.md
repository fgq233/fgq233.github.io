### MongoDB 副本集搭建
一主一副本一仲裁

| 节点    | ip        | port  |
| ------ | ----------| ----- |
| 主     | 127.0.0.1 | 27017 |
| 副本   | 127.0.0.1 | 27018 |
| 仲裁   | 127.0.0.1 | 27019 |


 
### 一、副本集搭建
#### 1. 3个服务实例
* 建立3个目录，分别是：`mongodb1、mongodb2、mongodb3`
* 3份安装目录下分别建立存放数据、日志、配置文件的目录和文件
    * `mongodb1/data/db、mongodb1/conf/mongodb1.conf 、mongodb1/log`
    * `mongodb2/data/db、mongodb2/conf/mongodb2.conf 、mongodb2/log `
    * `mongodb3/data/db、mongodb3/conf/mongodb3.conf 、mongodb3/log `

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
  bindIp: localhost,127.0.0.1           
  port: 27017  
replication:
  replSetName: fgq233    # 副本集名称
```

#### 3. 启动所有服务实例
```
mongod -f   D:\MyDevelop\MongoDB\mongodb1\conf\mongodb1.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb2\conf\mongodb2.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb3\conf\mongodb3.conf
```

#### 4. 初始化副本集