### Oracle中复杂函数
### 一、 分区函数 partition by、排名函数
* `partition by`：给结果集分区，如果没有指定那么它把整个结果集作为一个分区，一般与排名函数一起使用
* 分区函数与`group by`区别在于它能返回一个分组中的多条记录，而`group by`一般只有一条反映统计值的数据
* 排名函数
  * 排序函数：`row_number()`
  * 跳跃排序函数：`rank()`
  * 连续排序函数：`dense_rank()`

```
select t.organ_name, t.jglx, row_number() over (order by t.cjsj)                     ROWNUM排序     from SYS_ORGAN t;
select t.organ_name, t.jglx, row_number() over (partition by t.jglx order by t.cjsj) 组内ROWNUM排序 from SYS_ORGAN t;
select t.organ_name, t.jglx, rank() over       (partition by t.jglx order by t.cjsj) 组内跳跃排序   from SYS_ORGAN t ;
select t.organ_name, t.jglx, dense_rank() over (partition by t.jglx order by t.cjsj) 组内连续排序   from SYS_ORGAN t;
```

### 二、 分区函数 partition by、排名函数
![](https://fgq233.github.io/imgs/oracle/listagg01.png)

#### 1. 基础用法
* listagg 函数主要用于将多行数据聚合为一行
* 语法： `listagg(expr, delimiter) within group (order by column)`
  * expr 要聚合的列或表达式
  * delimiter  拼接各元素的分隔符
  * column     指定聚合值的排序顺序

```
select listagg(t.dict_value, ',') within group(order by t.dict_key) from RABBIT_SYSTEM_DICT t;
```

![](https://fgq233.github.io/imgs/oracle/listagg02.png)


#### 2. 搭配 group by 使用(聚合)
```
select t.code, 
       listagg(t.dict_value, ',') within group(order by t.dict_key)
  from RABBIT_SYSTEM_DICT t
 group by t.code;
```

![](https://fgq233.github.io/imgs/oracle/listagg03.png)

#### 3. 搭配 over(partition by XXX) 使用(开窗)
```
select t.code,
       t.dict_key,
       listagg(t.dict_value, ',') within group(order by t.dict_key) over(partition by t.code)
  from RABBIT_SYSTEM_DICT t;
```

![](https://fgq233.github.io/imgs/oracle/listagg04.png)


聚合和开窗的区别：
* 聚合函数每组只会返回一条数据(按group by的字段)
* 开窗函数会返回原数据所有行，但会额外增加统计字段


### 三、 统计函数 + 分区函数
*  `count(AAA) over(partition by BBB)`  区内数量
*  `sum(AAA) over(partition by BBB)`    区内求和
*  `max(AAA) over(partition by BBB)`    区内最大值
*  `min(AAA) over(partition by BBB)`    区内最小值
*  `avg(AAA) over(partition by BBB)`    区内平均值

先分区，然后使用统计函数计算区内数据
