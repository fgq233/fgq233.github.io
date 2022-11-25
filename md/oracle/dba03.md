### 查询
###### 1、查询服务端(Server)字符集
```
select  value$  from  sys.props$  where  name = 'NLS_CHARACTERSET' ;
select  userenv('language')  from  dual;   

结果示例：SIMPLIFIED、CHINESE_CHINA.AL32UTF8
```
* utf-8中文字符占三个字节
* GB18030、GBK、GB2312中文字符占两个字节
* ISO8859-1占一个字节
* 客户端(Client)端字符集：在Windows平台就是注册表里面相应OracleHome的NLS_LANG



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

