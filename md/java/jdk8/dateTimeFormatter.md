###  DateTimeFormatter
* 用于替代 `SimpleDateFormat`
* 线程安全

### 一、 格式化 (时间转字符串)
#### 1. 使用 DateTimeFormatter 格式化
```
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");
String s = formatter.format(LocalDateTime.now());
```

#### 2. 使用 LocalDate、LocalTime、LocalDateTime 格式化方法 format()
```
String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
String datetime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS"));
```


### 二、 解析  (字符串转时间)
#### 1. 使用 DateTimeFormatter 解析方法
```
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
TemporalAccessor ta = formatter.parse("2022-01-01 17:30:00");
```


#### 2. 使用 LocalDate、LocalTime、LocalDateTime 解析方法 parse()
```
LocalDate localDate = LocalDate.parse("2022/01/01", DateTimeFormatter.ofPattern("yyyy/MM/dd"));
LocalTime localTime = LocalTime.parse("17:30:00", DateTimeFormatter.ofPattern("HH:mm:ss"));
LocalDateTime localDateTime = LocalDateTime.parse("2022-01-01 17:30:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
```
