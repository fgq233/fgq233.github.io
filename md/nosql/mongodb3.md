### MongoDB 常用命令
### 一.  数据库操作
使用 `mongo` 命令连接 `MongoDB`

#### 1.  创建和选择数据库
```
use 数据库名称
```

* 如果数据库不存在则自动创建，存在则切换到该数据库  
* `MongoDB` 存储分为2部分：磁盘、内存，刚创建数据库时在内存中，当数据库存在集合时，才会持久化到磁盘
* `MongoDB` 中默认的数据库为 `test`，如果没有选择数据库，集合将存放在 `test` 数据库中


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



### 二.  集合操作
类似关系型数据库中的表

#### 1.  集合的创建

```
# 显式创建，name为要创建的集合名称
db.createCollection(name)
```

* 示例：db.createCollection("blog")
* 隐式创建：当向一个集合中插入一个文档的时候，如果集合不存在，则会自动创建集合


#### 2.  查看当前库中的集合
```
show collections
或
show tables
```


#### 3.  集合的删除
```
db.集合名称.drop()
```

如果成功删除选定集合，则 drop() 方法返回 true，否则返回 false




### 三.  文档操作
* 类似关系型数据库中的 row
* 文档存储在集合中，数据都是 `BSON` 格式

#### 1.  文档的创建
```
# 单个插入
db.集合名称.insert(BSON数据)
db.集合名称.save(BSON数据)

# 批量插入
db.集合名称.insertMany(BSON数组数据)

# 批量插入，插入数据较多容易出现失败，可以使用try catch进行异常捕捉
try {
  db.集合名称.insertMany(BSON数组数据)
} catch (e) {
  print (e);
}

# 示例
db.blog.insert({"content":"范老师帅的一批","userid":"1001", "starnum":NumberInt(10), "createtime":new Date()})
db.blog.insertMany([
    {"content":"范老师帅的一批","userid":"1001", "starnum":NumberInt(10), "createtime":new Date()},
    {"content":"今天天气好好啊","userid":"1002", "starnum":NumberInt(30), "createtime":new Date()},
    {"content":"女神下面给你吃","userid":"1003", "starnum":NumberInt(40), "createtime":new Date()}
])
```


* MongoDB区分类型和大小写
* mongo中的数字默认情况下是double类型，如果要存整型，必须使用函数`NumberInt`(整型数字)，否则取出来就有问题了
* 插入当前日期使用 `new Date()`
* 插入的数据可以指定 `_id`，也可以不指定，没有指定的话会自动生成主键值
* 如果某字段没值，可以赋值为null，或不写该字段


#### 2.  文档的更新
```
db.集合名称.update(query, update)
或
db.集合名称.update(
    query,
    update,
    {
        upsert: <boolean>,
        multi: <boolean>,
        writeConcern: <document>,
        collation: <document>,
        arrayFilters: [ <filterdocument1>, ... ],
        hint: <document|string> 
    }
)


# 示例
# 覆盖修改，update内容整个替换原内容
db.blog.update({userid: "1002"}, {starnum: NumberInt(666)})

# 局部修改，只修改update中存在的字段
db.blog.update({userid:"1003"},{$set:{starnum:NumberInt(888)}})

# 批量修改
db.blog.update({userid:"1001"},{$set:{starnum:NumberInt(888)}},{multi:true})

# inc 列值增长
db.blog.update({userid:"1003"},{$inc:{starnum:NumberInt(12)}})
```

* query：查询条件
* update：更新内容
* options
    * upsert：boolean值，不存在匹配项则插入，默认false
    * multi：boolean值，若设置为true，则更新符合查询条件的所有文档，默认false，只更新第一条符合查询条件的
    * writeConcern：document，表示写问题的文档，抛出异常的级别
    * collation：document，指定要用于操作的校对规则
    * arrayFilters：array，一个筛选文档数组，用于确定要为数组字段上的更新操作修改哪些数组元素
    * hint：document 或 string，可选，用于支持查询谓词的索引的文档或字符串



#### 3.  文档的删除
```
# 单个删除
db.集合名称.remove(query条件)
# 全部删除
db.集合名称.remove({})

# 示例
db.blog.remove({userid:"1001"})
db.blog.remove({})
```


 



#### 4.  文档的查询
```
# 条件查询
db.集合名称.find(<query>, [projection])

# 条件查询，返回符合条件的第一条数据
db.集合名称.findOne(<query>, [projection])

# 查询总数
db.集合名称.count(<query>, options)

# 正则查询，MongoDB的模糊查询是通过正则表达式的方式实现的
db.集合名称.find({字段:/正则表达式/})

# 包含查询 in、nin
db.集合名称.find({userid:{$in:["1003","1004"]}})
db.集合名称.find({userid:{$nin:["1003","1004"]}})


# 比较查询
db.集合名称.find({ "field" : { $gt: value }})     // 大于: field > value
db.集合名称.find({ "field" : { $lt: value }})    //  小于: field < value
db.集合名称.find({ "field" : { $gte: value }})   //  大于等于: field >= value
db.集合名称.find({ "field" : { $lte: value }})   //  小于等于: field <= value
db.集合名称.find({ "field" : { $ne: value }})    //  不等于: field != value

# 多个条件组合查询 and、or
db.集合名称.find({$and:[{},{}]})
db.集合名称.find({$or:[{},{}]})
```


