### 解锁
###### 1、获取被锁对象的 session_id
```
select b.owner, b.object_name, a.session_id, a.locked_mode
  from v$locked_object a, dba_objects b
 where b.object_id = a.object_id;
```
* owner：数据表的所有者用户
* object_name：被锁住的对象
* session_id：会话ID
* locked_mode：锁级别

###### 2、通过 session_id 从 v$session 获取 sid 和 serial#
```
select  sid, serial#, username, osuser FROM v$session where sid = ?;
```


###### 3、杀死会话
```
alter system kill session 'sid,serial#';

alter system kill session 'sid,serial#' immediate;
```


 