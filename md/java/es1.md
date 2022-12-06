###  Elasticsearch 基本概念
####  1. ELK 联盟
* ELK联盟：由Elasticsearch、logstash、kibana组成，后来新成员Beats加入，形成 ELKB联盟
* Elasticsearch：分布式搜索引擎，基于 Lucene 来实现，restful风格接口
* Logstash：收集、存储、解析日志
* Kibana：为 Elasticsearch 和 Logstash 提供数据可视化的界面

#### 2. Elasticsearch 与关系型数据库对比
| MySQL | Elasticsearch | 说明  |
| --------- | ---------- | -------- |
| Table     | Index      | 索引(index)：相同类型文档的集合，类似关系型数据库的表(table)        |
| Row       | Document   | 文档(Document)：就是一条条数据，类似数据库中的行(Row)，ES文档都是JSON格式 |
| Column    | Field      | 字段(Field)：就是JSON文档中的字段，类似关系型数据库中的列(Column) |
| Schema    | Mapping    | Mapping(映射)：是索引中对文档的约束，例如字段类型约束，类似数据库的表结构(Schema) |
| SQL       | DSL        | DSL：是ES提供的JSON风格的请求语句，用来操作ES实现增删改查 |


#### 3. 正向索引
* 传统索引方式，在做词条查询时，先逐条获取文档，再判断文档中是否有某个词条，是**根据文档找词条的过程**
* 优点：可以给多个字段创建索引，根据索引字段查询的速度非常快
* 缺点：根据非索引字段，或者索引字段中的部分词条查找时，只能全表扫描，速度慢


#### 4. 倒排索引
* 与正向索引相反，先找到要搜索的词条，根据词条得到其所在文档的id，然后根据id获取文档，是**根据词条找文档的过程**
* 优点：擅长海量数据的搜索，Lucene、Elasticsearch采用的就是倒排索引

倒排索引中两个概念：
* 文档(Document)：用来搜索的数据，其中的每一条数据就是一个文档
* 词条(Term)：对文档数据或用户搜索数据，利用某种分词算法，得到的具备含义的词语




