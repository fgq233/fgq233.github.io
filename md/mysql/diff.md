### MySQL、Oracle 常用函数差异对比
Oracle 查询必须指定表名、MySQL不是必须的

### 一、字符串相关
#### 1. 计算字符长度
* MySQL：`char_length()`
* Oracle：`length()`

#### 2. 计算字节长度
* MySQL：`length()`
* Oracle：`lengthb()`

#### 3. 字符串拼接
* MySQL：`concat(s1, s2, ... sn)`
* Oracle：`concat(s1, s2)`或 `||` 

区别：MySQL的`concat()`可以拼接多个参数，Oracle的`concat()`只能拼接2个参数

#### 4. 字符串截取
* MySQL：`substring()、substr()`
* Oracle：  `substr()`

功能基本一致，区别在于截取的开始位置为0的情况

```
-- Oracle
select SUBSTR('123456', 1, 3), SUBSTR('123456', 0, 3) from dual; -- 输出都是123；

-- MySQL
select SUBSTRING('123456', 1, 3);   -- 输出123  
select  SUBSTRING('123456', 0, 3);  -- 输出空字符串
```

#### 5. 字符串搜索
* MySQL  
  * `instr(str, a)` 不区分大小写
  * `instr(str, binary a)` 区分大小写
* Oracle：  `instr(str, a)`


#### 6. uuid
* MySQL：`uuid()`
* Oracle：`sys_guid()`


### 二、日期相关
#### 1. 格式化：年月日时分秒
* MySQL：`%Y-%m-%d %H:%i:%s`
* Oracle：`yyyy-MM-dd HH24:mi:ss`

注意区分大小写

#### 2. 系统当前日期时间
* MySQL
  * `now()`                   
  * `sysdate()`     
  * `current_timestamp()`     
  * `localtime()`     
  * `localtimestamp()`
* Oracle：`sysdate`

#### 3. 日期转字符串
* MySQL：`date_format(date, format)`
* Oracle：`to_char(str, format)`

```
-- MySQL
select date_format(now(), '%Y-%m-%d %H:%i:%s')

-- Oracle
select to_char(sysdate, 'yyyy-MM-dd HH24:mi:ss') from dual
```

#### 4. 字符串转日期
* MySQL：`str_to_date(str, format)`
* Oracle：`to_date(str, format)`

```
-- MySQL
select str_to_date('2023-03-07 14:00:00', '%Y-%m-%d %H:%i:%s')

-- Oracle
select to_date('2023-03-07 14:00:00', 'yyyy-MM-dd HH24:mi:ss') from dual
```

#### 5. 日期截断
* MySQL：`date()`
* Oracle：`trunc()`

```
-- MySQL
select date(now())

-- Oracle
select trunc(sysdate) from dual
```

#### 6. 日期加减
* MySQL：`date()`
  * `adddate(date, n)`     date加n天
  * `subdate(date, n)`     date减n天
  * `date_add(date, interval n day) `       加、减天数
  * `date_add(date, interval n month) `     加、减月
  * `date_add(date, interval n year) `      加、减年
* Oracle
  * 天：直接使用 `+、-`
  * 月：add_months(date, n)
  * 年：add_months(date, 12)

n 的正、负代表加、减


#### 7. 计算两个日期相差天数
* MySQL：`datediff(date1, date2)`
* Oracle：`date1 - date2`

```
-- MySQL
select datediff(now() , now())

-- Oracle
select sysdate - sysdate from dual
```






### 三、与 null 相关
* Oracle 中空字符串被视为 null，MySQL 不是
* Oracle 中 null 被视为最大值，MySQL 中 null 被视为最小值

#### 1. ifnull() 与 nvl()
两者唯一区别在于空字符串的判断

```
-- MySQL
select ifnull('', 666)           -- 返回 ''

-- Oracle
select nvl('', 666) from dual    -- 返回 666
```

#### 2. if(expr1, expr2, expr3) 与 nvl2(expr1, expr2, expr3)
* expr1 的值若可以转化为0，如 `0、'0'、'0.0'`等，则前者返回 expr3，后者返回 expr2
* 其他情况下效果一致






### 四、转换函数
#### 1. 其他类型转字符串
* MySQL
  * `cast(val as char)`
  * `convert(val, char)`
* Oracle：`to_char()`

```
-- MySQL
select cast(666 as char)        

-- Oracle
select to_char(666) from dual    
```


#### 2. 字符串转数字
* MySQL
  * `cast(val as signed)`   
  * `convert(val, signed)`  
* Oracle：`to_number()`

```
-- MySQL
select cast('666' as signed)        
select convert('666', signed)        

-- Oracle
select to_number('666') from dual    
```


### 五、行转列
* MySQL：`group_concat()`
* Oracle：`wm_concat()`


### 六、其他函数
* `case when` 在 MySQL、Oracle中都可以使用，`decode()` 函数为 Oracle 独有
*  Oracle 中递归查询 `start with ... connect by prior`，MySQL不支持
*  对于分组排序 `ron_numer() over`，MySQL在 8.0 之后版本支持
*  对于`with as`临时表， MySQL在 8.0 之后版本支持
