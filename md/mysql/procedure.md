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

#### 4. 参数说明

| 类型   | 含义         |
| ------ | ----------| 
| `in` |输入参数（默认类型，可省略），调用存储过程时需传入值 | 
| `out` | 输出参数，作为返回值 | 
| `inout` | 既可以作为输入参数，又可以作为输出参数 | 


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
CREATE PROCEDURE xxx (IN v_now datetime, IN v_num INT ) 
BEGIN
  SELECT v_now, v_num;
END;
```



#### 3、输出参数 out
```
CREATE PROCEDURE xxx
(
  in v_num1   int,
  in v_num2   int,
  out v_sum   int
) 
BEGIN
  set v_sum := v_num1 + v_num2;
END;
```

* 调用存储过程

```
call xxx(1, 2, @result);
select @result;
```

#### 4、输入输出参数
一个参数既是输入参数，又是输出参数，就可以定义为 inout

```
CREATE PROCEDURE xxx(inout v_now datetime) 
BEGIN
  select date(v_now) into v_now;
END;
```


* 调用存储过程

```
set @result := now();
call xxx(@result);
select @result;
```
