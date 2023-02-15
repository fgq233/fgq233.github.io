### MyCat 垂直分库
### 一、垂直分库
#### 1. 核心配置  schema.xml
```
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">
	
        <schema name="dbX" checkSQLschema="true" sqlMaxLimit="100">
            <table name="cloud_goods_base" primaryKey="id" dataNode="dn1"
            <table name="cloud_goods_desc" primaryKey="id" dataNode="dn1"

            <table name="cloud_order_base" primaryKey="id" dataNode="dn2"
            <table name="cloud_order_desc" primaryKey="id" dataNode="dn2"

            <table name="cloud_user" primaryKey="id" dataNode="dn3" />
            <table name="cloud_organ" primaryKey="id" dataNode="dn3" />
            
            <!-- 全局表，每个节点下都存在 -->
            <table name="cloud_dict" primaryKey="id" dataNode="dn1,dn2,dn3" type="global"/>
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

垂直分库与水平分库配置主要区别就是逻辑表 `table`
* 垂直分库无需分片规则
* 垂直分库 `dataNode` 为单个分片节点，水平分库为多个分片节点


#### 2. 用户配置  server.xml
同水平分库分表


#### 3. 启动 MyCat
`mycat start`


#### 4. 连接 MyCat
```
mysql -h127.0.0.1 -P8066 -uroot -p123456
```


#### 5. 测试 DDL、DML、DQL 语句
* DDL 建表语句，会自动路由到对应节点，然后创建该表
* DML 插入语句，会自动路由到对应节点，然后插入数据
* DQL 不跨节点查询，正常
* DQL 跨节点查询，异常
    * 如果表数据量不大，可以设置为全局表，这样每个节点就都存在该表，跨节点 JOIN 查询就可以了
    * 针对全局表的增删改，会在每个节点下生效
