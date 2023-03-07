###  Mysql 中的函数
### 1、字符串相关函数
```
lower(str)     转小写
upper(str)     转大写

char_length(str)  字符长度，类似Oracle的length
length(str)       字节长度，类似Oracle lengthb，utf8格式采用3个byte定义一个汉字、ZHS16GBK格式采用2个byte定义一个汉字

concat(s1, s2, ... sn)                 参数拼接，参数可以是任意类型，如果有任何一个参数为null，则返回值为null
concat_ws(separator, s1, s2, ... sn)   参数拼接(含分隔符)

ltrim(str)   去除左侧空格
rtrim(str)   去除右侧空格 
trim(str)    去除两侧空格 

lpad(str,n,a)    左填充：在字符串str的左边用a填充，直到字符串长度为n时停止
rpad(str,n,a)    右填充：在字符串str的右边用a填充，直到字符串长度为n时停止

field(str, s1, s2, ... )         返回str在列表中的位置
instr(str, a)                    在字符串中查找是否存在字符串a，存在返回a的位置，不存在返回0
position(substr in str)          返回字符串substr在str中的开始位置

replace(str, old, new)           将str中old字符替换为new
reverse(str)                     字符串反转
uuid()                           随机字符串，类似Oracle的sys_guid()

left(str, n)    返回str从左边开始前n个字符
right(str, n)   返回str从右边开始后n个字符

# PS：MySQL中substr效果和substring一样，起始位置从1开始，类似Oracle中的substr 
substr(str, start)        从起始位置start开始截取，截取到最后
substr(str, start, n)     从起始位置start开始截取，截取n个字符
```



### 2、数值相关函数
```
abs(n)      绝对值函数，n是任何可以转换为数值的数据
mod(a,b)    取余函数，返回a除以b的余数，若b=0，则返回a

ceil(n)     向上取整函数，n是任何可以转换为数值的数据
floor(n)    向下取整函数，n是任何可以转换为数值的数据

sqrt(n)     平方根函数，n不能为负数
pow(a,b)    指数函数，返回a的b次方，类似Oracle的power

truncate(n,x)  保留指定位数的小数，x为保留的小数位数，类似Oracle的trunc(n,x)
round(n)       四舍五入函数，等价于 round(n,0)
round(n,x)     四舍五入函数，x为保留的小数位数

rand(n)        随机数函数，返回0到1.0之间的小数，如果指定n每次产生的就都是重复的

least(n1, n2, ... n)        返回列表中最小值
greatest(n1, n2, ... n)     返回列表中最大值

strcmp(expr1,expr2)    expr1=expr2返回0，expr1>expr2返回1，expr1<expr2返回-1
```


### 3、日期相关函数
```
# 返回系统当前日期时间
now()                   
sysdate()     
current_timestamp()     
localtime()     
localtimestamp()     

curdate()、current_date()    当前日期 YYYY-MM-DD
curtime()、current_time ()   当前时间 hh-mm-ss

# 返回当前年、月、日、时、分、秒
year(date)、month(date)、day(date) 、hour(date) 、minute(date) 、second(date)     

adddate(date, n)             date加n天
subdate(date, n)             date减n天
addtime(date, time)          date加time时间，addtime(now(),'1:00:00')
subtime(date, time)          date减time时间，subtime(now(),'1:00:00')
datediff(date1, date2)       计算date1 - date2 两个日期相隔的天数

date_add(date, interval expr unit)   date加法，date_add(now(), interval 1 day) 
date_sub(date, interval expr unit)   date减法，date_sub(now(), interval 1 year) 

extract(unit from date)      提取年、月、日、时、分、秒

date(now())                  [DATE]2022-02-22 日期截断，类似Oracle中的 trunc()
date('20220202')             [DATE]2022-02-22 字符串转日期

date_format(date, format)    格式化显示日期，date_format(now(),'%Y-%m-%d')，Y、y分别表示4位数、2位数年份
time_format(date, format)    格式化显示时间，date_format(now(),'%H:%i:%s')，H、h分别表示24、12小时制

str_to_date(str, format)     字符串转日期，str_to_date('2022-11-02 12:00:00','%Y-%m-%d %H:%i:%s');
```


 

### 4、条件判断函数
```
# 如果表达式expr成立，返回结果v1，否则返回结果v2，类似 Oracle的nvl2(v, v1，v2)
if(expr, v1, v2) 

# 判断v1是否为null，不为null返回v1，为null返回v2，类似 Oracle的nvl(v1，v2)
ifnull(v1, v2)	

# 如果 v1=v2，那么返回值为null，否则返回v1
nullif(v1, v2)

# v为null返回1，不为null返回0
isnull(v)
```

注意：`MySQL`中空字符串不算`null`，而`Oracle`空字符串算`null`


### 5、转换函数 
* `cast(value AS datatype)`
* `convert(value, datatype)`

```
# 字符串转数字，类似Oracle 中 to_numer() 
cast('123' as signed);              字符串转数字(整数)
cast('123.12' as decimal(5,2))      字符串转数字(浮点数)
convert('123', signed)              字符串转数字(整数)
convert('123.12', decimal(5,2))     字符串转数字(浮点数)

# 数字转字符串，类似Oracle 中 to_char() 
cast(123 as char)
convert(123, char)

# 日期转字符串，类似Oracle 中 to_char() 
cast(now() as char)
convert(now(), char)
```



### 6、聚合函数
```
count()、sum()、min()、max()、avg()

# 行转列，类似Oracle 中的 wm_concat()，但是功能更强大，可以去重、排序、指定分隔符
group_concat([distinct] 字段名 [order by 排序字段 asc/desc] [separator])

select group_concat(username) from sys_user
select group_concat(username order by cjsj) from sys_user
select group_concat(username order by cjsj separator '-') from sys_user
```



### 7、分区函数 partition by、排名函数
* `partition by`：用于给结果集分组，如果没有指定那么它把整个结果集作为一个分组，
分区函数一般与排名函数一起使用遍历。和 `group by` 不同的在于它能返回一个分组中的多条记录，
而 `group by` 一般只有一条反映统计值的记录观的数据
* 排序函数：`row_number()`
* 跳跃排序函数：`rank()`
* 连续排序函数：`dense_rank()`

```
select t.organ_name, t.jglx, row_number() over (order by t.cjsj)                     ROWNUM排序     from SYS_ORGAN t;
select t.organ_name, t.jglx, row_number() over (partition by t.jglx order by t.cjsj) 组内ROWNUM排序 from SYS_ORGAN t;
select t.organ_name, t.jglx, rank() over       (partition by t.jglx order by t.cjsj) 组内跳跃排序   from SYS_ORGAN t ;
select t.organ_name, t.jglx, dense_rank() over (partition by t.jglx order by t.cjsj) 组内连续排序   from SYS_ORGAN t;
```
