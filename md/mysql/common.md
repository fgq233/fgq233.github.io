### MySQL 常用

#### 1. 服务启动、关闭
```
-- Windws系统
net start mysql80
net stop mysql80

-- Linux`系统
service mysqld  stop
service mysqld  start
service mysqld  restart
```


#### 2. 系统库常用表
```
-- 用户
select * from mysql.user

-- 表
select * from information_schema.tables where table_schema='库名'

-- 所有表中记录数量
select table_rows, table_name
  from information_schema.TABLES
 where table_schema = '库名';
```


#### 3. 常用配置
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

