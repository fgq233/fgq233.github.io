### 索引
* 索引是帮助数据库高效获取数据的一种数据结构（有序）
* MySQL 的索引是在`存储引擎层`实现的，不同的存储引擎有不同的索引结构


#### 1. 查看索引
```
show index from table_name; 
```

#### 2. 创建索引
```
# 语法
create [unique | fulltext] index idx_name on table_name(index_col_name, ...);

# 示例
create index idx_users_name on users(name);             // 单列索引
create index idx_users_age_sex on users(age, sex);      // 联合索引
create unique index idx_users_idcard on users(idcard);  // 唯一索引
```

 
#### 3. 删除索引
```
drop index index_name on table_name;

# 示例
drop index idx_users_name on users;
drop index idx_users_age_sex on users;
drop index idx_users_idcard on users;
```