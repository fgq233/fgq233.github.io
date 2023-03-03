###### 1、查询服务端(Server)字符集
```
select  value$  from  sys.props$  where  name = 'NLS_CHARACTERSET' ;
select  userenv('language')  from  dual;   

结果示例：SIMPLIFIED、CHINESE_CHINA.AL32UTF8
```

客户端字符集：在Windows平台就是注册表里面相应OracleHome的NLS_LANG



###### 2、查看当前oracle中正在执行的sql语句
```
select a.program,
       a.MACHINE,
       a.OSUSER,
       a.USERNAME,
       b.spid,
       c.sql_text,
       c.SQL_ID
  from v$session a, v$process b, v$sqlarea c
 where a.paddr = b.addr
   and a.sql_hash_value = c.hash_value
   and a.username is not null;
```

###### 3、所有表
```
-- 库下所有表
select table_name from dba_tables where owner = '库名';

-- 用户下所有表名、表记录总数量
select t.table_name, t.num_rows from user_tables t;
```


