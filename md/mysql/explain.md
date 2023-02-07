### explain 执行计划

#### 1. 语法
直接在`select`语句前加上关键字`explain`或`desc`


```
explain select * from user;
desc select * from user;
```

![explain](https://fgq233.github.io/imgs/mysql/explain.png)


#### 2. 返回字段含义
* `id`
* `select_type`
* `table`
* `partitions`
* `type`
* `possible_keys`
* `key`
* `key_len`
* `ref`
* `rows`
* `filtered`
* `Extra`