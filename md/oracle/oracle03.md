### Oracle中的null值
* null值：未指定的、无效的、不可预知的值
* 包含null值的表达式永远为null，比如：(66 + null) 的结果就是null
* null值不等于任何值，也就是说：null值不能用 = 来判断，必须用 is null来判断 
* in的数据范围可以有null，not in不可以
* 排序时，将null值视为最大值，这一点恰好和MySQL相反，可以手动指定null值顺序
```angular2html
order by cjsj desc nulls last  将null值放在最后
order by cjsj nulls first      将null值放在最前
```



