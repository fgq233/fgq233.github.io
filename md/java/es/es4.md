###  DSL语法 - 简单查询、复合查询
* Elasticsearch提供了基于JSON的DSL语法来定义查询
* [DSL官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)


###  一. DSL 查询语法
```
GET /索引库名/_search
{
  "query": {},          // 搜索，会给文档评分 _score
  "post_filter":{},     // 过滤，不会给文档评分，效率 > query，可以与 query 共存
  "sort": {},           
  "from": 0,
  "size": 10,
  "highlight": {}
}
```

###  二. 简单查询
####  1. match_all 查询所有
```
GET /索引库名/_search
{
  "query": {
    "match_all": {}
  }
}
```



####  2. 全文检索查询
* 全文检索查询：利用分词器**对用户输入内容分词得到词条**，根据词条去倒排索引库中匹配得到文档id,根据文档id找到文档
  * `match` 单字段查询
  * `multi_match` 多字段查询，任意一个字段符合条件就算符合查询条件
* 注意：mapping 映射中 index为 false，不参与索引搜索的值不支持
  * mapping 映射中 index为 false，不参与索引搜索的值不支持
  * 搜索字段越多，对查询性能影响越大，建议采用copy_to 单字段查询的方式

```
GET /hotel/_search
{
  "query": {
    "match": {
      "name": "银湖路大润发"
    }
  }
}

GET /hotel/_search
{
  "query": {
    "multi_match": {
      "query": "银湖路大润发",
      "fields": ["name", "address"]
    }
  }
}
```



####  3. 精准查询
* 精确查询：根据精确词条值查找数据，一般是查找keyword、数值、日期、boolean等类型字段，**不会对搜索条件分词**
  * `term` 根据词条精确值查询
  * `range` 根据值的范围查询
* 注意：不支持分词，用户输入的内容跟字段值完全匹配时才认为符合条件，如果输入的内容过多，反而搜索不到数据

```
GET /hotel/_search
{
  "query": {
    "term": {
       "city": {
         "value": "上海"
       }
    }
  }
}

GET /hotel/_search
{
  "query": {
    "range": {
       "price": {
         "lte": 1000
       }
    }
  }
}
```


####  4. 地理坐标查询（经纬度查询）
* 地理（geo）查询：根据经纬度查询
  * `geo_distance` 圆形范围，需要定义圆心、半径，查询到中心点小于某个距离值的所有文档
  * `geo_bounding_box` 矩形范围，需要定义左上、右下，查询坐标在某个矩形范围的所有文档

```
GET /hotel/_search
{
  "query": {
    "geo_bounding_box": {
      "location": {
        "top_left": {
          "lat": 31.1,
          "lon": 121.5
        },
        "bottom_right": {
          "lat": 30.9,
          "lon": 121.7
        }
      }
    }
  }
}

GET /hotel/_search
{
  "query": {
    "geo_distance": {
      "distance": "2km",
      "location": [121.5,31.21]   
    }
  }
}
```



###  三. 复合查询
将简单查询组合起来，实现更复杂的搜索逻辑
* `bool`：布尔查询，利用逻辑关系组合多个其它的查询
* `fuction score`：算分函数查询，可以控制文档相关性算分，控制文档排名

#### 1. 布尔查询  bool
布尔查询是一个或多个查询子句的组合，每一个子句就是一个**子查询**，组合方式有：

* `must`：必须匹配每个子查询，类似**与**
* `should`：选择性匹配子查询，类似**或**
* `must_not`：必须不匹配，**不参与算分**，类似**非**
* `filter`：必须匹配，**不参与算分**

```
GET /hotel/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "city": "上海"
          }
        }
      ],
      "should": [
        {
          "term": {
            "brand": "万达"
          }
        },
        {
          "term": {
            "brand": "希尔顿"
          }
        }
      ],
      "must_not": [
        {
          "range": {
            "price": {
              "lte": 500
            }
          }
        }
      ],
      "filter": [
        {
          "range": {
            "score": {
              "gte": 45
            }
          }
        }
      ]
    }
  }
}
```



