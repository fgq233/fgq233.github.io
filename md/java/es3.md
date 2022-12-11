##  DSL语法对索引库、文档增删改查
* Index(索引库)：类似数据库中的表
* Mapping(映射)：是索引中对文档的约束，类似数据库的表结构 
* 要向 ES 中存储数据，就要先根据 Mapping 建立 Index


###  一. Mapping 常用属性
常见的mapping属性包括：

*  type：字段数据类型，常见的简单类型有：
   * 字符串：text（可分词的文本）、keyword（精确值，例如：品牌、国家、邮箱）
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



###  二. 索引库增删改查 
* ES中通过 Restful请求操作索引库、文档，请求内容用DSL语句来表示
    * 创建索引库：PUT /索引库名
    * 查询索引库：GET /索引库名
    * 删除索引库：DELETE /索引库名
    * 索引库添加字段：PUT /索引库名/_mapping

####  1. 创建索引库
* 请求方式：PUT
* 请求路径：/索引库名，可以自定义
* 请求参数：mapping映射

```
PUT /fgq
{
  "mappings": {
    "properties": {
      "all": {
        "type": "text",
        "analyzer": "ik_smart"
      },
      "info": {
        "type": "text",
        "analyzer": "ik_smart",
        "copy_to": "all"
      },
      "address": {
        "type": "text",
         "analyzer": "ik_smart",
         "copy_to": "all"
      },
      "name": {
        "properties": {
          "firstName": {
            "type": "keyword"
          },
           "lastName": {
            "type": "keyword"
          }
        }
      }
    }
  }
} 
```

####  2. 查看索引库
* 请求方式：GET
* 请求路径：/索引库名
* 请求参数：无

```
GET /fgq 
```


####  3. 删除索引库
* 请求方式：DELETE
* 请求路径：/索引库名
* 请求参数：无

```
DELETE /fgq
```


####  4. 修改索引库
* 索引库一旦创建，无法修改mapping已有的字段，但是但允许添加新的字段到mapping中
* 语法

```
PUT /索引库名/_mapping
{
  "properties": {
    "新字段名":{
      "type": "integer"
    }
  }
}
```



###  三. 文档增删改查 
* 有了索引库，就可以向库里插入文档，类似于数据库中向表中插入数据
  * 创建文档：POST /{索引库名}/_doc/文档id   { json文档 }
  * 查询文档：GET /{索引库名}/_doc/文档id
  * 删除文档：DELETE /{索引库名}/_doc/文档id
  * 修改文档：
    * 全量修改：PUT /{索引库名}/_doc/文档id { json文档 }
    * 增量修改：POST /{索引库名}/_update/文档id {"doc": {字段}}
    
####  1. 创建文档
```
POST /索引库名/_doc/文档id
{
    "字段1": "值1",
    "字段2": "值2",
    "字段3": {
        "子属性1": "值3",
        "子属性2": "值4"
    },
    // ... 略
}
```

####  2. 查看文档
```
GET /索引库名/_doc/文档id
```
    
####  3. 删除文档
```
DELETE /索引库名/_doc/文档id
```

####  4. 修改文档
* 全量修改：直接覆盖原来的文档

```
PUT /{索引库名}/_doc/文档id
{
    "字段1": "值1",
    "字段2": "值2",
    // ... 略
}
```

* 增量修改：修改文档中的部分字段

```
POST /{索引库名}/_update/文档id
{
    "doc": {
         "字段名": "新的值"
    }
}
```


###  四. 文档-动态映射 
* 当我们向ES中插入文档时，如果文档中字段没有对应的mapping，ES会帮助我们字段设置mapping，规则如下：

| JSON字段类型 | mapping属性值 |
| --------- | ---------- |
| 字符串     | 日期格式字符串：mapping为date类型      |
| 字符串     | 普通字符串：mapping为text类型，并添加keyword类型子字段 |
| 布尔值     | boolean    |
| 浮点数     | float   |
| 整数       | long      |
| 对象嵌套    | object，并添加properties        |
| 数组       | 由数组中的第一个非空类型决定        |
| 空值       | 忽略        |

* 类似于：向表里插入数据时，没有该字段，会自动创建字段并设置字段类型