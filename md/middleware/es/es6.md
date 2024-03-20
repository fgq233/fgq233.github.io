###  RestHighLevelClient 简单查询、复合查询
* 准备查询 request
* 准备查询条件，核心是使用 QueryBuilders 构造查询参数
* 发送请求，得到响应
* 解析响应结果

###  一、简单查询
####  1. match_all
```
SearchRequest request = new SearchRequest(INDEX_NAME);
request.source().query(QueryBuilders.matchAllQuery());
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
```

准备request、发送请求这二个步骤一模一样，下面就省略不写了



####  2. 全文检索：match_query、multi_match_query
```
request.source().query(QueryBuilders.matchQuery("name", "银湖路大润发"));  

request.source().query(QueryBuilders.multiMatchQuery("银湖路大润发", "name", "address", "brand"));
```



####  3. 精准查询：term、range
```
request.source().query(QueryBuilders.termQuery("city", "上海"));  

request.source().query(QueryBuilders.rangeQuery("price").lte(250));  
```


####  4. 地理坐标查询：geo_distance
```
request.source().query(QueryBuilders.geoDistanceQuery("location")
        .point(40.2d, 120.3d)
        .distance(10, DistanceUnit.KILOMETERS));
```




### 二、复合查询
####  1. 布尔查询： bool
```
// 准备请求参数
BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
boolQuery.must(QueryBuilders.termQuery("city", "杭州"));
boolQuery.filter(QueryBuilders.rangeQuery("price").lte(250));

request.source().query(boolQuery);
```


####  2. 算分函数查询  function score
```
// 原始查询
BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
boolQuery.must(QueryBuilders.termQuery("city", "杭州"));
boolQuery.filter(QueryBuilders.rangeQuery("price").lte(250));

// 算分函数查询
FunctionScoreQueryBuilder builder = QueryBuilders.functionScoreQuery(
        boolQuery, // 原始查询boolQuery
        new FunctionScoreQueryBuilder.FilterFunctionBuilder[]{         // function数组
                new FunctionScoreQueryBuilder.FilterFunctionBuilder(
                        QueryBuilders.termQuery("city", "上海"),        // 过滤条件
                        ScoreFunctionBuilders.weightFactorFunction(10)  // 算分函数
                )
        }
);
request.source().query(builder);
```




### 三、搜索结果处理：排序、分页、高亮
```
// 在准备请求参数之后处理
request.source().query(QueryBuilders.matchQuery("name", "银湖路大润发"));  

// 排序sort
request.source().sort("price", SortOrder.ASC);
// 地理位置排序sort
request.source().sort(SortBuilders
        .geoDistanceSort("location", new GeoPoint("40, 120"))
        .order(SortOrder.ASC)
        .unit(DistanceUnit.KILOMETERS);


// 分页 from、size
request.source().from((66 - 1) * 10).size(10);

// 高亮1 
request.source().highlighter(new HighlightBuilder().field("name"));
// 高亮2  可设置与查询字段不匹配
request.source().highlighter(new HighlightBuilder().field("name").requireFieldMatch(false));
```




### 四、解析响应结果
####  1. 响应结果示例
查询返回的结果是 SearchResponse，其数据格式如下

```
{
  "took" : 51,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 199,
      "relation" : "eq"
    },
    "max_score" : 0.016037453,
    "hits" : [
      {
        "_index" : "hotel",
        "_type" : "_doc",
        "_id" : "666",
        "_score" : 0.016037453,
        "_source" : {
          "address" : "宝安南路2333号",
          "brand" : "希尔顿",
          "city" : "上海",
          "id" : 666,
          "location" : "22.537247, 114.111182",
          "name" : "希尔顿酒店",
          "price" : 442,
          "score" : 47,
          "starName" : "五钻"
        },
        "highlight" : {
          "name" : [
            "<em>希尔顿</em>酒店"
          ]
        }
      }
    ]
  }
}
```



####  2. 解析响应结果
```
SearchHits searchHits = response.getHits();
// 获取总条数
long total = searchHits.getTotalHits().value;

// 获取文档数组
SearchHit[] hits = searchHits.getHits();

// 遍历文档数组
for (SearchHit hit : hits) {
    // 获取文档数据
    String json = hit.getSourceAsString();
    // Map<String, Object> map = hit.getSourceAsMap();  文档数据还可以解析为Map
    // 文档数据反序列化
    Hotel hotel = JSON.parseObject(json, Hotel.class);
    
    // 处理高亮结果
    // 获取高亮map
    Map<String, HighlightField> map = hit.getHighlightFields();
    if (CollectionUtils.isEmpty(map)) {
        // 根据字段名，获取某个字段高亮结果
        HighlightField highlightField = map.get("name");
        // 获取高亮结果字符串数组中的第1个元素
        String hName = highlightField.getFragments()[0].toString();
        // 把高亮结果放到实体
        hotel.setName(hName);
    }
}
```
