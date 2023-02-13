### 分库分表
核心思想：将数据拆分，分散存储，使得单一数据库/表的数据量变小，从而提升数据库性能

![](https://fgq233.github.io/imgs/mysql/fkfb1.png)

### 一、垂直拆分
![](https://fgq233.github.io/imgs/mysql/fkfb2.png)

#### 1. 垂直分库
以表为依据，将不同业务的表拆分到不同数据库中

* 每个库`表不一样`

* 每个库`数据不一样`

* 所有库数据并集为全量数据
  
#### 2. 垂直分表
 以字段为依据，将一张表的**字段拆分**到多个表中
* 每个表`表结构不一样`

* 每个表`数据不一样`，所有拆分的表一般通过一列（`主键/外键`）关联

* 所有表数据并集为全量数据
  
  
  
  
  
### 二、水平拆分
![](https://fgq233.github.io/imgs/mysql/fkfb3.png)

#### 1. 水平分库
以字段为依据，按照一定策略，将一个库的数据拆分到多个库
* 每个库`表都一样`

* 每个库`数据不一样`

* 所有库数据并集为全量数据
  
#### 2. 水平分表
以字段为依据，按照一定策略，将一张**表的数据拆分**到多个表中
* 每个表`表结构都一样`

* 每个表`数据不一样`

* 所有表数据并集为全量数据



### 三、 分库分表中间件
* [Apache ShardingSphere](https://shardingsphere.apache.org/index_zh.html)
  * `Sharding-JDBC`
  * `Sharding-Proxy`
  * `Sharding-Sidecar`
* [Mycat](http://mycat.org.cn)


