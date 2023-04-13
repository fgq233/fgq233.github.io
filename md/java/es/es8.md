###  自动补全查询

###  一. 拼音分词器
####  1、 下载
* [拼音分词器](https://github.com/medcl/elasticsearch-analysis-pinyin)
* 在 ES 的plugins目录下新建py文件夹下，将安装包解压放进去，然后重启 ES


####  2、 测试分词效果
```
POST /_analyze
{
  "text": "范老师是个帅哥",
  "analyzer": "pinyin"
}
```

###  二. 自定义分词器
拼音分词器默认会将每个汉字单独分为拼音，而我们希望的是每个词条形成一组拼音，
所以需要对拼音分词器做个性化定制，形成自定义分词器


####  1、 分词器组成
ES 中分词器（analyzer）的组成包含三部分：
* character filters：在tokenizer之前对文本进行处理，例如删除字符、替换字符
* tokenizer：将文本按照一定的规则切割成词条(term)，例如keyword，就是不分词，还有ik_smart
* tokenizer filter：将tokenizer输出的词条做进一步处理，例如大小写转换、同义词处理、拼音处理等

![分词器组成](https://fgq233.github.io/imgs/java/es2.png)


####  2、 自定义分词器语法
创建索引库时，在settings中配置，可以包含三部分: character filter、tokenizer、filter

```
PUT /test
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "ik_max_word",
          "filter": "pinyin"
        }
      }
    }
  }
}
```


####  3、 自定义分词器 filter
拼音分词器默认filter有问题，需要自己定制，filter具体定制属性参考官网


```
PUT /test
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "ik_max_word",
          "filter": "py"
        }
      },
      "filter": {
        "py": {
          "type": "pinyin",
          "keep_full_pinyin": false,
          "keep_joined_full_pinyin": true,
          "keep_original": true,
          "limit_first_letter_length": 16,
          "remove_duplicated_term": true,
          "none_chinese_pinyin_tokenize": false
        }
      }
    }
  }
}
```


####  4、 测试
```
POST /test/_analyze
{
  "text": "范老师是个帅哥",
  "analyzer": "my_analyzer"
}
```


####  5、 创建、搜索使用不同分词器
因为不同词分词后拼音可能一样，所以在创建倒排索引时使用 my_analyzer 分词器，在搜索时应该使用ik_smart分词器

```
PUT /test
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "ik_max_word",
          "filter": "py"
        }
      },
      "filter": {
        "py": {
          "type": "pinyin",
          "keep_full_pinyin": false,
          "keep_joined_full_pinyin": true,
          "keep_original": true,
          "limit_first_letter_length": 16,
          "remove_duplicated_term": true,
          "none_chinese_pinyin_tokenize": false
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "my_analyzer",
        "search_analyzer": "ik_smart"
      }
    }
  }
}
```


###  三. 自动补全查询
ES 提供了Completion Suggester查询来实现自动补全功能，这个查询会匹配以用户输入内容开头的词条并返回，
为了提高自动补全查询的效率，对于文档中字段的类型有一些约束：

* 参与补全查询的字段必须是completion类型，"type": "completion"
* 字段的内容一般是用来补全的多个词条形成的数组

####  1. 创建索引库时 mapping 定义自动补全字段
```
PUT /test
{
  "settings": {
    "analysis": {
      "analyzer": {
        "completion_analyzer": {
          "tokenizer": "keyword",
          "filter": "py"
        }
      },
      "filter": {
        "py": {
          "type": "pinyin",
          "keep_full_pinyin": false,
          "keep_joined_full_pinyin": true,
          "keep_original": true,
          "limit_first_letter_length": 16,
          "remove_duplicated_term": true,
          "none_chinese_pinyin_tokenize": false
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "suggestion": {       # 定义自动补全字段
        "type": "completion",
        "analyzer": "completion_analyzer"
      }
    }
  }
}
```

####  2. 重新导入索引库数据
```
// 实体中定义自动补全字段 suggestion 
private List<String> suggestion = Arrays.asList(this.brand, this.business, this.city);

// 使用 BulkRequest 将测试数据重新全部导入到索引库
```


####  3. DSL查询语法
* 三要素：名称、查询的文本、补全查询的字段
* skip_duplicates：跳过重复的
* size：获取前10条结果

```
GET /索引库名/_search
{
  "suggest": {
    "mySuggest": {
      "text": "sh",
      "completion": {
        "field": "suggestion",
        "skip_duplicates": true,
        "size": 10
      }
    }
  }
}
```


####  4. RestHighLevelClient 自动补全查询
```
// 1.准备请求
SearchRequest request = new SearchRequest("hotel");
// 2.请求参数
request.source().suggest(new SuggestBuilder()
        .addSuggestion(
                "mySuggest",
                SuggestBuilders
                        .completionSuggestion("suggestion")
                        .size(10)
                        .skipDuplicates(true)
                        .prefix("sh")
        ));
// 3.发出请求
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
```


#### 5. 解析结果
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
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "mySuggest" : [
      {
        "text" : "sh",
        "offset" : 0,
        "length" : 1,
        "options" : [
          {
            "text" : "上海",
            "_index" : "hotel",
            "_type" : "_doc",
            "_id" : "666",
            "_score" : 1.0,
            "_source" : {
              "brand" : "7天酒店",
              "business" : "四川北路商业区",
              "city" : "上海",
              "id" : 666,
              "suggestion" : [
                "7天酒店",
                "四川北路商业区",
                "上海"
              ]
            }
          }
        ]
      }
    ]
  }
}


// 从 response 中解析
Suggest suggest = response.getSuggest();
// 1. 根据名称获取结果
CompletionSuggestion suggestion = suggest.getSuggestion("mySuggest");
// 2. 获取options
for (CompletionSuggestion.Entry.Option option : suggestion.getOptions()) {
    // 3. 获取补全的结果 text
    String str = option.getText().toString();
    System.out.println(str);
}
```

 