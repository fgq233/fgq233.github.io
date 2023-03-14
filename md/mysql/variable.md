### MySQL变量
### 一、概念
* 系统变量：MySQL服务器提供的，以两个`@@`开头
  * 全局系统变量：用`@@global`标记，对于所有会话有效
  * 会话系统变量：用`@@session`标记，对于当前会话有效，当前会话对某个会话系统变量值修改，不会影响其他会话
  
* 用户变量：用户自己定义的变量
  * 会话用户变量：以一个`@`开头，只对当前会话有效
  * 局部变量
    * 一般在存储过程和函数中使用，在 begin 和 end 之间，超出此范围则不可用
    * 使用前，需要先通过`declare`声明


### 二、系统变量
#### 1. 查看系统变量
* 查看所有系统变量

```
# 查看所有全局系统变量 
show global variables;

# 查看所有会话系统变量
show session variables; 

# 查看所有系统变量
show variables;
```

* 查看指定的系统变量

```
# 搭配 like 模糊查询变量
show global variables like '%变量名%';

# 查看指定的全局系统变量的值
select @@global.变量名;

# 查看指定的会话系统变量的值
select @@session.变量名;

# 或者
select @@变量名;
```


#### 2. 设置系统变量
```
# 全局系统变量修改 
set @@global.变量名 = 变量值; 
set global 变量名 = 变量值; 

# 会话系统变量修改 
set @@session.变量名 = 变量值; 
set session 变量名 = 变量值; 
```



### 三、会话用户变量
用户变量不用提前声明，用的时候直接用 `@变量名` 使用即可，未赋值直接使用的时候为 `null`

#### 1. 赋值
```
# 方式1 
set @变量名 = 值; 
set @变量名 := 值; 

# 方式2 
select @变量名 := 表达式; 
select 表达式 into @变量名 [from 子句];
```

#### 2. 赋值示例
```
set @xx = 66;
set @xx := 6;

select @xxx := now();
select now() into @xxx;
```

#### 3. 使用示例
```
select @变量名;

# 获取行号，实现 Oracle 中伪列 ROWNUM 的效果
select @rownum := @rownum + 1 rownum, s.*
  from sys_organ s, (select @rownum := 0) t
```


### 四、局部变量
局部变量需要先通过 `declare` 声明
#### 1. 声明、赋值
```
# 声明
declare 变量名 变量类型 [默认值];

# 赋值方式1 
set 变量名 = 值; 
set 变量名 := 值; 

# 赋值方式2 
select 表达式 into 变量名 [from 子句];
```

#### 2. 使用示例
```
CREATE PROCEDURE xxx()
BEGIN
    DECLARE v_now datetime;
    set v_now := NOW();
    SELECT v_now;
END;
```


#### 四. 扩展
#### 1. 实现 Oracle 中 ROWNUM 效果
```
select
  @rownum := @rownum + 1 rownum,
  s.* 
from sys_organ s, (select @rownum := 0 ) x
```
