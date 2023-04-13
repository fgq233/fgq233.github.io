##  DSL语法 - 索引库、文档操作
* Index(索引库)：类似数据库中的表
* Mapping(映射)：是索引中对文档的约束，类似数据库的表结构

###  一. Mapping 常用属性
常见的mapping属性包括：

*  type：字段数据类型，常见的简单类型有：
    * 字符串：text（可分词的文本）、keyword（精确值，不支持分词）
    * 数值：long、integer、short、byte、double、float
    * 布尔：boolean
    * 日期：date
    * 对象：object
    * 地理坐标：geo_point，单个经纬度确定的一个点，如 "32.22, 122.33"
    * 地理坐标：geo_shape，多个geo_point形成的复杂图形
*  index：是否创建索引，默认为true，对于不参与搜索的值设为false
*  analyzer：使用哪种分词器
*  properties：该字段的子字段
*  copy_to：组合属性，其目的是将多字段的值 利用copy_to合并，提供给用户组合搜索



###  二. 索引库
* ES中通过 Restful请求操作索引库、文档，请求内容用DSL语句来表示
* 索引库一旦创建，无法修改mapping已有的字段，但是但允许添加新的字段到mapping中

####  1. 增删改查
```
# 创建索引库
PUT /索引库名
{
  "mappings": {
    "properties": {
      "address": {
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "city": {
        "type": "keyword"
      },
      "cjsj": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis"
      },
      "id": {
        "type": "long"
      }
    }
  }
}
 
# 查看索引库结构
GET /索引库名 

# 删除索引库
DELETE /索引库名

# 修改索引库
PUT /索引库名/_mapping
{
  "properties": {
    "新字段名": {
      "type": "integer"
    }
  }
}

# 查询所有索引库的名称、索引文件夹名称、大小
GET /_cat/indices
```


#### 2. 重建索引 _reindex
* `reindex` 会把文档数据从旧索引库复制到新索引库
* `wait_for_completion = false` 表示异步执行

```
POST /_reindex?wait_for_completion=false
{
  "source": {
    "index": "旧索引库名"
  },
  "dest": {
    "index": "新索引库名"
  }
}
```

如果程序中使用的是索引别名，则需要新增一个别名指向新索引库，删除旧别名

```
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "index-new",           // 新索引库名
        "alias": "index-alias"          // 索引库别名(保持和旧的一致，这样就对程序无影响)
      }
    },
    {
      "remove": {
        "index": "index-old",          // 旧索引库名
        "alias": "index-alias"         // 索引库别名
      }
    }
  ]
}
```



###  三. 文档
有了索引库，就可以向库里插入文档，类似于数据库中向表中插入数据

####  1. 增删改查
```
# 创建文档
POST /索引库名/_doc/文档id
{
  "字段1": "值1",
  "字段2": "值2",
  "字段3": {
    "子属性1": "值3",
    "子属性2": "值4"
  }
}

# 查看文档
GET /索引库名/_doc/文档id

# 删除文档
DELETE /索引库名/_doc/文档id

# 修改文档(全量修改，直接覆盖原来的文档)
PUT /{索引库名}/_doc/文档id
{
  "字段1": "值1",
  "字段2": "值2"
}

# 增量修改(全量修改，修改文档中的部分字段)
POST /{索引库名}/_update/文档id
{
  "doc": {
    "字段名": "新的值"
  }
}
```

  

###  四. 文档-动态映射
#### 1. 动态映射
当我们向ES中插入文档时，如果文档中字段没有对应的mapping，ES会帮助我们字段设置mapping，规则如下：

| JSON字段类型 | mapping属性值 |
| --------- | ---------- |
| 字符串     | 日期格式字符串：通过了date检测，则mapping为date类型  |
| 字符串     | 数字格式字符串：通过了numeric检测，则为Number      |
| 字符串     | 普通字符串：mapping为text类型，并添加keyword类型子字段 |
| 布尔值     | boolean    |
| 浮点数     | float   |
| 整数       | long      |
| 对象嵌套    | object，并添加properties        |
| 数组       | 由数组中的第一个非空类型决定        |
| 空值       | 忽略        |

类似于：向表里插入数据时，没有该字段，会自动创建字段并设置字段类型

#### 2. 手动控制动态映射
可在mappings 下通过 dynamic来手动控制，也可以为某个object类型字段定制
* true：默认值，动态添加字段
* false：新检测到的字段将被忽略，这些字段将不会添加到映射中、不会被索引、无法搜索，但仍会出现在返回点击的源字段中，索引库必须显式添加新字段
* strict：严格模式，如果碰到陌生字段，抛出异常

```
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "address": {
        "dynamic": "true",
        "type": "object"
      }
    }
  }
}
```

#### 3. date_detection 日期探测
* 默认会按照一定格式识别date，比如yyyy-MM-dd，但是如果某个未知字段先过来一个日期格式值，
  就会被自动dynamic mapping成date，后面再来一个普通字符串值，就会报错
* 可以通过 date_detection关闭日期自动探测，手动指定某个field为date类型

```
{
  "mappings": {
    "date_detection": false, 
    "properties": {
      "cjsj": {
        "type": "date"
      }
    }
  }
}
```

* 日期格式可以通过 dynamic_date_formats自定义日期格式语法

```
{
  "mappings": {
    "dynamic_date_formats": ["yyyy-MM-dd", "yyyy/MM/dd", "yyyyMMdd"], 
    "properties": {
      "cjsj": {
        "type": "date"
      }
    }
  }
}
```


#### 4. numeric_detection 数字探测
默认情况下，数字自动探测是关闭的，可以通过 numeric_detection 启用
