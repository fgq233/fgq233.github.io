###### 1、查询服务端(Server)字符集
```
select  value$  from  sys.props$  where  name = 'NLS_CHARACTERSET' ;
select  userenv('language')  from  dual;   

结果示例：SIMPLIFIED、CHINESE_CHINA.AL32UTF8
```

客户端字符集：在Windows平台就是注册表里面相应OracleHome的NLS_LANG

###### 2、查询数据库中的表空间 
* `dba_data_files` 表空间、表空间总大小
* `dba_free_space` 表空间、表空间剩余大小

```
# 表空间名称、总大小(单位：MB)
select tablespace_name, sum(bytes) / 1024 / 1024
  from dba_data_files
 group by tablespace_name;
 
# 表空间的所有DBF文件、每个文件大小
select tablespace_name,
       file_name,
       round(bytes / (1024 * 1024), 0) total_space
  from dba_data_files
 order by tablespace_name;
 
# 表空间总大小、已使用/未使用大小
select a.tablespace_name,
       total as "总大小",
       free as "未使用",
       (total - free) || '%' as "已使用",
       substr(free / total * 100, 1, 5) || '%' as "剩余百分比",
       substr((total - free) / total * 100, 1, 5) as "已使用百分比"
  from (select tablespace_name, sum(bytes) / 1024 / 1024 as total
          from dba_data_files
         group by tablespace_name) a,
       (select tablespace_name, sum(bytes) / 1024 / 1024 as free
          from dba_free_space
         group by tablespace_name) b
 where a.tablespace_name = b.tablespace_name
 order by a.tablespace_name;

# 用户下某个具体的表所占空间大小
select t.owner "用户",
       t.segment_name "表名",
       t.segment_type "类型",
       sum(t.bytes / 1024 / 1024) "占用空间(MB)"
  from dba_segments t
 where t.owner = '用户名'
   and t.segment_type = 'TABLE'
   and t.segment_name = '表名'
 group by t.owner, t.segment_name, t.segment_type;
```

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

-- 表中所有列
select * from user_tab_cols where table_name = '表名';
```


