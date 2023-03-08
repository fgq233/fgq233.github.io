## Oracle中存储过程
### 一、组成结构
```
create [or replace] procedure procedure_name
( param1, param2  ...) 
{is | as}
    定义参数(可省略)
begin
 ...... 
end;
```
* or replace：覆盖同名存储过程
* 参数：输入参数(默认)(in)、输出参数(out)、输入输出参数(in out)
* datatype：返回值的数据类型
* `{is | as}`：二选一，两者没啥区别
* 创建存储过程需要有 CREATE PROCEDURE 权限



### 二、示例
#### 1、无参存储过程
```
create or replace procedure xxx 
is
begin
  DBMS_OUTPUT.PUT_LINE(666);
end xxx;
```


#### 2、输入参数 in
```
create or replace procedure xxx
(
  in_uuid   VARCHAR2,
  in_name   NUMBER, 
  in_age    VARCHAR2 DEFAULT '18'
) 
is
begin
  insert into ppp(uuid, name, age) values(in_uuid, in_name, in_age);
  commit;
end xxx;
```



#### 3、输出参数 out
```
create or replace procedure xxx
(
  in_uuid   VARCHAR2,
  out_age   OUT VARCHAR2
) 
is
begin
  select age into out_age from ppp where uuid = in_uuid;
end xxx;
```



#### 4、输入输出参数
一个参数既是输入参数，又是输出参数，就可以定义为 in out
```
create or replace procedure xxx
(
  v_num1   IN OUT  NUMBER,
  v_num2   IN OUT  NUMBER
) 
is
begin
  v_num1 := v_num1 - v_num2;
  v_num2 := v_num1 + v_num2;
end xxx;
```
