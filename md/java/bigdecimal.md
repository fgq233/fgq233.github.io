###  BigDecimal
用于解决浮点型运算时，出现的结果失真问题

#### 1. 对象创建
*  `public BigDecimal(double val)`   不使用，解决不了失真问题
*  `public BigDecimal(String val)`
*  `public static BigDecimal valueOf(double val)`

#### 2. 加减乘除
* 加 `public BigDecimal add(BigDecimal augend)`
* 减 `public BigDecimal subtract(BigDecimal subtrahend)`
* 乘 `public BigDecimal multiply(BigDecimal multiplicand)`
* 除 `public BigDecimal divide(BigDecimal divisor)`
* 除 `public BigDecimal divide(BigDecimal divisor, int scale, RoundingMode roundingMode) `
  * 用于除法除不尽的情况
  * `scale` 要保留几位小数
  * `RoundingMode` 舍入模式(向上进1、舍去、四舍五入)


```
BigDecimal v1 = BigDecimal.valueOf(0.5);
BigDecimal v2 = BigDecimal.valueOf(1.5);

BigDecimal add = v1.add(v2);
BigDecimal subtract = v1.subtract(v2);
BigDecimal multiply = v1.multiply(v2);
BigDecimal divide = v2.divide(v1);
BigDecimal divide2 = v1.divide(v2, 2, BigDecimal.ROUND_UP);
```

#### 3. 转 double
* `public double doubleValue()`

#### 4. 保留几位小数
```
BigDecimal b = new BigDecimal("12");
BigDecimal b2 = b.setScale(2, RoundingMode.HALF_UP);
```