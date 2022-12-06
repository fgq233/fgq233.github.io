###  RestClient对索引库、文档增删改查
###  一. RestClient 概述
* ES官方提供了不同语言的客户端，用来操作ES，这些客户端的本质就是组装DSL语句，通过http请求发送给ES

* [RestClient](https://www.elastic.co/guide/en/elasticsearch/client/index.html)
* [RestClient Java文档](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/installation.html)

* 8.X以下的Java Rest Client包括两种：
    * Java Low Level Rest Client
    * Java High Level Rest Client
* 8.X以上使用新版的 Java Api Client


###  二. RestClient使用步骤，基于8.5.2
####  1. 引入依赖
```
<dependency>
    <groupId>co.elastic.clients</groupId>
    <artifactId>elasticsearch-java</artifactId>
    <version>8.5.2</version>
</dependency>

<dependency>
   <groupId>com.fasterxml.jackson.core</groupId>
   <artifactId>jackson-databind</artifactId>
   <version>2.12.3</version>
</dependency>
<dependency>
  <groupId>jakarta.json</groupId>
  <artifactId>jakarta.json-api</artifactId>
  <version>2.0.1</version>
</dependency>
```
* 使用co.elastic.clients基于Elasticsearch API 正式文档，不会因版本不一致出现诸多问题，
如jar报冲突等，可兼容SpringBoot1.X、2.X


####  2. 连接
```
RestClient restClient = RestClient.builder(
                new HttpHost("127.0.0.1", 9200)).build();
ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
client = new ElasticsearchClient(transport);
```

####  3. 业务代码
####  4. 关闭RestHighLevelClient
```

```


###  三. RestClient操作索引库
####  1. 增
```

```

####  2. 查



####  3. 删


####  4. 改
