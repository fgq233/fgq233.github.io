## MySQL 中自定义函数
#### 1. 组成结构
```
CREATE FUNCTION 函数名称 ( param1, param2...) 
RETURNS datatype [ characteristic ] 
BEGIN
	...函数体 (至少要包含一条 RETURN 语句 ) 
END;
```

* 参数：只能有输入参数，且 `in` 省略
* `RETURNS datatype` 返回值的数据类型
* `characteristic`
  * `deterministic`  相同的输入参数总是产生相同的结果
  * `no sql`  不包含SQL 语句
  * `reads sql data`  包含读取数据的语句，但不包含写入数据的语句



#### 2. 无参函数
```
CREATE FUNCTION fun_xxx () 
RETURNS VARCHAR(20) DETERMINISTIC 
BEGIN
    DECLARE v_now VARCHAR(20);
    SET v_now := date_format( now(), '%Y%m%d%H%i%s' );
    RETURN v_now;
END;
```

#### 3. 带参函数
```
CREATE FUNCTION fun_xxx( num1 INT, num2 INT ) 
RETURNS int DETERMINISTIC 
BEGIN
    DECLARE v_sum INT;
    SET v_sum := num1 + num2;
    RETURN v_sum;
END;
```
