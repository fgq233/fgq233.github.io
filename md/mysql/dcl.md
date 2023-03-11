### DCL 
### 一、用户管理
`MySQL` 中用户信息都存储在`mysql`库下`user`表中 
#### 1、查询用户
```
user mysql;
select * from user;
```

#### 2、新增用户
```
# 语法
create user 用户名@主机名 identified by 密码;

# 示例
create user 'fgq'@'%' identified by '123456';
```

* 指定主机，则该用户在当前主机访问数据库
* 不指定主机，或指定为`%`，则该用户在任意主机可以访问数据库


#### 3、修改用户密码
```
# 语法
alter user 用户名@主机名 identified with mysql_native_password by 新密码;

# 示例
alter user 'fgq'@'%' identified with mysql_native_password by 'A123456';
flush privileges;   
```


#### 4、删除用户
```
# 语法
drop user 用户名@主机名;

# 示例
drop user 'fgq'@'%';   
```


### 二、权限管理 
* `MySQL` 中权限存储在`mysql`库下`user、db、tables_priv、columns_priv、and procs_priv`这几个表中
* 授权、撤销权限后都要执行 `flush privileges;` 让其生效
 
#### 1、常用的权限
* `ALL、ALL PRIVILEGES、SUPER` 所有权限
* 表相关
  * `CREATE`  创建表
  * `ALTER`   修改表
  * `DROP`    删除表、视图
  * `CREATE TEMPORARY TABLES`  创建临时表
* 表数据相关
  * `INSERT` 添加数据的权限
  * `DELETE` 删除数据的权限
  * `UPDATE` 修改数据的权限
  * `SELECT` 查询表、视图权限

* 视图相关
  * `SHOW  VIEW `查看视图
  * `CREATE VIEW`  创建视图
* `INDEX` 创建和删除索引的权限

* 子程序
  * `CREATE  ROUTINE`   创建存储过程、函数
  * `EXECUTE ROUTINE`   调用存储过程、函数
  * `ALTER   ROUTINE`   更新/删除存储过程、函数

#### 2、查询权限
```
# 语法
show grants for 用户名@主机名;

# 示例
show grants for 'fgq';
```

#### 3、授予权限
```
# 语法
grant 权限列表 on 数据库名.表名 to 用户名@主机名;

# 示例
grant all on nacos.* to 'fgq'@'%';             
grant select, insert, update, delete, execute, alter on nacos.* to 'fgq'@'%';   
grant all on *.* to 'fgq'@'%';     
flush privileges;
```



#### 3、撤销权限
```
# 语法
revoke 权限列表 on 数据库名.表名 from 用户名@主机名;

# 示例
revoke all on nacos.* from 'fgq'@'%'; 
revoke select, insert, update, delete, execute, alter on nacos.* to 'fgq'@'%'; 
revoke all on *.* from 'fgq'@'%'; 
flush privileges;
```

