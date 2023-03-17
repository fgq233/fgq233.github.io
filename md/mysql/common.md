### MySQL 常用
### 一、MySQL 服务相关
#### 1. 服务启动、关闭
```
-- Windws系统
net start mysql80
net stop mysql80

-- Linux系统
service mysqld  stop
service mysqld  start
service mysqld  restart
```

### 二、系统库常用表
#### 1. 用户表
```
select * from mysql.user
```

#### 2. 库中所有表、表中所有记录
```
-- 表
select * from information_schema.tables where table_schema='库名'

-- 所有表中记录数量
select table_rows, table_name
  from information_schema.tables
 where table_schema = '库名';
```

#### 3. 事务与锁
```
-- 未提交的事务
select * from information_schema.innodb_trx;
-- 杀掉未提交事务的线程 (trx_mysql_thread_id 为事务的线程id)
kill trx_mysql_thread_id;

-- 数据库锁的持有情况
select * from performance_schema.data_locks; 

-- 锁等待信息 
select * from performance_schema.data_lock_waits;
```



### 三、常用配置、变量
#### 1. 连接相关
```
-- 查看最大连接数
show variables like'%max_connections%';

-- 查看每个用户最大连接数，默认为0 表示没有限制
show variables like'max_user_connections';

-- 最大已用连接数
show status like'Max_used_connections';

-- 默认值为28800(即8小时)，超过8小时内都没有访问数据库，再次访问mysql数据库时会拒绝访问
show global variables like'%wait_timeout';
```


* `Max_used_connections / max_connections * 100% （理想值 85%左右最好） `


#### 2. 事务相关
```
-- 默认的事务隔离级别
select @@transaction_isolation;
```
