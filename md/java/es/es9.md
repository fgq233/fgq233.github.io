###  Spring Data ElasticSearch 通过 ElasticsearchRepository 操作 ES
[官方文档](https://docs.spring.io/spring-data/elasticsearch/docs/4.0.x/reference/html/#preface)

###  一、集成
####  1. pom.xml
```
<dependency>
	<groupId>org.springframework.data</groupId>
	<artifactId>spring-data-elasticsearch</artifactId>
</dependency>
```


####  2. application.yml 配置
```
spring:
  elasticsearch:
    rest:
      uris: http://127.0.0.1:9200
      username: elastic     
      password: 123456
      connection-timeout: 5
      read-timeout: 30
  data:
    elasticsearch:
      repositories:
        enabled: true       // 根据实体自动生成索引库
```


####  3. 配置 RestHighLevelClient (可选)
```
@Configurable
public class RestClientConfig extends AbstractElasticsearchConfiguration {

    @Value("${spring.elasticsearch.rest.uris}")
    private String uris;
    @Value("${spring.elasticsearch.rest.username}")
    private String username;
    @Value("${spring.elasticsearch.rest.password}")
    private String password;

    @Override
    public RestHighLevelClient elasticsearchClient() {
        ClientConfiguration configuration = ClientConfiguration.builder()
                .connectedTo(uris)
                .withBasicAuth(username, password)
                .build();
        return RestClients.create(configuration).rest();
    }
}
```



### 二、通过 ElasticsearchRepository 实现增删改查
####  1. 定义实体(对应ES中索引库)
```
@Document(indexName = "hotel")
@Data
public class Hotel implements Serializable {

    private static final long serialVersionUID = -1L;

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String name;

    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String address;

    @Field(type = FieldType.Integer)
    private Integer price;

    @Field(type = FieldType.Integer)
    private Integer score;

    @Field(type = FieldType.Keyword)
    private String brand;

    @Field(type = FieldType.Keyword)
    private String city;

    @Field(type = FieldType.Keyword)
    private String starName;

    @Field(type = FieldType.Text, analyzer = "ik_max_word")
    private String business;

    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date cjsj;
}
```

* `DateTimeFormat` 用于前端提交到后端，`String` 格式化为 `Date`
* `JsonFormat` 用于后端返给前端，`Date` 格式化为 `String`

####  2. 继承 ElasticsearchRepository
```
public interface HotelRepository extends ElasticsearchRepository<Hotel, Long> {

    /**
     * 根据名称进行检索
     */
    Page<Hotel> findByName(String name, Pageable page);
}
```

![](https://fgq233.github.io/imgs/java/es4.png)

* `CrudRepository` 定义了增删改查方法
* `PagingAndSortingRepository` 定义了分页、排序方法
* `ElasticsearchRepository` 定义了搜索方法
* 具体实现类为 `SimpleElasticsearchRepository`


####  3. 使用 ElasticsearchRepository 实现增删改查
```
@Service
public class CurdService implements ICurdService {

    @Autowired
    private HotelRepository hotelRepository;
    
    // 单个文档新增
    @Override
    public void save(Hotel hotel) {
        hotelRepository.save(hotel);
    }
    // 单个文档删除
    @Override
    public void deleteById(Long id) {
        hotelRepository.deleteById(id);
    }
    // 清空索引库
    @Override
    public void deleteAll() {
        hotelRepository.deleteAll();
    }
    // 批量删除
    @Override
    public void delSelection(List<Hotel> hotelList) {
        hotelRepository.deleteAll(hotelList);
    }
    // 查询单个文档
    @Override
    public Hotel findById(Long id) {
        Optional<Hotel> optional = hotelRepository.findById(id);
        return optional.get();
    }
    // 分页 + 排序
    @Override
    public Page<Hotel> getPageList(Integer curPage, Integer pageSize) {
        Pageable pageable = PageRequest.of(curPage - 1, pageSize, Sort.by(Sort.Direction.ASC, "id"));
        return hotelRepository.findAll(pageable);
    }
    // 根据关键字查询
    @Override
    public Page<Hotel> findByName(String searchVal, Integer curPage, Integer pageSize) {
        Pageable pageable = PageRequest.of(curPage - 1, pageSize);
        return hotelRepository.findByName(searchVal, pageable);
    }
}
```