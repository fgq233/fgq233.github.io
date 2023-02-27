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
```
