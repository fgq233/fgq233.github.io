### MySQL 主从复制

### 一、 介绍
#### 1. 概念
* 主从复制是指将主数据库的 DDL 和 DML 语句通过二进制日志传到从库服务器中，
然后在从库上对这些日志重新执行，从而使得主库、从库的数据保持同步

* MySQL 支持一台主库同时向多台从库进行复制，从库也可以作为其他从服务器的主库，
实现链状复制

#### 2. 作用
* 主库宕机，可以快速切换到从库提供服务
* 实现读写分离，主库写、从库读，降低主库的访问压力
* 在从库加锁，然后备份，避免备份期间影响主库服务

#### 3. 原理
![ms](https://fgq233.github.io/imgs/mysql/ms.png)

* 主库在事务提交时，会把数据变更记录在二进制日志文件 `binlog` 中
* 从库使用 `IOthread` 线程读取主库的 `binlog`，写入到从库的中继日志 `replay log`
* 从库使用 `SQLthread` 线程重做中继日志中的事件，将改变反映到自己的数据库



### 二、 主从复制-主库搭建
#### 1. 主库服务器准备
* 准备好主库服务器 `192.168.152.1`，安装MySQL
* 关闭防火墙 



<details><summary>Windows系统关闭防火墙</summary><pre>
<code>关闭 所有防火墙，off关闭 on开启
netsh advfirewall set allprofile state off 
</code></pre></details>


<details><summary>Linux系统关闭防火墙</summary><pre>
<code>只开放指定的3306端口号
firewall-cmd --zone=public --add-port=3306/tcp --permanent  
firewall-cmd --reload

关闭服务器整个防火墙
systemctl stop firewalld
systemctl disable firewalld
</code></pre></details>



#### 2. 修改主库配置文件
<details><summary>配置文件位置</summary><pre>
<code>Window  
C:\ProgramData\MySQL\MySQL Server 8.0\my.ini

Linux 
/etc/my.cnf
</code></pre></details>

```
# mysql服务id，保证集群环境中唯一
server-id=1

# 是否制度，1表示只读，0表示读写
read-only=0

# 忽略的数据库(指不需要同步的数据库)
# binlog-ignore-db=mysql

# 指定同步的数据库
# binlog-do-db=nacos
```


修改完成后，重启MySQL服务
* Window
  * `net stop mysql80`
  * `net start mysql80`
* Linux
  * `service restart mysqld`


#### 3. 新增主从复制主的账号
```
# 登录
mysql -u root -p1234;

# 创建任意主机可连接的账号
create user 'fgq'@'%' identified with mysql_native_password by 'master@666';

# 授予主从复制权限
grant replication slave on *.* to 'fgq'@'%';

# 刷新权限		
flush privileges;
```

 
#### 4. 获取binlog 最新日志
```
show master status;

+----------------+----------+--------------+------------------+-------------------+
| File           | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+----------------+----------+--------------+------------------+-------------------+
| FGQ-bin.000082 |     1000 |              |                  |                   |
+----------------+----------+--------------+------------------+-------------------+
```

* `File`：最新的binlog日志
* `Position`：当前binlog日志文件位置
* `Binlog_Do_DB`：指定同步的数据库
* `Binlog_Ignore_DB`：指定不需要同同步的数据库

之后只需要同步最新文件位置之后的数据，之前数据可以通过`mysqldump`备份后导入到从库



### 三、 主从复制-从库搭建
#### 1. 从库服务器准备
同上


#### 2. 修改从库配置文件
```
# mysql服务id，保证集群环境中唯一
server-id=2

# 是否制度，1表示只读，0表示读写
read-only=1
```

修改完成后，重启MySQL服务


#### 3. 设置主库地址、账号
```
-- 8.0.23之前版本
change replication source to source_host='192.168.152.1',source_user='fgq',source_password='master@666',source_log_file='FGQ-bin.000082',source_log_pos=1000;

-- 8.0.23之后版本
change master to master_host='192.168.152.1',master_user='fgq',master_password='master@666',master_log_file='FGQ-bin.000082',master_log_pos=1000;
```


* 主库地址：`host`
* 连接主库的用户：`user`
* 连接主库的密码：`password`
* binlog日志文件名：`log_file`
* binlog日志文件位置：`log_pos`


#### 4. 启动主从同步
```
-- 8.0.23之前版本
start slave;

-- 8.0.23之后版本
start replica;
```


#### 5. 查看主从同步状态
```
-- 8.0.23之前版本
show slave status\G;

-- 8.0.23之后版本
show replica status\G;
```

<details><summary>主从同步状态</summary><pre>
<code>*************************** 1. row ***************************
               Slave_IO_State: Waiting for source to send event
                  Master_Host: 192.168.152.1
                  Master_User: fgq
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: FGQ-bin.000083
          Read_Master_Log_Pos: 157
               Relay_Log_File: DESKTOP-3CITCAH-relay-bin.000003
                Relay_Log_Pos: 369
        Relay_Master_Log_File: FGQ-bin.000083
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 157
              Relay_Log_Space: 756
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 0da595c1-6818-11ed-8c65-80fa5b8e5dc3
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set:
            Executed_Gtid_Set:
                Auto_Position: 0
         Replicate_Rewrite_DB:
                 Channel_Name:
           Master_TLS_Version:
       Master_public_key_path:
        Get_master_public_key: 0
            Network_Namespace:
</code></pre></details>



* `Slave_IO_Running: Yes`
* `Slave_SQL_Running: Yes`

从库两个线程已经正常运行，主从复制搭建完毕




