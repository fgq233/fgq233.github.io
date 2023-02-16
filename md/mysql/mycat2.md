### MyCat 水平分表
### 一、水平分表
#### 1. 需求
`cloud_goods、cloud_order`表数据量过大，需要进行数据分片，分为3个数据节点，每个节点位于不同服务器上

![](https://fgq233.github.io/imgs/mysql/mycat3.png)


#### 2. 核心配置  schema.xml
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
	 
	 <!-- 节点主机 -->
	<dataHost name="dataHost1" maxCon="1000" minCon="10" balance="0" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="master" url="jdbc:mysql://127.0.0.1:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
	</dataHost>
	<dataHost name="dataHost2" maxCon="1000" minCon="10" balance="0" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="master" url="jdbc:mysql://192.167.18.128:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
	</dataHost>
	<dataHost name="dataHost3" maxCon="1000" minCon="10" balance="0" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
		<heartbeat>select user()</heartbeat>
		<writeHost host="master" url="jdbc:mysql://192.167.18.131:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
	</dataHost>
	
</mycat:schema>
```

* `schema` 逻辑库 
  * `name` 逻辑库库名 
  * `checkSQLschema` 在SQL语句中指定了逻辑库名称，是否自动去除，`select * from dbX.cloud_goods`自动去除dbX
  * `sqlMaxLimit` 默认最大查询100条数据
  
* `table` 逻辑表 
  * `name` 逻辑表表名，在同一个逻辑库下唯一
  * `primaryKey` 逻辑表对应真实表的主键
  * `dataNode` 关联的分片节点，对应`dataNode`的`name`
  * `rule` 分片规则
  * `type` 逻辑表类型，目前只有普通表（`默认类型`）和全局表（`global`），全局表是在所有分片中都存在这张表
  
* `dataNode` 分片节点 
  * `name` 节点名
  * `maxCon/minCon` 最大连接数/最小连接数
  * `balance` 负载均衡策略，取值0，1，2，3
  * `writeType` 写操作的分发方式
  * `dbDriver` 数据库驱动，支持 `native、jdbc`
  * `dataHost` 节点对应的实际物理主机，对应`dataHost`的`name`
  * `database` 分片的数据库名
  
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


#### 3. 用户配置  server.xml
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

这里定义了2个连接`MyCat`的用户，一个`root` 可读写，一个只读用户 `user`


#### 4. 启动 MyCat
启动服务 `mycat start`

![](https://fgq233.github.io/imgs/mysql/mycat4.png)


#### 5. 连接 MyCat
连接方式和 `MySQL` 一样，这里的用户名、密码是 `server.xml` 中定义的，默认端口`8066`

```
mysql -h127.0.0.1 -P8066 -uroot -p123456
```

![](https://fgq233.github.io/imgs/mysql/mycat5.png)


#### 6. 测试 DDL、DML、DQL 语句
```
-- 先切换到逻辑库
use dbX

-- 建表 DDL
CREATE TABLE cloud_goods  (
  id bigint NOT NULL,
  title varchar(100) NOT NULL,
  PRIMARY KEY(id) 
) ENGINE = InnoDB CHARACTER SET = utf8;

CREATE TABLE cloud_order  (
  id  bigint NOT NULL,
  gid bigint NOT NULL,
  title varchar(100) NOT NULL,
  PRIMARY KEY(id) 
) ENGINE = InnoDB CHARACTER SET = utf8;

-- 插入数据 DML
INSERT INTO cloud_goods(ID, TITLE) VALUES(1, '商品1');
INSERT INTO cloud_goods(ID, TITLE) VALUES(5000001, '商品2');
INSERT INTO cloud_goods(ID, TITLE) VALUES(10000001, '商品3');

INSERT INTO cloud_order(ID, GID, TITLE) VALUES(1, 1, '订单1');
INSERT INTO cloud_order(ID, GID, TITLE) VALUES(2, 1, '订单2');
INSERT INTO cloud_order(ID, GID, TITLE) VALUES(5000001, 1, '订单3');

-- 查询数据 DQL
select * from cloud_order o, cloud_goods g where o.gid = g.id;
```

* 建表后，3个库都出现了 `cloud_goods、cloud_order`表
* 插入`cloud_goods`数据，3条数据分别在分片1、2、3，水平分表成功
* 插入`cloud_order`数据，3条数据分别在分片1、1、2，水平分表成功
* 查询数据，只出现2条数据，因为只有这2条数据在同一个节点库下
    
![](https://fgq233.github.io/imgs/mysql/mycat6.png)

