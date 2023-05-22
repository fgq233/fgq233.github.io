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
#### 1. 主库 MySQL 安装
* 准备好主库服务器，安装MySQL
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
```
[mysqld]
server-id=1
read-only=0

# binlog-ignore-db=mysql
# binlog-do-db=xxxxxx
# log_bin=binlog
```


* `server-id` 服务id，保证集群环境中唯一
* `read-only` 1表示只读，0表示读写
* `binlog-ignore-db` 不记录指定的数据库的二进制日志
* `binlog-do-db` 只记录指定数据库的二进制日志，默认是全部记录
* `log_bin` 二进制日志名，默认binlog

修改完成后，重启MySQL服务


#### 3. 新增主从复制主的账号
```
# 登录
mysql -u root -p;

# 创建任意主机可连接的账号(必须使用 mysql_native_password)
create user 'fgq'@'%' identified mysql_native_password by '123456';

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
| binlog.000009  |     2149 |              |                  |                   |
+----------------+----------+--------------+------------------+-------------------+
```

* `File`：最新的binlog日志
* `Position`：当前binlog日志文件位置
* `Binlog_Do_DB`：指定同步的数据库
* `Binlog_Ignore_DB`：指定不需要同同步的数据库

之后只需要同步最新文件位置之后的数据，之前数据可以通过`mysqldump`备份后导入到从库



### 三、 主从复制-从库搭建
#### 1. 从库 MySQL 安装
#### 2. 修改从库配置文件
```
[mysqld]
server-id=2
read-only=1
```

修改完成后，重启MySQL服务


#### 3. 设置主库地址、账号
```
# 登录
mysql -uroot -p;

-- 8.0.23之前版本
change replication source to source_host='192.168.45.130', source_port=3306, 
    source_user='fgq', source_password='123456',
    source_log_file='binlog.000009', source_log_pos=2149;

-- 8.0.23之后版本
change master to master_host='192.168.45.130', master_port=3306, 
    master_user='fgq', master_password='123456',
    master_log_file='binlog.000009', master_log_pos=2149;
```


* 主库地址：`host`
* 主库端口：`port`
* 连接主库的用户：`user`
* 连接主库的密码：`password`
* binlog日志文件名：`log_file`
* binlog日志文件位置：`log_pos`


#### 4. 启动、停止主从同步
```
-- 8.0.23之前版本
start slave;
stop slave;

-- 8.0.23之后版本
start replica;
stop replica;
```


#### 5. 查看主从同步状态
```
-- 8.0.23之前版本
show slave status\G;

-- 8.0.23之后版本
show replica status\G;
```



* `Replica_IO_Running: Yes`
* `Replica_SQL_Running: Yes`

从库两个线程已经正常运行，主从复制搭建完毕





