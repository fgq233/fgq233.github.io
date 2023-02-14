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


#### 2. 分片配置  schema.xml
```
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">
	
	<!-- 逻辑库 -->
	<schema name="dbX" checkSQLschema="true" sqlMaxLimit="100">
		<!-- 逻辑表 -->
		<table name="cloud_goods" primaryKey="id" dataNode="dn1,dn2,dn3" rule="auto-sharding-long" autoIncrement="true" />
	</schema>
	 
	<!-- 分片节点 -->
	<dataNode name="dn1" dataHost="dataHost1" database="db01" />
	<dataNode name="dn2" dataHost="dataHost2" database="db01" />
	<dataNode name="dn3" dataHost="dataHost3" database="db01" />
	 
	 
	 <!-- 节点主机1 -->
	<dataHost name="dataHost1" maxCon="1000" minCon="10" balance="0" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="master" url="jdbc:mysql://127.0.0.1:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
	</dataHost>
	 <!-- 节点主机2 -->
	<dataHost name="dataHost2" maxCon="1000" minCon="10" balance="0" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="master" url="jdbc:mysql://192.167.18.128:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
	</dataHost>
	<!-- 节点主机3 -->
	<dataHost name="dataHost3" maxCon="1000" minCon="10" balance="0" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="master" url="jdbc:mysql://192.167.18.131:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
	</dataHost>
	
</mycat:schema>
```

* `schema` 逻辑库 
  * `name` 逻辑库库名 
  * `sqlMaxLimit` 默认最大查询100条数据
  
* `table` 逻辑表 
  * `name` 表名
  * `primaryKey` 主键
  * `dataNode` 关联的分片节点，对应`dataNode`的`name`
  * `rule` 分片规则，关联 `rule.xml`
  
* `dataNode` 分片节点 
  * `name` 节点名
  * `dataHost` 节点对应的实际物理主机，对应`dataHost`的`name`
  * `database` 数据库名
  
* `dataHost` 实际存放数据的物理节点主机
  * `name` 主机名
  * 注意防火墙、数据库用户权限 
   
```
# 防火墙
netsh advfirewall set allprofile state off 

# 数据库用户权限
grant all privileges on *.* to 'root'@'%';
flush privileges;   
```

#### 3. MyCat 用户配置  server.xml
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mycat:server SYSTEM "server.dtd">
<mycat:server xmlns:mycat="http://io.mycat/">
	
    
	<user name="root" defaultAccount="true">
		<property name="password">123456</property>
		<property name="schemas">dbX</property>
		<property name="defaultSchema">dbX</property>
	</user>

	<user name="user">
		<property name="password">user</property>
		<property name="schemas">dbX</property>
		<property name="readOnly">true</property>
		<property name="defaultSchema">dbX</property>
	</user>

</mycat:server>
```

* `name="root"` 用户名
* `password` 用户登录MyCat的密码
* `schemas` schema.xml中定义的逻辑库
* `defaultSchema` schema.xml中定义的逻辑库
* `readOnly` 只读用户
  
这里定义了2个连接`MyCat`的用户，一个`root` 可读写，一个只读用户 `user`


#### 4. 启动 MyCat
* 在 `bin` 目录下，先执行 `mycat install` 安装服务
* 启动服务 `mycat start`，默认端口`8066`
* 其他命令
  * `mycat stop` 停止服务
  * `mycat remove` 移除安装的服务
  * `mycat restart` 重启服务
  * `mycat status` 服务状态

![](https://fgq233.github.io/imgs/mysql/mycat4.png)


#### 5. 连接 MyCat
连接方式和 `MySQL` 一样，这里的用户名、密码是 `server.xml` 中定义的

```
mysql -h127.0.0.1 -P8066 -uroot -p123456
```

![](https://fgq233.github.io/imgs/mysql/mycat5.png)


#### 6. 测试
```
-- 先切换到逻辑库
use dbX

-- 建表
CREATE TABLE cloud_goods  (
  id bigint NOT NULL,
  title varchar(100) NOT NULL,
  PRIMARY KEY(id) 
) ENGINE = InnoDB CHARACTER SET = utf8;

-- 插入数据
INSERT INTO cloud_goods(ID, TITLE) VALUES(1, '666');
INSERT INTO cloud_goods(ID, TITLE) VALUES(5000001, '888');
INSERT INTO cloud_goods(ID, TITLE) VALUES(10000001, '88888888');
```

* 建表后，3个库都出现了 `cloud_goods`
* 插入数据，查看后，发现数据分别在3个库中，分片成功(`此处为水平分库分表`)
* 此处分片规则为 `auto-sharding-long`，根据id分片(算法定义在`auto-sharding-long.txt`)
    
```
0-500M=0        # 分片1：id在1-500W的数据
500M-1000M=1    # 分片2：id在500W-1000W的数据
1000M-1500M=2   # 分片3：id在1000W-1500W的数据
```