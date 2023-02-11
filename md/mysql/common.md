### MySQL 常用命令、SQL

### 一、 命令
#### 1. 连接数据库
`mysql -uroot -p1234;
`

#### 2. 数据库备份
```
mysqldump -h127.0.0.1 -uroot -p1234 nacos > D:/db.sql

-- InnonDB引擎中，加上参数 --single-transaction，可以达到不加锁的数据一致性备份
mysqldump --single-transaction -h127.0.0.1 -uroot -p1234 nacos > D:/db.sql
```



#### 二、SQL
#### 1. 连接数据库