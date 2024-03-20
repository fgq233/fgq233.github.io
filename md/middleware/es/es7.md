###  聚合查询
[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)

### 一. 分类

ES 聚合常见的有三类：
* 桶（Bucket）聚合：用来对文档做分组，并统计每组数量，类似于mysql中group by按照字段分组，然后统计每组数量
    - TermAggregation：按照文档字段值分组
    - Date Histogram：按照日期阶梯分组，例如一周为一组，或者一月为一组

- 度量（Metric）聚合：对文档数据做计算，得到下列统计值
    - avg：求平均值
    - max：求最大值
    - min：求最小值
    - stats：同时求avg、max、min、sum

- 管道（pipeline）聚合：基于其它聚合结果再做聚合



> 注意：参加聚合的字段必须是keyword、日期、数值、布尔类型


### 二. 桶（Bucket）聚合
#### 1. DSL 语法
*  聚合三要素：聚合名称、聚合类型、聚合字段
*  aggs代表聚合，与query同级，此时query的作用是限定聚合的文档范围

```
GET /hotel/_search
{
  "size": 0,
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand"
      }
    }
  }
}
```



#### 2. 聚合可配置的属性
默认Bucket聚合会统计Bucket内的文档数量，记为_count，并且按照_count降序排序

* size： 聚合属性，只取前n条
* order：聚合属性，排序

```
GET /hotel/_search
{
  "size": 0,
  "query": {
    "range": {
      "price": {
        "lte": 200
      }
    }
  },
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "order": {
          "_count": "asc"
        },
        "size": 3
      }
    }
  }
}
```

#### 3. 结果
```
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 17,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brandAgg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 13,
      "buckets" : [
        {
          "key" : "7天酒店",
          "doc_count" : 1
        },
        {
          "key" : "汉庭",
          "doc_count" : 1
        },
        {
          "key" : "速8",
          "doc_count" : 2
        }
      ]
    }
  }
}
```


#### 4. RestHighLevelClient 实现聚合查询
```
// 1.准备请求
SearchRequest request = new SearchRequest("hotel");
// 2.请求参数、聚合
request.source().size(0);
request.source().aggregation(AggregationBuilders.terms("brandAgg").field("brand").size(2));
// 3.发出请求
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
// 4.解析结果
Aggregations aggregations = response.getAggregations();

// 4.1.根据聚合名称，获取聚合结果
Terms brandAgg = aggregations.get("brandAgg");
// 4.2.获取buckets
List<? extends Terms.Bucket> buckets = brandAgg.getBuckets();
// 4.3.遍历
for (Terms.Bucket bucket : buckets) {
    String brandName = bucket.getKeyAsString();
    long docCount = bucket.getDocCount();
}
```


### 二. 度量（Metric）聚合
* 桶聚合后形成了一个个桶，对桶内数据的某个字段计算min、max、avg值，就是度量（Metric）聚合
* aggs 内部定义 aggs，也就是分组后对每组分别计算

#### 1. DSL 语法
聚合三要素：聚合名称、聚合类型(avg、max、min、stats)、聚合字段

```
GET /hotel/_search
{
  "size": 0,
  "aggs": {
    "brandAgg": {
      "terms": {
        "field": "brand",
        "size": 2
      },
      "aggs": {
        "scoreAgg": {
          "stats": {
            "field": "score"
          }
        }
      }
    }
  }
}
```

#### 2. 结果
``` 
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 201,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "brandAgg" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 141,
      "buckets" : [
        {
          "key" : "7天酒店",
          "doc_count" : 30,
          "scoreAgg" : {
            "count" : 30,
            "min" : 35.0,
            "max" : 43.0,
            "avg" : 37.86666666666667,
            "sum" : 1136.0
          }
        },
        {
          "key" : "如家",
          "doc_count" : 30,
          "scoreAgg" : {
            "count" : 30,
            "min" : 43.0,
            "max" : 47.0,
            "avg" : 44.833333333333336,
            "sum" : 1345.0
          }
        }
      ]
    }
  }
}
```

