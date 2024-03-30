###  ZoneId、ZonedDateTime
由于各个国家经度不同，所以各地区时间会划分为不同的时区

### 一、 ZoneId  时区Id
#### 1.格式
* 洲名/城市名，示例：`Asia/Shanghai`
* 国家名/城市名，示例：`US/Hawaii`

#### 2. API

| API                                               | 说明             | 
|---------------------------------------------------|----------------|
| `public static Set<String> getAvailableZoneIds()` | 获取Java中可用的所有时区 |
| `public static ZoneId systemDefault()`            | 获取系统默认时区       |
| `public static ZoneId of(String zoneId)`          | 获取一个指定时区       |


### 二、 ZonedDateTime  带时区的时间
#### 1. 创建 API
```
public static ZonedDateTime now()
public static ZonedDateTime now(ZoneId zone)

public static ZonedDateTime of(LocalDate date, LocalTime time, ZoneId zone)
public static ZonedDateTime of(LocalDateTime localDateTime, ZoneId zone)
public static ZonedDateTime of(int year, int month, int dayOfMonth,
            int hour, int minute, int second, int nanoOfSecond, ZoneId zone)
```

#### 2. 获取 API
```
int year = now.getYear();
int month = now.getMonthValue();
int dayOfMonth = now.getDayOfMonth();
int hour = now.getHour();
int minute = now.getMinute();
int second = now.getSecond();
int nano = now.getNano();

ZoneId zone = now.getZone();
......
```


#### 3. 计算 API
```
plusXXX()
minusXXX()
withXXX()
```
