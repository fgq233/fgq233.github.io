###  LocaDate、LocalTime、LocaDateTime   
* JDK 中 Date 有以下缺点
  * 直接打印出`Date`对象的可读性差
  * 使用`SimpleDateFormat`对日期时间进行格式化，非线性安全
  * `Date`时间处理比较麻烦
  * `Date`相关类名的命名并不严谨
* JDK8 中新增 `LocalDate、LocalTime、LocalDateTime` 三个类及相关API用以替代`Date`

### 一、 LocaDate  获取年月日信息
```
// 创建
LocalDate localDate = LocalDate.now();
LocalDate localDate = LocalDate.of(2000, 1, 1);

// 获取年月日
int year1 = localDate.getYear();
int year2 = localDate.get(ChronoField.YEAR);

Month month1 = localDate.getMonth();
int month2 = localDate.get(ChronoField.MONTH_OF_YEAR);

int day1 = localDate.getDayOfMonth();
int day2 = localDate.get(ChronoField.DAY_OF_MONTH);
```

### 二、 LocalTime  获取时分秒信息
```
// 创建
LocalTime localTime = LocalTime.now();
LocalTime localTime = LocalTime.of(17, 30, 0);

// 获取时分秒
int hour1 = localTime.getHour();
int hour2 = localTime.get(ChronoField.HOUR_OF_DAY);
int minute1 = localTime.getMinute();
int minute2 = localTime.get(ChronoField.MINUTE_OF_HOUR);
int second1 = localTime.getSecond();
int second2 = localTime.get(ChronoField.SECOND_OF_MINUTE);
```


 

### 三、 LocalDateTime 获取年月日时分秒
`LocalDate、LocalTime、LocalDateTime、Instant` 为『不可变对象』，修改后会返回一个新对象
#### 1. 创建
```
LocalDateTime localDateTime = LocalDateTime.now();
LocalDateTime localDateTime = LocalDateTime.of(2000, Month.OCTOBER, 1, 20, 0, 0);
LocalDateTime localDateTime = LocalDateTime.of(LocalDate.now(), LocalTime.now());
```


#### 2. 获取年月日、时分秒
```
LocalDate localDate = localDateTime.toLocalDate();
LocalTime localTime = localDateTime.toLocalTime();
```


#### 3. 计算
```
// 增加年、减少年
localDateTime = localDateTime.plusYears(1);
localDateTime = localDateTime.minusYears(1);
// 增加月、减少月
localDateTime = localDateTime.plusMonths(1);
localDateTime = localDateTime.minusMonths(1);
// 增加日、减少日
localDateTime = localDateTime.plusDays(1);
localDateTime = localDateTime.minusDays(1);
// 增加小时、减少小时
localDateTime = localDateTime.plusHours(1);
localDateTime = localDateTime.minusHours(1);
// 增加分钟、减少分钟
localDateTime = localDateTime.plusMinutes(1);
localDateTime = localDateTime.minusMinutes(1);
// 增加秒、减少秒
localDateTime = localDateTime.plusSeconds(1);
localDateTime = localDateTime.minusSeconds(1);

// 通用方法，需要传入单位
localDateTime = localDateTime.plus(1, ChronoUnit.YEARS);
localDateTime = localDateTime.minus(1, ChronoUnit.YEARS);
```


#### 4. 格式化 DateTimeFormatter 
`DateTimeFormatter` 默认提供了多种格式化，也可以通过 `ofPattern()` 方法创建自定义格式

```
String s1 = localDateTime.format(DateTimeFormatter.BASIC_ISO_DATE);  // yyyyMMdd
String s2 = localDateTime.format(DateTimeFormatter.ISO_LOCAL_DATE);  // yyyy-MM-dd

// 自定义格式
DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
String s3 = localDateTime.format(formatter);  
```


#### 5. 解析时间
相较于`SimpleDateFormat`，`DateTimeFormatter`是线程安全的

```
LocalDate localDate1 = LocalDate.parse("20201001", DateTimeFormatter.BASIC_ISO_DATE);
LocalDate localDate2 = LocalDate.parse("2020-12-01", DateTimeFormatter.ISO_LOCAL_DATE);
```
