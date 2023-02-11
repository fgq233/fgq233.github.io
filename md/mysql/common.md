### MySQL 常用命令

### 一、 命令
#### 1. 连接数据库
`mysql -uroot -p1234;
`

#### 2. 数据库备份
```
mysqldump -h127.0.0.1 -uroot -p1234 nacos > db.sql

-- InnonDB引擎中，加上参数 --single-transaction，可以达到不加锁的数据一致性备份
mysqldump --single-transaction -h127.0.0.1 -uroot -p1234 nacos > db.sql
```

#### 3. 服务启动、关闭
```
Windws系统
net start mysql
net stop mysql

Linux系统
service mysql stop
service mysql start
service mysql restart
```

