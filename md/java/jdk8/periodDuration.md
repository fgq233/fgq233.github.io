###  Period、Duration
* `Period` 用于计算两个`LocalDate`间隔相差的年、月、天数
* `Duration` 用于计算两个时间间隔相差的天、时、分、秒、纳秒


#### 1. Period  
* 仅支持 `LocalDate`
* 注意：years + months + days 才是两个日期相差的总间隔

```
Period between = Period.between(LocalDate.now().minusYears(1), LocalDate.now());
int years = between.getYears();     // 1
int months = between.getMonths();   // 0
int days = between.getDays();       // 0
```

#### 2. Duration
* 支持 `LocalTime、LocalDateTime、Instant`
* 注意：这里是总间隔

```
Duration between = Duration.between(LocalDateTime.now().minusDays(1), LocalDateTime.now());
long days = between.toDays();           // 1
long hours = between.toHours();         // 24
long minutes = between.toMinutes();     // 1440
long millis = between.getSeconds();     // 86400
long nanos = between.toNanos();         // 86400000000000
```
