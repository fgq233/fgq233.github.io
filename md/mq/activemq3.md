###  ActiveMQ 持久化
消息持久化是保证消息不丢失的重要方式，`ActiveMQ` 提供了以下 5 种消息存储方式
* `KahaDB`：基于日志的存储方式（默认存储方式）
* `JDBC`：存储于数据库
* `Memory`： 存储于内存中（不进行持久化，`ActiveMQ` 宕机会造成消息丢失）
* `AMQ`： 基于文件的存储
* `levelDB`： 新推出的高效存储器（官网不推荐用）

###  一、KahaDB 日志存储
#### 1、说明
* 从 `ActiveMQ 5.3`版本开始官方建议使用 `KahaDB`，它提供了比 `AMQ` 消息存储更高的可伸缩性和可恢复性
* `AMQ` 消息存储虽然比 `KahaDB` 快，但扩展性不如 `KahaDB`，恢复时间也更长

#### 2、存储方式
在安装目录下的 `data/kahadb` 目录，会生成四个文件，来完成消息持久化

* `db-*.log` ：存储消息内容，新的数据以 append 的方式追加到日志文件末尾，属于顺序写入
* `db.data`：消息的索引文件，作为索引指向 db-*.log 里面存储的消息
* `db.redo`：事务日志，用于消息恢复
* `lock` ：锁文件，写入当前获得 `kahadb` 读写权限的 `broker` ，用于在集群环境下的竞争处理

日志文件位置可以通过 `ActiveMQ` 配置文件修改：`conf/activemq.xml`

```
<beans>
    <broker brokerName="localhost" dataDirectory="${activemq.data}">
        <persistenceAdapter>
            <kahaDB directory="${activemq.data}/kahadb"/>
        </persistenceAdapter>
    </broker>
</beans>
```

#### 3、程序中使用
ActiveMQ 默认是持久化的，无需程序任何配置
 
 
 
 
###  二、JDBC 
#### 1、说明
* `ActiveMQ` 默认支持使用 `Apache Derby`作为数据库，该数据库易于嵌入
* 若想支持其他的数据库，如：`MySQL、Oracle`，需要对应的驱动

#### 2、使用方式
修改配置文件 `conf/activemq.xml` 

* 通过 `beans` 配置一个数据源
* 通过 `persistenceAdapter` 配置持久化适配器，指向上面的数据源
* 适配器中 `createTablesOnStartup` 用于启动时创建持久化的表，首次启动设为true，后续false
  * `activemq_acks`
  * `activemq_lock`
  * `activemq_msgs`

```
<beans>
    <!-- 数据源  Mysql8 -->
    <bean id="mysql-ds" class="org.apache.commons.dbcp2.BasicDataSource" destroy-method="close"> 
    	<property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>      
    	<property name="url" value="jdbc:mysql://127.0.0.1:3306/activemq?useSSL=false&amp;serverTimezone=UTC"/>      
    	<property name="username" value="root"/>     
    	<property name="password" value="19931126"/>   
    </bean>
 
	
    <broker brokerName="localhost" dataDirectory="${activemq.data}">
		 
        <persistenceAdapter>
            <!-- 注释 kahaDB <kahaDB directory="${activemq.data}/kahadb"/>-->
	    <jdbcPersistenceAdapter dataSource="#mysql-ds" createTablesOnStartup="true"/>
        </persistenceAdapter>

    </broker>
</beans>
```

#### 3、程序中使用
ActiveMQ 默认是持久化的，无需程序任何配置


###  三、Memory 内存 
#### 1、说明
基于内存的消息存储，就是不进行持久化，数据在内存中

#### 2、使用方式
修改配置文件 `conf/activemq.xml` ，在 <broker> 标签上设置该属性 persistent="false"

```
<beans>
    <broker persistent="false">
    </broker>
</beans>
```

#### 3、程序中使用
```
spring:
  jms:
    template:
      delivery-mode: non_persistent  

```

`non_persistent` 不进行持久化，`persistent` 表示持久化