### Oracle中的null值

#### 1. 定义
* null值：未指定的、无效的、不可预知的值
* 包含null值的表达式永远为null，比如：(66 + null) 的结果就是null
* null值不等于任何值，也就是说：null值不能用 = 来判断，必须用 is null来判断 
* in的数据范围可以有null，not in不可以

#### 2.与MySQL区别
* `Oracle` 将空字符串视为 `null`，而`MySQL`不是
* 排序时，`Oracle`将`null`值视为最大值，这一点恰好和`MySQL`相反

```
order by cjsj desc nulls last  Oracle将null值放在最后
order by cjsj nulls first      Oracle将null值放在最前
```




