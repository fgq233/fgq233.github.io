### MyCat 读写分离

### 一、概念
* 读写分离就是读操作、写操作的数据库不是同一个，减小数据库压力
* 主库提供写操作，从库提供读操作
* 通过 MyCat 可以实现这样的功能，支持：`MySQL、Oracle、SQL Server`

![](https://fgq233.github.io/imgs/mysql/mycat7.png)


### 二、一主一从读写分离  schema.xml
读写分离可以不指定逻辑表，会自动加载数据库所有表作为逻辑表

```
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

    <schema name="dbX" checkSQLschema="true" sqlMaxLimit="100" dataNode="dn">
    </schema>
 
    <dataNode name="dn" dataHost="dataHost" database="db01" />
 
    <dataHost name="dataHost" maxCon="1000" minCon="10" balance="3" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1"  slaveThreshold="100">
        <heartbeat>select user()</heartbeat>
        <writeHost host="master" url="jdbc:mysql://ip1:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"> 
            <readHost host="slave" url="jdbc:mysql://ip2:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
        </writeHost>
    </dataHost>

</mycat:schema>
```

* 首先搭建主从架构，`ip1`主，`ip2`从
* 在 `writeHost` 下 配置 `readHost`
* 通过 `balance` 负载均衡策略，开启读写分离 
  * `0` 不开启读写分离，所有读操作都发送到可用的 `writeHost`
  * `1` 全部的 `readHost` 与备用 `writeHost` 都参与 `select` 语句的负载均衡(主要针对双主双从模式)
  * `2` 所有读写操作随机分发到 `writeHost、readHos`t
  * `3` 所有读请求随机分发到 `writeHost`上对应的`readHost`上执行，`writeHost` 不负责读(读写分离)


 
### 三、双主双从读写分离  schema.xml
![](https://fgq233.github.io/imgs/mysql/mycat8.png)

* `ip1、ip2`主从
* `ip3、ip4`主从
* `ip1、ip3`又互为主从

#### 1. 搭建两套主从架构
```
# 服务id  ★★★ 主1值为1，主3值为3  ★★★
server-id=1         

# 要同步的数据库
binlog-do-db=db01

# 在作为从库时，有写入操作也要更新二进制日志文件
log-slave-updates
```


从配置

 
```
# 服务id  ★★★ 从2值为2，从4值为4  ★★★
server-id=2
```


#### 2. 两台主互为主从
```
--在master3执行，master3为master1从
change master to master_host='ip1',master_user='xxx',master_password='xxx',master_log_file='xxx',master_log_pos=xxx;
start slave;

--在master1执行，master1为master3从
change master to master_host='ip3',master_user='xxx',master_password='xxx',master_log_file='xxx',master_log_pos=xxx;
start slave;
```


#### 3. MyCat 配置 schema.xml
```
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">

    <schema name="dbX" checkSQLschema="true" sqlMaxLimit="100" dataNode="dn">
    </schema>
 
    <dataNode name="dn" dataHost="dataHost" database="db01" />
 
    <dataHost name="dataHost" maxCon="1000" minCon="10" balance="1" writeType="0" dbType="mysql" dbDriver="jdbc" switchType="1" slaveThreshold="100">
        <heartbeat>select user()</heartbeat>
        
        <!-- 1、3主从 -->
        <writeHost host="master1" url="jdbc:mysql://ip1:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"> 
            <readHost host="slave2" url="jdbc:mysql://ip2:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
        </writeHost>
        
        <!-- 2、4主从 -->
        <writeHost host="master3" url="jdbc:mysql://ip3:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"> 
            <readHost host="slave4" url="jdbc:mysql://ip4:3306?useSSL=false&amp;serverTimezone=UTC" user="root" password="1234"/> 
        </writeHost>
    </dataHost>

</mycat:schema>
```

* `balance="1"` 双主双从模式，`2、3、4`都参与 `select` 语句的负载均衡

* `writeType="0"` 写操作的分发方式，0表示转发到第一个`writeHost`，第一个挂了切换到第二个，1表示所有写操作转发到随机的`writeHost`

* `switchType="1"` 自动切换`writeHost`，`-1`表示不自动切换