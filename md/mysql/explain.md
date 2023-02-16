### explain 执行计划

#### 1. 语法
直接在`select`语句前加上关键字`explain`或`desc`


```
explain select * from user;
desc select * from user;
```

![explain](https://fgq233.github.io/imgs/mysql/explain.png)


#### 2. 执行计划返回字段
* `table` 表名
   
* `id`   表示查询中执行select子句或者操作表的顺序
  * 多表查询中，id相同，执行顺序从上到下
  * 多表查询中，id不同，值越大，越先执行
    
* `select_type` 查询类型，用于区分普通查询、联合查询、子查询等复杂的查询
  * `simple` 简单查询，没有表连接、子查询
  * `primary` 主查询，最外层的查询（只有一个）
  * `subquery` 子查询
  * `derived`  union查询中第一个查询语句
  * `union`  union查询中第二个或后面的查询语句都属于union
  * `union result`  从union表查询的select
  
* **type** 访问类型，表示MySQL决定如何查找表中的行，性能从高到低如下
  * `system` 用于存储引擎是`myisam`和`memory`的表，且表中只有一行数据或者是空表
  * `const`  使用主键、唯一索引扫描 
  * `eq_ref`  类似ref，不过使用的是唯一索引
  * `ref`  非唯一索引扫描
  * `ref_or_null`  类似`ref`，但是会额外搜索包含`null`值的行
  * `index_merge`  表示查询使用了两个以上的索引，常见and，or的条件使用了不同的索引
  * `index_subquery`  用于in形式子查询使用到了辅助索引或者in常数列表，子查询可能返回重复值
  * `range` 索引范围扫描，常见于`>、<、is null、between、in、like`等运算符的查询中
  * `index` 用到了索引，但是扫描了整个索引树，性能也不高（**需优化**）
  * `all` 全表扫描，性能最差（**需优化**）
  
* **possible_keys** 显示可能应用在这张表上的索引，一个或多个

* **key**  实际用到的索引，如果为null，则没有使用到索引
  
* `key_len` 索引长度

* `rows` 大致估算出找到所需的记录所需要读取的行数

* `filtered` 返回结果的行数占需读取行数的百分比，值越大越好

* `partitions` 匹配的分区

* `Extra` 额外信息

