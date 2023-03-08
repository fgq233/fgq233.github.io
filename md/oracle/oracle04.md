## 逻辑控制语句
### 一、逻辑控制语句
#### 1、IF ELSE
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
    ELSIF condition THEN
        statements;
    ELSE
        statements;
    END IF; 
```

相对于 MySQL 中 `ELSEIF`，Oracle 少一个 `E`

#### 2、CASE
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
#### 1、LOOP基本循环
基本循环结构需要搭配 EXIT 退出循环，否则会一直执行下去.
```
LOOP                    --循环开始标志
    statement;          --循环体
END LOOP;               --循环结束标志

示例1：
  i := 1;
  LOOP
    DBMS_OUTPUT.PUT_LINE(i);
  EXIT WHEN i >= 10;
    i := i+1;
  END LOOP;
  
示例2：
  i := 1;
  LOOP
    DBMS_OUTPUT.PUT_LINE(i);
      IF i >= 10 THEN
        EXIT;
      END IF;
      i := i+1;
  END LOOP;
```


#### 2、WHILE ... LOOP循环
```
WHILE boolean_expr      --布尔表达式
LOOP
    statement;          --循环体
END LOOP;

示例：
  i := 1;
  WHILE i <= 10
  LOOP
    DBMS_OUTPUT.PUT_LINE(i);
    i := i+1;
  END LOOP;
```


#### 3、FOR 循环
```
FOR index IN [REVERSE]              --index：循环次数    REVERSE：循环方式，默认从下边界到上边界，使用之后刚好相反
    lowerBound .. upperBound      --分别对应FOR循环的下边界、上边界，用..连接
LOOP                
    statment;      --循环体
END LOOP;       

示例：
  FOR i IN 1..10
  LOOP
    DBMS_OUTPUT.PUT_LINE(i);
  END LOOP;
```
当lowerBound与upperBound相等时，循环只执行一次，同时，这两者也可以用变量来代替，动态控制循环范围


#### 4、CURSOR FOR LOOP：在游标中使用

### 三、顺序控制语句
一般都是从前到后的顺序执行，同时也可以使用 GOTO、NULL 来控制顺序
* GOTO：跳转到特定处执行随后的语句
* NULL：不会执行任何操作

