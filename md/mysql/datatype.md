### Mysql 常用数据类型
#### 1. 数值类型
* `tinyint`：极小整型
    * 有符号范围：(-128，127)
    * 无符号范围：(0，255)
* `smallint`：小整型
    * 有符号范围：(-32768，32767)
    * 无符号范围：(0，65535)
* `mediumint`：中度整型
    * 有符号范围：(-8388608，8388 607)
    * 无符号范围：(0，16777215)
* `int` 或 `integer`：整型
    * 有符号范围：(-2147483648，2147483647)
    * 无符号范围：(0，4294967295)
* `bigint`：大整型
    * 有符号范围：(-9223372036854775808，9223372036854775807)
    * 无符号范围：(0，18446744073709551615)
* `float`：单精度浮点数值
* `double`：双精度浮点数值
* `decimal`：小数
    * 如：`decimal(5,2)` 表示能存5位数字，小数占2位，不能超过2位，整数占3位，不能超过3位
    

#### 2. 日期和时间类型
* `date`：日期
    * 格式：`YYYY-MM-DD`
    * 范围：`1000-01-01/9999-12-31`
* `time`：时间值或持续时间
    * 格式：`HH:MM:SS`
    * 范围：`-838:59:59/838:59:59`
* `year`：年份值
    * 格式：`YYYY`
    * 范围：`1901/2155`
* `datetime`：日期时间
    * 格式：`YYYY-MM-DD hh:ii:ss`
    * 范围：`1000-01-01 00:00:00 到 9999-12-31 23:59:59`
* `timestamp`：时间戳
    * 格式：`YYYY-MM-DD hh:ii:ss`
    * 范围：`1970-01-01 00:00:01 到 2038-01-19 03:14:07`
    
    
#### 3. 字符串类型
* `char`：0-255 bytes，定长字符串
* `varchar`：0-65535 bytes，变长字符串
* `tinytext`：0-255 bytes 文本字符串
* `text`：0-65535 bytes   文本字符串
* `mediumtext`：0-16777215 bytes 文本字符串
* `longtext`：0-4294967295 bytes 文本字符串


     
    
#### 4. 二进制类型 
* `tinyblob`：0-255 bytes
* `blob`：0-65535 bytes
* `mediumblob`：0-16777215 bytes
* `longblob`：0-4294967295 bytes

     
   