####  2. 算分函数查询  function score
* match 查询时，文档结果会根据与搜索词条的关联度打分（`_score`），返回结果时按照分值降序排列
* ES中打分算法，早期使用的是TF-IDF算法，5.1版本后，将算法改进为BM25算法

`function score` 查询中包含4部分内容：

* 原始查询条件：query部分，基于这个条件搜索文档，并且基于BM25算法给文档打分，原始算分（`query score`）
* 过滤条件：`filter`部分，符合该条件的文档才会重新算分
* 算分函数：符合filter条件的文档要根据这个函数做运算，得到的函数算分（`function score`），有四种函数
  * `weight` 结果是常量值
  * `field_value_factor` 以文档中的某个字段值作为结果
  * `random_score` 随机数作为结果
  * `script_score` 自定义算分函数算法
* 运算模式：包括：
  * `multiply` 相乘
  * `replace` 用function score替换query score
  * 其它，例如：`sum、avg、max、min`

![function score查询语法](https://fgq233.github.io/imgs/java/es1.png)

运行流程如下：

* 1）根据**原始条件**查询搜索文档，并且计算相关性算分，称为**原始算分**（query score）
* 2）根据**过滤条件**，过滤文档
* 3）符合**过滤条件**的文档，基于**算分函数**运算，得到**函数算分**（function score）
* 4）将**原始算分**（query score）和**函数算分**（function score）基于**运算模式**做运算，得到最终结果

 


###  四. 搜索结果处理
#### 1. 排序
* ES 默认是根据相关度算分（_score）来排序，但是也支持自定义方式排序
  * 排序字段类型：keyword类型、数值类型、地理坐标类型、日期类型等
  * 排序条件：字段数组
  * 排序方式：asc、desc
* 一旦排序，就不会进行原始算分

```
GET /hotel/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "price": "desc"
    }
  ]
}
```


#### 2. 分页
* ES 默认情况下只返回 `top10` 的数据，要查询更多数据就需要修改分页参数，通过修改`from、size`参数来控制分页结果：
  * `from`：从第几个文档开始，默认为0
  * `size`：总共查询几个文档
* 类似于mysql中的`limit ?, ?`
* 深度分页问题
  * 当查询分页深度较大时，汇总数据过多，对内存和CPU会产生非常大的压力， 因此 ES 默认禁止`from + size` 超过10000的请求
  * 针对深度分页，ES提供了两种解决方案：
    * `search after`：分页时需要排序，原理是从上一次的排序值开始，查询下一页数据，官方推荐
    * `scroll`：原理将排序后的文档id形成快照，保存在内存，官方不推荐

```
GET /hotel/_search
{
  "query": {
    "match_all": {}
  },
  "from": 0,
  "size": 3
}
```


#### 3. 高亮
* 高亮显示的实现分为两步：
  * 给文档中的所有关键字都添加一个标签，ES默认加的是`<em>`标签
  * 前端 `html` 页面中给 `<em>` 标签编写CSS样式
* 注意
  * 必须使用 `query`,而不是 `post_filter`
  * 高亮是对搜索的关键字高亮，因此搜索条件必须带有关键字，而不能是范围这样的查询
  * 默认情况下，**高亮的字段，必须与搜索指定的字段一致**，否则无法高亮
  * 如果要对非搜索字段高亮，则需要添加一个属性：`required_field_match=false`

``` 
GET /hotel/_search
{
  "query": {           
    "match": {
      "name": "外滩"
    }
  },
  "highlight": {      
    "fields": {                 
      "name": {                  // 指定要高亮的字段
        "pre_tags": "<em>",      // 高亮字段的前置标签
        "post_tags": "</em>"     // 高亮字段的后置标签
      }
    }
  }
}
```

 