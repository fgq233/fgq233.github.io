### Oracle权限
#### 一、分类
* 1、系统权限：系统规定用户使用数据库的权限。
* 2、对象权限：某种权限用户对其它用户的表或视图的存取权限
* 3、角色权限：多个权限集合，简化权限的管理，可以包含系统权限、对象权限

```
查询用户拥有哪里权限：
SQL> select * from dba_role_privs;
SQL> select * from dba_sys_privs;
SQL> select * from role_sys_privs;

查自己拥有哪些系统权限
SQL> select * from session_privs;
```


#### 二、系统权限
* DBA: 拥有全部特权，是系统最高权限，只有DBA才可以创建数据库结构
* RESOURCE:拥有Resource权限的用户只可以创建实体，不可以创建数据库结构
* CONNECT:拥有Connect权限的用户只可以登录Oracle，不可以创建实体，不可以创建数据库结构

注意：
* 系统权限只能由DBA用户授出：sys, system(最开始只能是这两个用户)
* 对于普通用户：授予connect, resource权限
* 对于DBA管理用户：授予connect，resource, dba权限

```
授权命令：
grant connect, resource, dba to 用户名1 [,用户名2]…;
```


#### 三、实体权限
select, update, insert, alter, index, delete, all (all包括所有权限)

```
以DBA身份登录
sqlplus sys/sys@127.0.0.1/orcl as sysdba;

授权
grant create sequence to 用户名;
grant create table to 用户名;
grant create view to 用户名;
```