* query：查询条件，省略则是查询集合中所有文档
* projection：设定要查询的字段，省略则是查询集合中所有字段
* options：可选项


```
# 查询集合中所有文档
db.blog.find()
db.blog.find({})

# 条件查询
db.blog.find({userid:'1001'})
db.blog.findOne({userid:'1001'})

# 条件查询，只查询部分字段(默认会返回_id，设置为0则去除)
db.blog.find({},{userid:1,starnum:1,_id:0})
db.blog.find({userid:"1001"},{userid:1,starnum:1})
db.blog.find({userid:"1001"},{userid:1,starnum:1,_id:0})

# 查询总数
db.blog.count()
db.blog.count({userid:"1003"})

# 正则查询：内容包含“女神”的文档
db.blog.find({content:/女神/})
# 正则查询：内容以“女神”开头的文档
db.blog.find({content:/^女神/})

# 比较查询
db.blog.find({starnum:{$gt:NumberInt(20)}})

# 多个条件查询 and、or
db.blog.find({$and:[{starnum:{$gte:NumberInt(10)}},{starnum:{$lt:NumberInt(30)}}]})
db.blog.find({$or:[ {userid:"1003"} ,{starnum:{$gt:20}}]})
```



#### 5.  查询分页

```
# 查询前n条数据
db.集合名称.find().limit(NUMBER))

# 查询时跳过前n条数据
db.集合名称.find().skip(NUMBER))

# 组合后可以形成分页查询的效果
db.集合名称.find().skip(NUMBER).limit(NUMBER)

# 示例
db.blog.find().skip(2).limit(1)
```


#### 6.  查询结果排序
```
db.集合名称.find().sort(排序方式)

# 示例
db.blog.find().sort({userid:-1})
db.blog.find().sort({userid:-1,starnum:1})
```

* `sort()` 方法可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，1 为升序，而 -1 为降序
* `skip(), limilt(), sort()`都存在，执行的顺序是先 `sort()`, 然后是 `skip()`，最后是 `limit()`，
和命令编写顺序无关





### 四.  索引操作
* MongoDB 查询支持索引，如果没有索引，MongoDB会执行全集合扫描，即扫描集合中的每个文档，查询效率低
* MongoDB索引使用B树数据结构（确切的说是B-Tree，MySQL是B+Tree）

索引类型
* 单字段索引：在文档的单个字段上创建升序/降序索引
* 复合索引：在文档的多个字段上创建升序/降序索引，复合索引中列出的字段顺序具有重要意义
* 其他类型：地理空间索引、文本索引、哈希索引


#### 1.  索引的查看
在创建集合的过程中，默认会在`_id` 字段上创建一个唯一的索引，索引名称为`_id_`

```
db.集合名称.getIndexes()

结果：
[ { "v" : 2, "key" : { "_id" : 1 }, "name" : "_id_" } ]
```

* key：索引的字段、排序方式
* name：索引名称


#### 2.  索引的创建
```
db.集合名称.createIndex(keys, options)


示例：
# 单字段升序索引
db.blog.createIndex({userid:1})

# 复合索引，userid升序、starnum降序
db.blog.createIndex({userid:1,starnum:-1})
```

* keys：设置要添加索引的字段、升序还是降序
* options：可选项
    * background：Boolean值，true表示建索引过程会阻塞其它数据库操作，默认值为false
    * unique：Boolean值，值是否唯一，默认值为false
    * name：String值，索引名称，如果未指定，MongoDB会自动生成
    * sparse：Boolean值，对文档中不存在的字段数据不启用索引，默认值为false
    * expireAfterSeconds：integer值，指定一个以秒为单位的数值，完成 TTL设定，设定集合的生存时间
    * v：integer值，索引的版本号
    * weights：document，索引权重值，数值在 1 到 99999 之间，表示该索引相对于其他索引字段的得分权重
                          

#### 3.  索引的删除
```
# 单个索引删除，index可以是索引name、也可以是创建时候的keys
db.集合名称.dropIndex(index)

# 删除所有索引(不包括_id)
db.集合名称.dropIndexes()

示例：
db.blog.dropIndex("userid_1")
db.blog.dropIndex({userid:1,starnum:-1})
```

 
 
### 五.  执行计划
`MongoDB`支持使用执行计划 Explain Plan 分析查询性能

#### 1.  语法
```
db.集合名称.find(query,options).explain(options)

示例：
db.blog.find({userid:"1003"}).explain()
结果：
{
        "explainVersion" : "1",
        "queryPlanner" : {
                "...
                "winningPlan" : {
                        "stage" : "COLLSCAN",
                        "filter" : {
                                "userid" : {
                                        "$eq" : "1003"
                                }
                        },
                        "direction" : "forward"
                },
                "rejectedPlans" : [ ]
        },
        ...
}
```

关键点看： "stage" 
* COLLSCAN 表示全集合扫描，未使用到索引
* IXSCAN：基于索引的扫描
 
 
#### 2.  涵盖的查询
当查询条件和查询的投影仅包含索引字段时，MongoDB直接从索引返回结果，而不扫描任何文档或将文档带入内存， 
非常高效