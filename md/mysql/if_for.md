## 逻辑控制语句
### 一、流程控制语句
#### 1. IF ELSE 
```
形式1：
    IF condition THEN
        statements;
    END IF;
形式2：
    IF condition THEN
        statements;
    ELSE
        statements;
    END IF;
形式3：
    IF condition THEN
        statements;
    ELSEIF condition THEN
        statements;
    ELSE
        statements;
    END IF; 
```


#### 2. CASE
```
简单case语句
        CASE case_expr              --这是一个变量或者表达式
        WHEN case_value1 THEN
            statement;
        WHEN case_value2 THEN
            statement;
        ELSE                        --当所有value都不匹配时执行，可省略
            statment;
        END CASE;
搜索式case语句
        CASE                        --这里没有表达式
        WHEN boolean_expr1 THEN
            statement;
        WHEN boolean_expr2 THEN
            statement;
        ELSE                        --当所有 boolean_expr都不成立时执行，可省略
            statment;
        END CASE;  
```



### 二、循环控制语句
#### 1. LOOP基本循环
* `LEAVE`：用于退出循环，否则会一直执行下去
* `ITERATE`：用在循环体中，跳过本次循环剩下的语句，进入下一次循环，类似Java中 `continue`

```
[label:]LOOP           -- 循环开始标志
    statement;         -- 循环体
END LOOP [label];      -- 循环结束标志

LEAVE label;           -- 退出循环
ITERATE label;         -- 跳过本次循环

示例：
CREATE PROCEDURE xxx ( IN n INT ) BEGIN
  DECLARE v_total INT DEFAULT 0;
  
  sum:LOOP
    IF n = 0 THEN
      LEAVE sum;
    END IF;
    
    SET v_total := v_total + n;
    SET n := n - 1;
  END LOOP sum;
  
  SELECT v_total;
END;
```


#### 2. WHILE ... DO循环
先判断条件，满足则执行循环体，否则退出循环

```
WHILE 条件 DO         
    statement;      -- 循环体
END WHILE;

示例：
CREATE PROCEDURE xxx ( IN n INT ) BEGIN
  DECLARE v_total INT DEFAULT 0;
  
  WHILE n > 0 DO
    SET v_total := v_total + n;
    SET n := n - 1;
  END WHILE;
  
  SELECT v_total;
END;
```


#### 3. REPEAT 循环
* 先执行循环体一次，再判断条件是否满足
* 满足条件，退出循环，否则继续执行下一次循环

```
REPEAT
  statement;      -- 循环体
UNTIL 条件 
END REPEAT;      

示例：
CREATE PROCEDURE xxx ( IN n INT ) BEGIN
  DECLARE v_total INT DEFAULT 0;
  
  REPEAT
    SET v_total := v_total + n;
    SET n := n - 1;
  UNTIL n = 0 
  END REPEAT;
  
  SELECT v_total;
END;
```


