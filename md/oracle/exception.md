## Oracle中异常
### 1、异常块语法
```
EXCEPTION
    WHEN exception1 [or exception2...] THEN     --异常匹配1
        statement;                              --处理
    WHEN exception3 THEN                        --异常匹配2
        statement;                              --处理
    ......
    WHEN OTHERS THEN                            --都不匹配时处理(可选)
        statement;

示例1
begin
  v_result := 1/0;
  DBMS_OUTPUT.PUT_LINE(v_result);
exception
  when ZERO_DIVIDE then
       DBMS_OUTPUT.PUT_LINE('除数不能为0');
end;

示例2
begin
  v_result := 1/0;
  DBMS_OUTPUT.PUT_LINE(v_result);
exception
  when others then
    rollback;
    v_errorMessage := sqlerrm(sqlcode);
end;
```


### 2、异常分类
* 预定义异常
* 非预定义异常
* 自定义异常

前2者都是Oracle中的错误，出现时会自动触发，而自定义异常需要手动触发
 
 
### 3、异常函数
通过异常函数来获取异常的相关信息
* sqlerrm：获取异常编号
* sqlcode：获取异常信息

 