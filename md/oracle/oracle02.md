### 1、分页查询
Oracle分页查询主要用到伪列：ROWNUM

```
-- 方式一
SELECT *
  FROM (SELECT A.*, ROWNUM RN
          FROM (SELECT *
                  FROM TABLE_NAME
                 WHERE 1 = 1 -- 条件
                 ORDER BY CJSJ DESC -- 排序
                ) A
         WHERE ROWNUM <= 10)
 WHERE RN > 0
 
-- 方式二
SELECT *
  FROM (SELECT A.*, ROWNUM RN
          FROM (SELECT * FROM TABLE_NAME ORDER BY CJSJ) A)
 WHERE RN BETWEEN 1 AND 10;
```

### 2、with as 临时表
* 用于查询语句中：

```
单个
    with temp as
     (select ...)
    select ...
多个
    with temp1 as (select ...),
         temp2 as (select ...),
         temp3 as (select ...)
    select ...
```


* 用于插入语句中：

```
insert into tab_name
  (...)
  with TEMP as
   (select ...)            --with as 临时数据
   (select ... from ...);  --插入数据
```


### 3、合并查询
```
合并查询指使用集合操作符 UNION、UNION ALL、INTERSECT、MINUS 合并多个 select语句 的结果：
select 语句1
{UNION  |  UNION ALL |  INTERSECT |  MINUS}
select 语句2;
```

* 要保证合并的select语句查询的列个数、数据类型一致
* 如果查询的列包含表达式，必须为其指定列别名
* `UNION` (并集 + 去重 + 排序)
* `UNION ALL` (并集 + 不去重 + 不排序)
* `INTERSECT` (差集 + 以第一列结果排序)
* `MINUS` (差集 + 以第一列结果排序)

