## Oracle中自定义函数
### 一、组成结构
```
create [or replace] function function_name
( param1, param2  ...) 
return datatype
{is | as}
    定义参数(可省略)
begin
 ... 函数体(至少要包含一条RETURN 语句)
end;
```
* or replace：覆盖同名函数
* 参数：输入参数(默认)(in)、输出参数(out)、输入输出参数(in out)
* datatype：返回值的数据类型
* `{is | as}`：二选一，两者没啥区别



### 二、示例
#### 1、无参函数
```
create or replace function xxx
return varchar2 
is
  v_sysdate varchar2(20);
begin
  select to_char(SYSDATE,'yyyy-mm-dd') into v_sysdate from dual;
  return current_time;
end xxx; 
```

#### 2、输入参数 in
```
create or replace function xxx
(param1 in number,
 param2 in number
)
return number 
is
  v_result number;
begin
  v_result := param1 + param2;
  return v_result; 
end xxx;
```



#### 3、输出参数 out
一般情况下，函数只需要返回单个数据，当需要返回多个数据时，就需要定义输出参数

```
create or replace function xxx
(param out number)
return number 
is
  v_result number;
begin
  v_result := 1 + 1;
  param := 1 + 1;
  return v_result; 
end xxx;
```



#### 4、输入输出参数
一个参数既是输入参数，又是输出参数，就可以定义为 in out

```
create or replace function xxx
 param in out number
)
return number 
IS
  v_result NUMBER;
begin
  v_result := 1 + 1;
  param := param + v_result;
  return v_result; 
  
end xxx;
```
