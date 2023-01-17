###  Mysql 中的函数
### 1、字符串相关函数
```
lower(str)     转小写
upper(str)     转大写

char_length(str)  字符长度，类似Oracle的length
length(str)       字节长度，类似Oracle lengthb，utf8格式采用3个byte定义一个汉字

ltrim(str)   去除左侧空格
rtrim(str)   去除右侧空格 
trim(str)    去除两侧空格 

lpad(str,n,a)    左填充：在字符串str的左边用a填充，直到字符串长度为n时停止
rpad(str,n,a)    右填充：在字符串str的右边用a填充，直到字符串长度为n时停止

instr(str, a)                    在字符串中查找是否存在字符串a，存在返回a的位置，不存在返回0
replace(str, old, new)           将str中str字符替换为new
concat(参数1, 参数2, ... 参数n)   字符串拼接，参数可以是字符串、数字
uuid()                           随机字符串，类似Oracle的

left(str, n)    从左边截取n个字符
right(str, n)   从右边截取n个字符

# PS：起始位置从1开始，下面4个等价于Oracle的substr 
substr(str, start)        从起始位置start开始截取，截取到最后
substr(str, start, n)     从起始位置start开始截取，截取n个字符
substring(str, start)     从起始位置start开始截取，截取到最后
substring(str, start, n)  从起始位置start开始截取，截取n个字符
```



### 2、数值相关函数
```
abs(n)      绝对值函数，n是任何可以转换为数值的数据
mod(a,b)    取余函数，返回a除以b的余数，若b=0，则返回a

ceil(n)     向上取整函数，n是任何可以转换为数值的数据
floor(n)    向下取整函数，n是任何可以转换为数值的数据

sqrt(n)     平方根函数，n不能为负数
pow(a,b)    指数函数，返回a的b次方，类似Oracle的power

truncate(n,x)  保留指定位数的小数，x为保留的小数位数
round(n,x)     四舍五入函数，x为保留的小数位数

rand(n)     随机数函数，返回0到1.0之间的小数，如果指定n每次产生的就都是重复的
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

extract(year from sysdate)   截取年
extract(month from sysdate)  截取月
extract(day from sysdate)    截取日

date_format(date, format)    格式化显示日期，date_format(now(),'%y-%m-%d')，Y、y分别表示4位数、2位数年份
time_format(date, format)    格式化显示时间，date_format(now(),'%h:%i:%s')，H、h分别表示24、12小时制

str_to_date(str, format)     字符串转日期，str_to_date('2022-11-02 12:00:00','%Y-%m-%d %H:%i:%s');
```


 

### 4、条件判断函数
```
# 如果表达式expr成立，返回结果v1，否则返回结果v2，类似 Oracle的nvl2(v, v1，v2)
if(expr, v1, v2) 

# 判断某一个值是不是为空，如果v1的值不为NULL，则返回v1，否则返回v2，类似 Oracle的nvl(v1，v2)
ifnull(v1, v2)	
```

	

