### Oracle中函数
#### 1. 字符串相关函数
```
lower(str)     转小写
upper(str)    转大写
initcap(str)   所有单词首字母转大写，其它全部小写

length   字符长度，汉字在length时返回的时1
lengthb  字节长度，utf8格式采用3个byte定义一个汉字、ZHS16GBK格式采用2个byte定义一个汉字

substr(str, start)       从起始位置start开始截取，截取到最后
substr(str, start, n)    从起始位置start开始截取，截取n个字符
PS：起始位置从1开始

instr(源字符串, 目标字符串, 起始位置, 匹配序号)，起始位置为负数代表从右边开始查找
instr(str, a)      在字符串中查找是否存在字符串a，存在返回a的位置，不存在返回0
instr(str, a, i)   在字符串中第i位开始查找是否存在字符串a，存在返回a的位置，不存在返回0

replace(str, a)      从字符串str中搜索字符串a并删除
replace(str, a, b)   从字符串a中搜索字符串a并替换为字符串b

lpad(str,n,a)    左填充：在字符串str的左边用a填充，直到字符串长度为n时停止
rpad(str,n,a)    右填充：在字符串str的右边用a填充，直到字符串长度为n时停止

trim([leading/trailing/both] [A from] str)        删除str中的 前缀/后缀/两端 的字符A
ltrim(str, A)   左删除：与leading等同
rtrim(str, A)   右删除：与trailing等同
trim(str)       字符串左右两端去空格

concat(s1, s2)  字符串拼接，也可以使用 || 操作符
sys_guid()      随机字符串
```



#### 2. 数值相关函数
```
abs(n)      绝对值函数，n是任何可以转换为数值的数据
mod(a,b)    取余函数，返回a除以b的余数，若b=0，则返回a

ceil(n)     向上取整函数，n是任何可以转换为数值的数据
floor(n)    向下取整函数，n是任何可以转换为数值的数据

sqrt(n)     平方根函数，n不能为负数
power(a,b)  指数函数，返回a的b次方

round(n,x)  四舍五入函数，x为保留的小数位数
trunc(n,x)  截断函数，x为保留的小数位数
```


#### 3. 日期相关函数
```
sysdate                  返回系统当前日期时间

trunc(date)              返回当天日期 2020-12-16
trunc(date, format)      返回指定日期，format：'YYYY'或'year' 当年第一天、'Q'当季度第一天、'MM'或'month'当月第一天、'day'本周第一天

add_months(date, n)              加月函数
months_between(date1, date2)     date1 - date2 相差的月份 
last_day(date)                   返回当月最后一天

extract(year from sysdate)   截取年
extract(month from sysdate)  截取月
extract(day from sysdate)    截取日
```


#### 4. 转换相关函数
```
to_char(date, format)    日期转为字符串，YYYY-MM-DD HH24:Mi:SS
to_char(num, format)     数值转为字符串，format：9代表有一位数字、0代表0、$代表美元、L代表本地货币符号¥、.代表小数点

to_date(date, format)     字符串转为日期


to_number(x)             将一个值转为数字，必须为可以转成数字的值，否则会报错 
to_number(x, format)     将一个值按照指定格式转为数字
示例：
select to_number('￥16,000.00','L99,999.99') from dual;    结果：  16000
select to_number('666') from dual;    结果：  666
```



#### 5. case when 与 decode
```
用于=对比：
    case expr when value1 then return_1
        [ when value2 then return_2 ]
        ...
        [ else return_default ]
    end AS 别名
用于范围对比：
    case when condition1 then return_1
        [ when condition2 then return_2 ]
        ...
        [ else return_default ]
    end AS 别名
decode (expression, search_1, result_1, search_2, result_2, ...., search_n, result_n)
decode (expression, search_1, result_1, search_2, result_2, ...., search_n, result_n, default)
```
* case语句是基于SQL99标准的，不仅Oracle可以用，其他基于SQL99标准的关系型数据库中也可以用
* Oracle中也提供了一个内置函数：decode函数，可以快速的实现case语句的效果
* 对比表达式 expression 和 搜索值 search_n 是否相等，相等返回result_n，都不匹配的话返回默认值，没有定义默认值返回 null

  