######  1、以DBA身份登录
```
sqlplus sys/sys@127.0.0.1/orcl as sysdba;
```

######  2、新建用户、授权
```
create user 用户名 identified by 密码;         
grant connect, resource, dba to 用户名;        
```

######  3、删除用户
```
drop user 用户名 cascade;   级联删除
```

######  4、修改用户名、密码
```
查询user#         
    select user#, name from user$ where name = 'fgq';  
更新用户名             
    update user$ set name = 'FGQ666' where user# = ?;          
    commit;
刷新数据库        
    alter system checkpoint;        
    alter system flush shared_pool; 
```

######  5、修改密码
```
alter user 用户名 identified by 新密码;
```
