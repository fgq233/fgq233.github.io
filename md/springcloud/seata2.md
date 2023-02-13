### Seata-部署、集成
### 一、Seata
#### 1. Seata 架构
Seata是一款开源的分布式事务解决方案，官网：[http://seata.io](http://seata.io)

![Seata](https://fgq233.github.io/imgs/springcloud/seata2.jpg)

Seata事务管理中有三个重要的角色：

- **TC (Transaction Coordinator)** 事务协调者：维护全局和分支事务的状态，驱动全局事务提交或回滚

- **TM (Transaction Manager)** 事务管理器：开始全局事务、提交或回滚全局事务

- **RM (Resource Manager)** 资源管理器：管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，
并驱动分支事务提交或回滚



#### 2. 四种分布式事务解决方案
Seata提供了四种不同的分布式事务解决方案：

* XA模式： 强一致性的分阶段事务模式，牺牲了一定的可用性，无业务侵入
    * 只支持实现了XA协议的数据库：MySQL、Oracle、PostgreSQL、MariaDB

* AT模式： 最终一致的分阶段事务模式，无业务侵入，也是Seata的默认模式
    * 支持基于本地ACID事务的关系型数据库：MySQL、Oracle、PostgreSQL、TiDB、MariaDB
    
* TCC模式：最终一致的分阶段事务模式，有业务侵入（要编写3个接口）
    * 不依赖数据源(1.4.2版本及之前)，1.4.2版本之后增加了TCC防悬挂措施，需要数据源支持

* SAGA模式：长事务模式，有业务侵入（要编写状态机和补偿机制）
    * 不依赖数据源

 
 
 
 
 
### 二、Seata 部署
#### 1. 下载
* Seata官网：[https://seata.io/zh-cn/blog/download.html](https://seata.io/zh-cn/blog/download.html)
* GitHub地址：[https://github.com/seata/seata/tags](https://github.com/seata/seata/tags)

#### 2. 解压
![解压目录结构](https://fgq233.github.io/imgs/springcloud/seata3.png)

#### 3. 修改配置
修改conf目录下的 registry.conf 文件：

```
registry {
  # tc服务的注册中心类，支持file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
  type = "nacos"

  nacos {
    # seata tc 服务注册到 nacos的相关配置，可以自定义
    application = "seata-server"
    serverAddr = "127.0.0.1:8848"
    group = "SEATA_GROUP"
    namespace = ""
    cluster = "default"
    username = "nacos"
    password = "nacos"
  }
}

config {
  # 读取tc服务端的配置文件的方式，支持file、nacos 、apollo、zk、consul、etcd3
  type = "nacos"
  nacos {
    serverAddr = "127.0.0.1:8848"
    namespace = ""
    group = "SEATA_GROUP"
    username = "nacos"
    password = "nacos"
    dataId = "seataServer.properties"
  }
}
```


#### 4. 在nacos 配置中心添加配置

* 根据步骤3的config {...}内容在nacos 配置中心添加配置 seataServer.properties
* 更多配置参考：[https://seata.io/zh-cn/docs/user/configurations.html](https://seata.io/zh-cn/docs/user/configurations.html)


``` 
# db数据库存储方式，db代表数据库，支持mysql、oracle、db2、sqlserver......
store.mode=db
store.db.datasource=druid
store.db.dbType=mysql
# 5.X Mysql 驱动
# store.db.driverClassName=com.mysql.jdbc.Driver
# 8.X Mysql 驱动
store.db.driverClassName=com.mysql.cj.jdbc.Driver
store.db.url=jdbc:mysql://127.0.0.1:3306/seata?useUnicode=true&rewriteBatchedStatements=true&serverTimezone=UTC
store.db.user=root
store.db.password=123456


# Redis 数据存储方式
store.mode=redis
store.redis.host=127.0.0.1
store.redis.port=9002
store.redis.database=1
store.redis.password=123456
```
  
#### 5. 新建seata 数据库 或 Redis
使用数据库模式时，需要创建数据库，导入相关表，具体参考解压后 conf 目录下 README.md
* global_table：全局事务
* branch_table：分支事务
* lock_table：锁相关的信息
* undo_log：AT模式下保存快照数据，需要放到微服务库下，而不是seata库

#### 6. 启动
* 启动 bin目录下 seata-server.bat
* nacos 服务列表中出现 seata-server 服务，启动成功









### 三、微服务集成 Seata
#### 1. 添加依赖
```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
    <exclusions>
        <!--版本较低，1.3.0，因此排除-->
        <exclusion>
            <artifactId>seata-spring-boot-starter</artifactId>
            <groupId>io.seata</groupId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>io.seata</groupId>
    <artifactId>seata-spring-boot-starter</artifactId>
    <version>1.5.2</version>
</dependency>
```

#### 2. yml配置
```yml
seata:
  registry:                             # 注册中心，参考registry.conf的registry
    type: nacos
    nacos:
      application: seata-server
      server-addr: 127.0.0.1:8848
      group : "SEATA_GROUP"
      namespace: ""
      cluster: AAA
      username: "nacos"
      password: "nacos"
  tx-service-group: my-service-group    # 事务分组配置
  service:
    vgroup-mapping:                    
      my-service-group: default         # 事务分组与集群映射关系(等号右侧的集群名需要与Seata-server注册到Nacos的cluster保持一致)
```

确保处于同一个namespace和group，不然会找不到服务


