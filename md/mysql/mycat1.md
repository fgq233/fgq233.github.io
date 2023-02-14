### MyCat 分库分表入门
### 一、安装
#### 1. 下载 (Mycat-server-1.6.7.6)
* 官网 [http://mycat.org.cn](http://mycat.org.cn) 
* 下载 [http://dl.mycat.org.cn](http://dl.mycat.org.cn)  


#### 2. 目录
![](https://fgq233.github.io/imgs/mysql/mycat1.png)
 
* `bin`  存放可执行文件，用于启动、停止mycat
* `conf` 存放配置文件
* `lib` 存放项目依赖jar包
* `logs` 存放日志文件


#### 3. 基本概念
![](https://fgq233.github.io/imgs/mysql/mycat2.png)

* 逻辑结构
  * 逻辑库：不存放数据，一个逻辑库可以有若干个逻辑表
  * 逻辑表：逻辑表的数据存放在分片节点中
  * 分片节点：每个节点关联实际的节点主机
  
* 物理结构：实际存放数据的数据库节点主机


### 二、入门案例
#### 1. 需求
`cloud_goods`表数据量过大，需要进行数据分片，分为3个数据节点，每个节点位于不同服务器上

![](https://fgq233.github.io/imgs/mysql/mycat3.png)