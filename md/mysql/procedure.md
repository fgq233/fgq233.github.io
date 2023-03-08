## MySQL中存储过程
### 一、语法
#### 1. 创建
```
CREATE PROCEDURE 存储过程名称
( param1, param2  ...) 
BEGIN
    ......SQL语句 
END;
```

#### 2. 删除
```
DROP PROCEDURE IF EXISTS 存储过程名称;
```

#### 3. 调用
```
CALL 存储过程名称(参数...);
```



### 二、示例
#### 1、无参存储过程
```
CREATE PROCEDURE xxx () 
BEGIN
	SELECT NOW();
END;
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
一般情况下，函数只需要返回单个数据，当需要返回多个数据时，就需要定义输出参数
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
一个参数既是输入参数，又是输出参数，就可以定义为 in out .
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
