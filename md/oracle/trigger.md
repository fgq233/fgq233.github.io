## Oracle中触发器
### 一、简介
触发器只能由特定事件来触发，这些特定事件可以分为下面几种类型：
* DML操作：INSERT、UPDATE、DELETE
* DDL操作：CREATE、ALTER、DROP
* 数据库事件：用户的登陆与退出、数据库的特定错误消息等

使用触发器需要注意几点：
* 触发器代码只能包含 SELECT、INSERT、UPDATE、DELETE语句，不能包含DDL语句(CREATE、DROP、ALTER)和事务控制语句(COMMIT、ROLLBACK、SAVEPOINT)
* 一个表最多可有12个触发器，触发器代码最大为32KB，由于大小受到限制所以不能使用blob这样的大变量，如果实在是需求需要，可以通过存储过程实现一部分功能，然后调用


### 二、DML触发器
DML触发器针对表的，当对表执行INSERT、UPDATE、DELETE操作时可以激发该类型触发器，建立DML触发器需要指定下列要素：
* 触发时机：BEFORE 指执行DML操作之前触发，AFTER 指执行DML操作之后触发
* 触发事件：是什么事件触发的触发器：INSERT、UPDATE、DELETE操作
* 表名：DML操作针对的是哪张表
* 触发级别：行级触发器(指每影响一行数据执行一次触发器代码) 、语句级触发器(默认级别，指对每个DML语句执行一次触发器代码)
* 触发限制(可选)：条件为 true 时该触发器才会触发
* 触发动作：触发器要执行的代码
