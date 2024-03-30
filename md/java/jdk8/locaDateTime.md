###  LocaDate、LocalTime、LocaDateTime   
* JDK 中 Date 有以下缺点
  * 直接打印出`Date`对象的可读性差
  * 使用`SimpleDateFormat`对日期时间进行格式化，非线性安全
  * `Date`时间处理比较麻烦
  * `Date`相关类名的命名并不严谨
* JDK8 中新增 `LocalDate、LocalTime、LocalDateTime` 三个类及相关API用以替代`Date`

### 一、 创建对象、获取信息
* `LocaDate`      获取年、月、日信息
* `LocalTime`      获取时、分、秒、纳秒信息
* `LocalDateTime`   获取年月日时分秒纳秒信息


#### 1. 创建
```
// 获取系统当前时间 now()
LocalDate localDate = LocalDate.now();
LocalTime localTime = LocalTime.now();
LocalDateTime localDateTime = LocalDateTime.now();

// 获取指定时间  of()
LocalDate localDate = LocalDate.of(2000, 1, 1);
LocalTime localTime = LocalTime.of(17, 30, 0);
LocalDateTime localDateTime1 = LocalDateTime.of(2000, Month.OCTOBER, 1, 20, 0, 0);
LocalDateTime localDateTime2 = LocalDateTime.of(LocalDate.now(), LocalTime.now());
```



#### 2. LocaDate 获取年、月、日
```
// 获取年
int year1 = localDate.getYear();
int year2 = localDate.get(ChronoField.YEAR);

// 获取月 1-12
Month month1 = localDate.getMonth();
int month2 = localDate.getMonthValue();
int month3 = localDate.get(ChronoField.MONTH_OF_YEAR);

// 当年第几天  1-365
int dayOfYear = localDate.getDayOfYear();
int dayOfYear2 = localDate.get(ChronoField.DAY_OF_YEAR);
// 当月第几天  1-31
int dayOfMonth = localDate.getDayOfMonth();
int dayOfMonth2 = localDate.get(ChronoField.DAY_OF_MONTH);
// 周第几天  1-7
DayOfWeek dayOfWeek = localDate.getDayOfWeek();
int dayOfWeek2 = localDate.get(ChronoField.DAY_OF_WEEK);
```



#### 3. LocalTime  获取时、分、秒
```
// 获取时分秒
int hour1 = localTime.getHour();
int hour2 = localTime.get(ChronoField.HOUR_OF_DAY);
int minute1 = localTime.getMinute();
int minute2 = localTime.get(ChronoField.MINUTE_OF_HOUR);
int second1 = localTime.getSecond();
int second2 = localTime.get(ChronoField.SECOND_OF_MINUTE);
```

#### 4. LocalDateTime 获取年月日时分秒
* LocalDate、LocalTime 获取相关的API LocalDateTime 基本都有
* LocalDateTime 也可以转化为另外2个对象

```
LocalDate localDate = localDateTime.toLocalDate();
LocalTime localTime = localDateTime.toLocalTime();
```


### 二、 时间计算
> `LocalDate、LocalTime、LocalDateTime、Instant` 为『不可变对象』，修改后会返回一个新对象

#### 1. plusXXX() 增加年、月、日、时、分、秒
```
localDateTime = localDateTime.plusYears(1);
localDateTime = localDateTime.plusMonths(1);
localDateTime = localDateTime.plusDays(1);
localDateTime = localDateTime.plusHours(1);
localDateTime = localDateTime.plusMinutes(1);
localDateTime = localDateTime.plusSeconds(1);
// 通用方法，需要传入单位
localDateTime = localDateTime.plus(1, ChronoUnit.YEARS);
......
```


#### 2. minusXXX()  减少年、月、日、时、分、秒
```
localDateTime = localDateTime.minusYears(1);
localDateTime = localDateTime.minusMonths(1);
localDateTime = localDateTime.minusDays(1);
localDateTime = localDateTime.minusHours(1);
localDateTime = localDateTime.minusMinutes(1);
localDateTime = localDateTime.minusSeconds(1);
// 通用方法，需要传入单位
localDateTime = localDateTime.minus(1, ChronoUnit.YEARS);
```


#### 3. withXXX() 直接修改年、月、日、时、分、秒为某个值
```
LocalDateTime localDateTime1 = localDateTime.withYear(2088);
LocalDateTime localDateTime2 = localDateTime.withMonth(12);
LocalDateTime localDateTime3 = localDateTime.withDayOfMonth(31);
......
```

#### 4. 判断  isBefore()、isAfter()、equals()



