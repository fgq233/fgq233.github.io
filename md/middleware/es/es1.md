###  Elasticsearch 基本概念
####  1. ELK 联盟
* ELK联盟：由Elasticsearch、logstash、kibana组成，后来新成员Beats加入，形成 ELKB联盟
* Elasticsearch：分布式搜索引擎，基于 Lucene 来实现，restful风格接口
* Logstash：收集、存储、解析日志
* Kibana：为 Elasticsearch 和 Logstash 提供数据可视化的界面

#### 2. Elasticsearch 与关系型数据库对比

| MySQL | Elasticsearch | 说明  |
| --------- | ---------- | -------- |
| Table     | Index      | 索引(Index)：相同类型文档的集合，类似关系型数据库的表(table)        |
| Schema    | Mapping    | Mapping(映射)：是索引中对文档的约束，例如字段类型约束，类似数据库的表结构(Schema) |
| Row       | Document   | 文档(Document)：就是一条条数据，类似数据库中的行(Row)，ES文档都是JSON格式 |
| Column    | Field      | 字段(Field)：就是JSON文档中的字段，类似关系型数据库中的列(Column) |
| SQL       | DSL        | DSL：是ES提供的JSON风格的请求语句，用来操作ES实现增删改查 |


#### 3. 操作ElasticSearch 方式
* 集成 `Spring Data ElasticSearch`
  * `ElasticsearchRepository`，`API`简洁
  * `ElasticsearchRestTemplate`，基于`RestHighLevelClient`
* 集成 `RestHighLevelClient`，API比较繁琐


#### 4. 版本对应
`Spring Data ElasticSearch、ElasticSearch、Spring Boot` 版本有严格的对应关系

![](https://fgq233.github.io/imgs/java/es3.png)


