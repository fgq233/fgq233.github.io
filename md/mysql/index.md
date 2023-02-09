### 索引
* 索引是帮助数据库高效获取数据的一种数据结构（有序）
* MySQL 的索引是在`存储引擎层`实现的，不同的存储引擎有不同的索引结构

### 一、索引语法
#### 1. 语法
```
查看索引
show index from table_name;

创建索引
create [unique | fulltext] index idx_name on table_name(index_col_name, ...);

删除索引
drop index index_name on table_name;
 
```

#### 2. 示例
```
show index from users;

create index idx_users_name on users(name);                     // 单列索引
create index idx_users_city on users(content(3));               // 前缀索引
create index idx_users_name_age_sex on users(name, age, sex);   // 联合索引
create unique index idx_users_idcard on users(idcard);          // 唯一索引

drop index idx_users_name on users;
```

### 二、索引提示
在SQL语句中加入索引提示
* `use index` 建议使用索引
* `ignore index` 忽略索引
* `force index `强制使用索引

```
select * from users use index(idx_users_name) where name = 'fgq';
select * from users ignore index(idx_users_name) where name = 'fgq';
select * from users force index(idx_users_name) where name = 'fgq';
```


### 三、索引使用原则
#### 1. 最左前缀原则（联合索引）
使用联合索引最好索引中的字段都用到
* 最左边的索引字段必须使用，不然索引全部失效
* 部分失效：如果跳过了某一列（非第一列），则后面的字段索引失效

```
-- 索引
create index idx_users_name_age_sex on users(name, age, sex);

-- 联合索引的3个索引全用上了
explain select * from users where name = 'fgq' and age = 18 and sex = '1';
-- 索引部分失效，name索引生效，sex索引失效
explain select * from users where name = 'fgq' and sex = '1';
-- 索引全部失效，全表扫描
explain select * from users where age = 18 and sex = '1';
```


#### 2. 范围查询（联合索引）
* 联合索引中，出现范围查询`>、<`，则范围查询右侧的列索引失效
* 优化：使用 `>=、<=`

```
-- sex索引失效
explain select * from users where name = 'fgq' and age > 18 and sex = '1';
-- 联合索引的3个索引全用上了
explain select * from users where name = 'fgq' and age >= 18 and sex = '1';
```

#### 3. MySQL评估
* 如果`MySQL`评估使用索引比不使用还慢，则放弃使用索引
  * `is null`  若空数据少，则使用索引，否则走全部扫描
  * `is not null` 若非空数据少，则使用索引，否则走全部扫描
  
* 多条件联合查询时，`MySQL`会评估哪个字段索引效率更高，会选择该索引完成本次查询


#### 4. 索引失效情况
* 在索引列上进行~~运算操作~~，则索引失效

* 索引列是字符串，若使用该列时~~不加引号~~，则索引失效

* 模糊查询
  * 尾部模糊，索引生效  like 'x%'
  * ~~头部模糊~~，索引失效  like '%x'     
  * ~~头尾模糊~~，索引失效  like '%x%'
  
* or
  * 两侧都有索引，索引才会生效
  * 只要有一侧没有索引，那么索引都会失效