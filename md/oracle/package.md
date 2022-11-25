## Oracle中包
### 一、组成结构
包由包规范、包体组成
#### 1、包规范
```
create or replace package pkg_name   
{is|as}
    -- 定义包规范的公用组件
end;
```

#### 2、包体
* 包体用于实现包规范中定义的过程、函数，
* 可以单独定义私有组件，但只能在包内使用，不能在其它子程序中使用
```
create or replace package body pkg_name   
{is|as}
    -- 实现包规范中定义的过程、函数，定义私有组件
end;
```




### 二、示例
#### 1、包规范
```
create or replace package xxx is
  
    v_address VARCHAR2(20) := '中国';       

    PROCEDURE add_product(in_name VARCHAR2, in_address VARCHAR2 DEFAULT v_address);

    PROCEDURE del_category(in_cid NUMBER);
    
    FUNCTION  get_cname(in_cid NUMBER) RETURN VARCHAR2;
     
end;
```


#### 2、包体 
```
create or replace PACKAGE BODY xxx is
     
    --私有组件: 
    function  check_fun(in_cid NUMBER) 
      return boolean
    is
      v_count NUMBER;
    begin
      return true;
    end;    
       

    --实现 add_product  
    PROCEDURE add_product(in_name VARCHAR2, in_address VARCHAR2 DEFAULT v_address)
    IS BEGIN
       ...
    END;      

    --实现 del_category 
    PROCEDURE del_category(in_cid NUMBER)
    IS BEGIN
       ...
    END;

    --实现 get_cname 
    FUNCTION  get_cname(in_cid NUMBER) 
      RETURN VARCHAR2
    IS BEGIN
      ...
    END;
    
end;
```


### 三、包重载
```
PROCEDURE delXXX(in_cid NUMBER);
PROCEDURE delXXX(in_cname VARCHAR2);

FUNCTION  getXXX(in_pid NUMBER)  RETURN NUMBER;
FUNCTION  getXXX(in_name VARCHAR2) RETURN NUMBER;
```
包重载指包内有多个相同名称的子程序
* 同名的存储过程、函数必须有不同的输入参数
* 同名的函数返回值数据类型必须一致