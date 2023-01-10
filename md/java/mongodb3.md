### MongoDB 常用命令

* 测试数据结构参考：

| 字段名称 | 字段类型| 说明|
| ------ | ----------| ---- |
| _id | ObjectId 或 String| MongoDB主键 |
| content | String| 内容 |
| userid | String| 用户id |
| starnum | Int32| 点赞数 |
| createtime | Date| 创建时间 |


### 一.  数据库
#### 1.  创建和选择数据库
```
use 数据库名称
```

* 如果数据库不存在则自动创建，存在则切换到该数据库  
* 注意：`MongoDB` 存储分为2部分：磁盘、内存，刚创建数据库时在内存中，当数据库存在集合时，才会持久化到磁盘
* MongoDB 中默认的数据库为 `test`，如果没有选择数据库，集合将存放在 `test` 数据库中


#### 2.  查看
```
# 查看所有数据库(权限范围内的)
show dbs 或 show databases

# 查看正在使用的数据库
db
```


#### 3.  数据库的删除
```
db.dropDatabase()
```

