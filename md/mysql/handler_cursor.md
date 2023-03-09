### 条件处理程序、游标
### 一、条件处理程序 handler
#### 1. 声明语法
```
DECLARE 动作 handler for 条件 statment;
```

当满足条件时，触发某个动作，执行动作后，再执行 `statment` 语句

* 动作
    * `CONTINUE`   继续执行当前程序
    * `EXIT`       终止执行当前程序
* 条件
    * `SQLSTATE sqlstate_value`  状态码，如 02000
    * `SQLWARING`                所有以`01`开头的`SQLSTATE`代码简写
    * `NOT FOUND`                 所有以`02`开头的`SQLSTATE`代码简写
    * `SQLEXCEPTION`             所有没有被`SQLWARING、NOTFOUND`捕获的`SQLSTATE`代码的简写
* `statement` 可以是单条语句或复合语句

#### 2. 示例
```
# 退出游标示例
DECLARE exit handler for NOT FOUND CLOSE V_CUR;

# 捕获异常示例
CREATE PROCEDURE testErr()
BEGIN
    DECLARE err_code CHAR(5) DEFAULT '00000';
    DECLARE err_msg TEXT;

    #------捕获异常-----START-----#
    DECLARE exit handler for SQLEXCEPTION
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1 err_code = RETURNED_SQLSTATE, err_msg = MESSAGE_TEXT;
        insert into error_log (e_code, e_msg) 
            values (err_code, err_msg);
    END;
    #------捕获异常-----END-----#
   
    START TRANSACTION; 
    -- 执行逻辑
    COMMIT; 
END;
```


### 二、游标 cursor
#### 1. 使用步骤
* 声明游标   `DECLARE`
* 打开游标  `OPEN`
* 读取数据  `FETCH`
* 关闭游标  `CLOSE`

#### 2. 语法
```
DECLARE 游标名称 CURSOR FOR 查询语句;    -- 声明游标
       
OPEN 游标名称;                          -- 打开游标
FETCH 游标名称 INTO 变量1, 变量2...;     -- 提取数据
    ...
CLOSE 游标名称;                         -- 关闭游标
```



#### 3. 示例
```
CREATE PROCEDURE xxx () BEGIN
  -- 声明变量
  DECLARE v_id BIGINT;
  DECLARE v_code VARCHAR (100);
  -- 声明控制循环的变量
  DECLARE done TINYINT DEFAULT FALSE;
  -- 声明游标
  DECLARE v_cur CURSOR FOR SELECT id, organ_code FROM sys_organ LIMIT 10;
  -- 声明条件处理程序
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;
  
  -- 建表
  DROP TABLE IF EXISTS AAA;
  CREATE TABLE IF NOT EXISTS AAA ( 
         ID BIGINT PRIMARY KEY AUTO_INCREMENT, 
         CODE VARCHAR (100) 
  );
  -- 打开游标
  OPEN v_cur;
  WHILE !done DO
      -- 提取数据
      FETCH v_cur INTO v_id, v_code;
      INSERT INTO aaa VALUES (v_id, v_code);
  END WHILE;
  -- 关闭游标
  CLOSE v_cur;
END;
```