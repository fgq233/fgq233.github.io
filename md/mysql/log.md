### MySQL 中的日志
MySQL 中有七种日志文件
* 二进制日志(`binlog`)
* 查询日志(`general log`)
* 慢查询日志(`slow query log`)
* 错误日志(`error log`)
* 中继日志(`relay log`)
* 重做日志(`redo log`)
* 回滚日志(`undo log`)


### 一、 二进制日志 binlog
#### 1. 介绍 
* `binlog`记录了所有 `DDL语句、DML语句`(不包括查询语句、`SHOW`语句)
* 该日志默认开启
* 二进制日志相关参数：`show variables like '%log_bin%'`
* 日志格式 `show variables like 'binlog_format'`
  * `STATMENT`：记录的是SQL语句，对数据修改的SQL都会记录在日志文件中(5.7.7之前默认格式)
  * `ROW`：记录的是每一行的数据变更(5.7.7之后默认格式)
  * `MIXED`：混合`STATMENT、ROW`
* `binlog`作用：数据恢复、主从复制

#### 2. 查看二进制日志 
使用 `mysqlbinlog` 客户端工具查看

```
示例：(需要在二进制文件所在目录执行)
mysqlbinlog -v FGQ-bin.000080
```

#### 3. 清除二进制日志 
* `reset master` 删除全部，之后日志编号重新从000001开始
* `purge master logs to 'binlog.******'` 删除指定编号之前的日志
* `purge master logs before 'yyyy-MM-dd hh24:mi:ss'` 删除指定日期之前的日志

```
mysql -uroot -p1234;
purge master logs to 'FGQ-bin.000065';
purge master logs before '2022-02-22 02:22:22';
```

#### 4. 二进制日志过期设置
* 过期清除设置，默认开启 `show variables like 'binlog_expire_logs_auto_purge'`
* 过期清除时间配置 `show variables like 'binlog_expire_logs_seconds'`


### 二、 查询日志 general log
* 记录了客户端的所有操作语句，不管语句是否正确，都会被记录
* 查询日志默认未开启
* 查询日志相关参数 `show variables like '%general%'`


### 三、 慢查询日志 slow_query_log
* 记录了所有执行时间超过`long_query_time`值，并且扫描记录数不少于`min_examined_row_limit`
的所有SQL语句
* 慢查询日志默认未开启
* 查询日志相关参数 
  * `show variables like 'slow_query_log'` 是否开启
  * `show variables like 'long_query_time'` 时间阈值
  * `show variables like 'min_examined_row_limit'` 记录阈值
* 慢查询日志默认不记录管理语句，也不记录不使用索引进行查询的语句，可通过配置修改
  * `show variables like 'log_slow_admin_statements'` 
  * `show variables like 'log_queries_not_using_indexes'` 


### 四、 错误日志 error log
* 记录了MySQL 服务器启动和停止时，以及运行过程中发生任何严重错误时的相关信息
* 该日志默认开启
* 错误日志相关参数：`show variables like '%log_error%'`


### 五、中继日志 relay log
* 从库使用 IOthread 线程读取主库的 binlog，写入到从库的中继日志 replay log
* 从库使用 SQLthread 线程重做中继日志中的事件，将改变反映到自己的数据库



### 六、重做日志 redo log
记录数据页的变更，用于恢复更新了内存但是由于宕机等原因没有刷入磁盘中的那部分数据



### 七、回滚日志 undo log
* 用于事务的回滚
* 用于多版本并发控制下的读取（MVCC）


 



