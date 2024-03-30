###  Instant

#### 1. 概念
Instant 对象可以拿到当前的时间，该时间由两部分组成
* 从 `1970-01-01 00:00:00` 开始走到此刻的**总秒数**
* 不够 1 秒的**纳秒数**

#### 2. 创建、获取
```
// 获取当前时间的 Instant 对象
Instant now = Instant.now();

//  从 1970-01-01 00:00:00 开始走到此刻的总秒数
long epochSecond = now.getEpochSecond();

// 不够 1 秒的纳秒数
int nano = now.getNano();
```


#### 3. 计算 API
```
plusXXX()
minusXXX()
withXXX()
```

#### 4. 判断  isBefore()、isAfter()、equals()
