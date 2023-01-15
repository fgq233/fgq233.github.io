### MongoDB 基本概念
#### 一.  简介
`MongoDB` 是一个开源、高性能、无模式的文档型数据库，由C++语言编写，是 `NoSQL` 数据库产品中的一种，
是最像关系型数据库（`MySQL`）的非关系型数据库，而且还支持对数据建立索引


#### 二.  体系结构

| SQL   | MongoDB         | 说明 |
| ------ | ----------| ---- |
| DataBase | DataBase | 数据库 |
| **table** | **collection** | 数据库表/集合 |
| **row** | **document** | 数据记录行/文档 |
| column | field | 数据字段/域 |
| index | index | 索引 |
| primary key | primary key | 主键，MongoDB自动将_id字段设置为主键 |


* `MongoDB` 中的记录是一个文档 document，是一个由 (字段 + 值) 对（`field:value`）组成的结构，
类似于 `JSON` 格式
 
* 文档 document 示例：{name：张三, age: 18}

* 集合 collection 示例：{name：张三, age: 18} {name：李四, age: 24}
  

#### 三.  数据结构
* `MongoDB` 的最小存储单位就是文档`document`对象，对应关系型数据库的行，数据在 `MongoDB` 中以
`BSON`（`Binary Serialized Document Format，简称Binary JSON`）的格式存储在磁盘上

* `BSON` 是一种类似 `JSON` 的一种数据格式，其`字段`是字符型，`值`的类型比 JSON 更加丰富：

| 数据类   | 描述         | 举例 |
| ------ | ----------| ---- |
| 字符串 | UTF-8字符串都可表示为字符串类型的数据 | {"x" : "foobar"} |
| 对象id | 对象id是文档的12字节的唯一 ID | {"X" :ObjectId() } |
| 布尔值 | true或者false | {"x":true} |
| 数组 | 值的集合或者列表可以表示成数组 | {"x" ： ["a", "b", "c"]} |
| 32位整数 | 不支持这个类型 | shell不支持该类型的，shell中默认会转换成64位浮点数|
| 32位整数 | 不支持这个类型 | shell不支持该类型的，shell中默认会转换成64位浮点数|
| 64位浮点数 | shell中的数字就这一种类型 | {"x"：3.14159，"y"：3} |
| null | 表示空值或者未定义的对象 | {"x":null} |
| undefined | 文档中也可以使用未定义类型 | {"x":undefined} |
| 正则表达式 | 文档中可以包含正则表达式，采用JavaScript的正则表达式语法 | {"x" ： /foobar/i} |
| 代码 | 文档中还可以包含JavaScript代码 |{"x" ： function() { /* …… */ }}|


