### Oracle中游标
### 一、简介
游标(Cursor) 就是一个变动的光标，它本质上是一个指针，指向从数据库查询出来的结果集任何一条记录，初始的时候指向第一条记录。
Oracle中游标分为两类：
* 普通游标，普通游标又可以分为两种类型：显式游标、隐式游标
* REF游标

### 二、显式游标
在使用前必须有着明确的游标声明和定义，显式游标的定义会关联查询语句，返回一条或多条记录，使用步骤：
* 声明游标
* 打开游标
* 读取数据
* 关闭游标

#### 1、结构
```
CURSOR xxx                  --声明游标，xxx是游标名称
    is select_statement;    --游标关联的select语句，注意：不能是select ... into 语句
    
OPEN xxx;                   --打开游标
FETCH xxx INTO v_name;      --读取数据
    ...
CLOSE cursor_name;          --关闭游标
```




#### 2、示例
```
示例1：
  CURSOR xxx is select * from sys_organ;              
  v_row  sys_organ%rowtype;         

  OPEN xxx;                                 
       LOOP
          FETCH xxx INTO v_row;    
       EXIT WHEN xxx%NOTFOUND;
          ......
       END LOOP;
  CLOSE xxx;                                 

示例2：
  CURSOR xxx is select id, name from sys_organ;
  v_id       sys_organ.id%type;
  v_name     sys_organ.name%type;
 
  OPEN xxx;
       LOOP
          FETCH xxx INTO v_id, v_name;
       EXIT  WHEN xxx%NOTFOUND;
          ......
       END LOOP;
  CLOSE xxx;
```




#### 3、显示游标的属性
* ISOPEN：游标是否打开
* FOUND：检查是否从结果集中提取到了数据，提取到返回true，否则返回false
* NOTFOUND：和FOUND相反
* ROWCOUNT：返回当前已经提取了多少行数据




#### 4、游标FOR循环
游标的使用大部分是为了迭代结果集，在PL/SQL中有一种更方便的循环游标的方式实现
```
  CURSOR xxx is select * from sys_organ;              
  v_row  sys_organ%rowtype;         

  FOR cur_info in xxx      --将游标返回的数据放入cur_info ，该变量是%rowtype类型，并且无需声明
  LOOP
      DBMS_OUTPUT.PUT_LINE(cur_info.id);
      DBMS_OUTPUT.PUT_LINE(cur_info.name);
  END LOOP;
```




#### 5、使用 FETCH ... BULK COLLECT INTO 语句提取全部数据
```
  CURSOR xxx is select * from sys_organ;
 
  TYPE v_row_type IS TABLE OF sys_organ%rowtype;
  v_organs  v_row_type;

  OPEN xxx;
      FETCH xxx BULK COLLECT INTO v_organs;    --将数据全部提取出来放入v_organs
      FOR i in 1..v_organs.count LOOP          --循环遍历
           DBMS_OUTPUT.PUT_LINE(product_tab(i).id);
           DBMS_OUTPUT.PUT_LINE(product_tab(i).name);
      END LOOP;
  CLOSE xxx;
```




#### 6、使用 FETCH ... BULK COLLECT INTO  LIMIT语句提取部分数据
```
  CURSOR xxx is select * from sys_organ;
 
  TYPE v_row_type IS TABLE OF sys_organ%rowtype;
  v_organs  v_row_type;

  OPEN xxx;
      LOOP  
        FETCH xxx BULK COLLECT INTO v_organs LIMIT 3;  --循环：每次提取3行数据放入v_organs
              FOR i in 1..v_organs.count LOOP          --循环v_organs 3行数据
                   DBMS_OUTPUT.PUT_LINE(product_tab(i).id);
                   DBMS_OUTPUT.PUT_LINE(product_tab(i).name);
              END LOOP;
      EXIT WHEN cur_product%NOTFOUND;
      END LOOP;
  CLOSE xxx;
```

#### 7、带参数的游标
```
  CURSOR xxx(param number) is select * from sys_organ where id > param;
  v_row  sys_organ%rowtype; 

  v_id := 10;
  OPEN xxx(v_id);   --打开游标时传入参数                                    
       LOOP
          FETCH xxx INTO v_row;    
       EXIT WHEN xxx%NOTFOUND;
          ......
       END LOOP;
  CLOSE xxx;    
```


### 三、隐式游标
隐式游标是PL/SQL自动管理的
* 隐式游标有默认名称
* 每当运行SELECT语句或者DML语句时，PL/SQL会打开一个隐式游标
* 隐式游标属性值始终是最新执行的SQL语句的

#### 1、结构
```
declare 
  v_name  sys_organ.name%type;  

begin
  select name into v_name from sys_organ where id = 1;
  IF SQL%FOUND THEN
     DBMS_OUTPUT.PUT_LINE(v_name);
  END IF;
end;
```

#### 2、隐式游标的属性
* ISOPEN：由Oracle控制，永远返回false
* FOUND：反应DML语句是否影响了数据，有影响时返回true，否则返回false；也可以反应SELECT INTO语句是否返回了数据，返回了数据则该属性值为true
* NOTFOUND：和FOUND相反，DML语句没有影响数据或SELECT INTO语句没有返回数据时值为true，其它false
* ROWCOUNT：反应DML语句影响数据的数量




### 四、REF游标
REF CURSOR是一个游标变量
* 显式游标时必须在定义部分指定其对应的select语句
* 使用REF CURSOR，可以在打开游标时再指定其对应的select语句

使用步骤
* 定义REF CURSOR类型、游标变量
* 打开游标
* 提取数据：和显式游标一样
* 关闭游标：和显式游标一样

#### 1、结构
```
TYPE ref_type IS REF CURSOR [RETURN return_type];  --定义REF CURSOR类型
xxx    type_type;                                  --声明游标变量

OPEN cur_name FOR select_statement;                --打开游标
OPEN cur_name FOR select_statement;                --打开游标
```



#### 2、示例
```
  v_name  sys_organ.name%type;  

  TYPE ref_type IS REF CURSOR;
  xxx ref_type;
  
  OPEN xxx FOR select name from sys_organ;
  LOOP
       FETCH xxx INTO v_name;
  EXIT WHEN xxx%NOTFOUND;
       ......
  END LOOP;
  CLOSE xxx;
```

#### 3、指定RETURN子句
如果定义了RETURN 子句，那么select_statement返回结果必须与RETURN 子句定义的记录类型匹配
```
  TYPE ref_type IS REF CURSOR RETURN sys_organ%rowtype;
  xxx ref_type;
  
  OPEN xxx FOR select * from sys_organ;
```
