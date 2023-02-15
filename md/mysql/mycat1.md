### MyCat 分库分表配置
### 一、安装
#### 1. 下载 (Mycat-server-1.6.7.6)
* 官网 [http://mycat.org.cn](http://mycat.org.cn) 
* 下载 [http://dl.mycat.org.cn](http://dl.mycat.org.cn)  


#### 2. 目录
![](https://fgq233.github.io/imgs/mysql/mycat1.png)
 
* `bin`  存放可执行文件
* `conf` 存放配置文件
* `lib` 存放项目依赖jar包
* `logs` 存放日志文件


#### 3. MyCat 命令
在 `bin` 目录下执行命令
* 安装服务 `mycat install`
* 移除服务 `mycat remove`
* 启动服务 `mycat start`
* 停止服务 `mycat stop`
* 重启服务 `mycat restart`


### 二、MyCat 配置
![](https://fgq233.github.io/imgs/mysql/mycat2.png)

#### 1. 逻辑结构、物理结构  schema.xml
* 逻辑结构
  * 逻辑库：不存放数据，一个逻辑库可以有若干个逻辑表
  * 逻辑表：逻辑表的数据存放在分片节点中
  * 分片节点：每个节点关联实际的节点主机
  
* 物理结构：存放数据的真实数据库节点主机

 
#### 2. 分片规则  rule.xml
* 垂直分表`无需`配置分片规则，因为每个表只存在一个库中
* 水平分表`需要`配置分片规则，因为同一张表存放在不同库中，需要根据分片规则将数据存放在不同分片节点
* 分片规则定义在 `rule.xml` 中，如下：

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mycat:rule SYSTEM "rule.dtd">
<mycat:rule xmlns:mycat="http://io.mycat/">
	
    <tableRule name="auto-sharding-long">
        <rule>
            <columns>id</columns>
            <algorithm>rang-long</algorithm>
    	</rule>
    </tableRule>
    
    <function name="rang-long" class="io.mycat.route.function.AutoPartitionByLong">
    	<property name="mapFile">autopartition-long.txt</property>
    </function>
    
</mycat:rule>
```

`rule.xml` 中有 2类节点
* `tableRule` 表的分片规则，`columns`表示根据表中哪个字段分片，`algorithm` 为分片算法，指向 `function` 节点
* `function`  分片函数，`mapFile`指向具体的文件，`autopartition-long.txt`内容如下：

```
# range start-end ,data node index
# K=1000,M=10000.
0-500M=0        # 分片1：id在1-500W的数据
500M-1000M=1    # 分片2：id在500W-1000W的数据
1000M-1500M=2   # 分片3：id在1000W-1500W的数据
```


#### 3. MyCat 用户、权限  server.xml
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mycat:server SYSTEM "server.dtd">
<mycat:server xmlns:mycat="http://io.mycat/">

    <user name="root" defaultAccount="true">
        <property name="password">123456</property>
        <property name="schemas">dbX</property>
	
        <!-- 表级 DML 权限设置 -->
        <privileges check="true">
		    <schema name="TESTDB" dml="0110" >
                <table name="tb01" dml="0000"></table>
                <table name="tb02" dml="1111"></table>
            </schema>
        </privileges>		
    </user>

</mycat:server>
```


* 用户
  * 用户名：name="root"
  * 密码 password ：123456
  * schemas ：逻辑库名，多个逻辑库以逗号分隔
  
* 权限
  * check：是否开启 DML 权限
  * schema ：逻辑库
  * table ：逻辑表
  * dml ：四个数字对应增、改、查、删，1表示有权限，0表示无权限，若逻辑库和逻辑表都定义了，就近原则--以表的为准
