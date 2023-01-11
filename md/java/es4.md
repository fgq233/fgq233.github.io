###  RestClient对索引库、文档增删改查
###  一. RestClient 概述
* ES官方提供了不同语言的客户端，用来操作ES，这些客户端的本质就是组装DSL语句，通过http请求发送给ES

* [RestClient](https://www.elastic.co/guide/en/elasticsearch/client/index.html)

* 8.X以下的Java Rest Client包括两种：
    * Java Low Level Rest Client
    * Java High Level Rest Client

* 8.X以上使用新版的Java Api Client，采用链式调用和lambda结合


###  二. RestClient使用步骤，基于7.12.1
####  1. 引入依赖
```
 <dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <elasticsearch.version>7.12.1</elasticsearch.version>
</dependency>

8.X 依赖的是 co.elastic.clients
```

####  2. 连接
```
# 无密码模式
RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
        HttpHost.create("http://127.0.0.1:9200")
));

# xpack 安全模式
RestClientBuilder builder = RestClient.builder(HttpHost.create("http://127.0.0.1:9200"));
CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials("elastic", "elastic666"));
builder.setHttpClientConfigCallback((HttpAsyncClientBuilder httpAsyncClientBuilder) ->
        httpAsyncClientBuilder.setDefaultCredentialsProvider(credentialsProvider));
RestHighLevelClient client =  new RestHighLevelClient(builder);
```

####  3. 业务代码
####  4. 关闭RestHighLevelClient
```
client.close();
```


###  三. RestClient操作索引库  
步骤：准备 XXXRequest，使用 client.indices() 发送请求

####  1. 增 CreateIndexRequest
```
CreateIndexRequest request = new CreateIndexRequest(INDEX_NAME);
// 准备请求参数：映射Mapping
request.source(MAPPING_TEMPLATE, XContentType.JSON);
client.indices().create(request, RequestOptions.DEFAULT);
```

####  2. 查 GetIndexRequest
```
GetIndexRequest request = new GetIndexRequest(INDEX_NAME);

boolean isExist = client.indices().exists(request, RequestOptions.DEFAULT);
System.out.println(isExist ? "存在" : "不存在");

GetIndexResponse response = client.indices().get(request, RequestOptions.DEFAULT);
System.out.println(JSON.toJSONString(response.getMappings()));
```


####  3. 删  DeleteIndexRequest
```
DeleteIndexRequest request = new DeleteIndexRequest(INDEX_NAME);
client.indices().delete(request, RequestOptions.DEFAULT);
```


###  四. RestClient操作文档
步骤：准备请求数据 + XXXRequest，使用client直接调用方法发送请求

####  1. 增  client.index(..)
```
Hotel hotel = new Hotel(666L, "fgq", "China");
String json = JSON.toJSONString(hotel);
IndexRequest request = new IndexRequest(INDEX_NAME).id(hotel.getId().toString());
request.source(json, XContentType.JSON);
client.index(request, RequestOptions.DEFAULT);
```

批量新增

```
BulkRequest request = new BulkRequest();

Hotel hotel1 = new Hotel(777L, "fgq1", "America");
Hotel hotel2 = new Hotel(888L, "fgq2", "Singapore");
request.add(new IndexRequest(INDEX_NAME).id(hotel1.getId().toString()).source(JSON.toJSONString(hotel1), XContentType.JSON));
request.add(new IndexRequest(INDEX_NAME).id(hotel2.getId().toString()).source(JSON.toJSONString(hotel2), XContentType.JSON));
client.bulk(request, RequestOptions.DEFAULT);
```

####  2. 查 client.get(..)
```
GetRequest request = new GetRequest(INDEX_NAME, "666");
GetResponse response = client.get(request, RequestOptions.DEFAULT);
String json = response.getSourceAsString();
Hotel hotel = JSON.parseObject(json, Hotel.class);
```


####  3. 删  client.delete(..)
```
 DeleteRequest request = new DeleteRequest(INDEX_NAME, "666");
 client.delete(request, RequestOptions.DEFAULT);
```

批量删除参考 BulkRequest批量新增

####  4. 改  client.update(..)
```
UpdateRequest request = new UpdateRequest(INDEX_NAME, "666");
// 每2个参数是一对 key value
request.doc(
   "country", "America"
);
client.update(request, RequestOptions.DEFAULT);
```

#### 5. 批量操作 BulkProcessor
* 默认BulkRequest是所有数据一次性执行，没有限制，如果一次性大量数据请求，容易出问题
* ES 提供了 BulkProcessor 批量处理客户端，用来分批次处理大量数据

```
BulkProcessor.Builder builder = BulkProcessor.builder((bulkRequest, bulkResponseActionListener) -> {
            client.bulkAsync(bulkRequest, RequestOptions.DEFAULT, bulkResponseActionListener);
        }, new BulkProcessor.Listener() {
            @Override
            public void beforeBulk(long executionId, BulkRequest request) {
                log.info("1. 批次{},请求数量{}", executionId, request.numberOfActions());
            }

            @Override
            public void afterBulk(long executionId, BulkRequest request, BulkResponse response) {
                // 在每次执行BulkRequest后调用，通过此方法可以获取BulkResponse是否包含错误
                if (response.hasFailures()) {
                    log.error("2. 批次{},包含错误", executionId);
                } else {
                    log.info("2. 批次{},请求数量{},花费时间{}", executionId, request.numberOfActions(), response.getTook().getMillis());
                }
            }

            @Override
            public void afterBulk(long executionId, BulkRequest request, Throwable failure) {
                log.error("3. 批次{},请求数量{},批量操作失败,失败信息{}", executionId, request.numberOfActions(), failure.getMessage());
            }
        });
        // 2000个数据触发flush
        builder.setBulkActions(2000);
        // 强制bulk操作大小, bulk数据每达到5MB触发flush
        builder.setBulkSize(new ByteSizeValue(5L, ByteSizeUnit.MB));
        // 强制bulk操作时间,自上次操作后,6s后有数据就flush
        builder.setFlushInterval(TimeValue.timeValueSeconds(6));

        // 并发请求数
        builder.setConcurrentRequests(0);
        // 重试策略,初始等待3秒，最多重试3次
        builder.setBackoffPolicy(BackoffPolicy.constantBackoff(TimeValue.timeValueSeconds(3), 3));
        BulkProcessor processor = builder.build();
```

大量数据来了之后，只要放进BulkProcessor，就会自动分批次处理了

```
processor.add(new IndexRequest(INDEX_NAME, "_doc", "666").source(JSON.toJSONString(hotel), XContentType.JSON));

// 手动刷新
processor.flush();
```


关闭

```
try {
    processor.awaitClose(30, TimeUnit.SECONDS);
} catch (InterruptedException e) {
    e.printStackTrace();
}
```
