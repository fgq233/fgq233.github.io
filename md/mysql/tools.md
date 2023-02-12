### MySQL 命令行工具
 
### 一、mysql
用于连接mysql

```
语法：
mysql [options] [database]

options 选项
-u  指定用户名
-p  指定密码
-h  指定服务器ip或域名
-P  指定连接端口
-e  执行SQL语句并退出

示例：
mysql -uroot -p
mysql -uroot -p1234
mysql -uroot -p1234 -h127.0.0.1
mysql -uroot -p1234 -h127.0.0.1 -P3306
mysql -uroot -p1234 -e "select now()"

```






### 二、mysqlbinlog
用于查看二进制文件 `binlog`

```
语法：
mysqlbinlog [options]  日志文件名

options 选项
-d  指定数据库名称，只列出该数据库相关日志
-o  忽略掉日志中前n行
-r  将日志输出到指定文件
-o  将行事件(数据变更)重构为SQL语句
-w  将行事件(数据变更)并输出注释信息
-s  显示简单格式，忽略掉一些信息

示例：(需要在二进制文件所在目录执行)
mysqlbinlog -s FGQ-bin.000080
```






### 三、mysqldump
用于备份数据库

```
语法：
mysqldump [options] 数据库名 [表名]  > 文件名

options 连接选项
-u  指定用户名
-p  指定密码
-h  指定服务器ip或域名
-P  指定连接端口

options 输出选项
-n  不包括数据库的创建语句
-t  不包括表的创建语句
-d  不包含数据，只有表结构
-T  生成两个文件，一个sql文件存放表结构、一个txt文件存放表数据
-- add-drop-database 在数据库创建语句前加上 drop database
-- add-drop-table 在表创建语句前加上 drop table，默认开启

示例：
mysqldump -uroot -p1234 nacos > db.sql
mysqldump --single-transaction -uroot -p1234 nacos > db.sql
```






### 四、mysqlimport
用于导入`mysqldump` 加 `-T` 参数后导出的txt文本文件

```
语法：
mysqlimport [options] 数据库名 文件名

示例：
mysqlimport -uroot -p1234 nacos C:\Users\fgq\Desktop\db.sql
```





### 五、mysqladmin
用于查找数据库、表、列


```
语法：
mysqlshow [options] [数据库名[表名[列名]]] 


示例：
mysqlshow -uroot -p1234 --count
mysqlshow -uroot -p1234 nacos --count
mysqlshow -uroot -p1234 nacos config_info --count
```




### 六、mysqlshow
用于管理操作
* 检查服务器配置、当前状态
* 创建、删除数据库


```
通过帮助查看选项
mysqladmin --help

示例：
删除数据库
mysqladmin -uroot -p1234 drop fgq
查看数据库版本
mysqladmin -uroot -p1234 version
```


 









































