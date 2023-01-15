### SpringDataMongoDB
SpringData家族成员之一，用于操作MongoDB的持久层框架，封装了驱动包mongodb-driver

#### 一.  添加依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```


 

#### 二.  application.yml配置
```
spring:
  data:
    mongodb:
      host: 127.0.0.1       # 主机地址
      database: fgq         # 数据库
      port: 27017           # 端口
#     也可以使用uri连接
#     uri:  mongodb://127.0.0.1:27017/fgq  
```


#### 三.  新增实体
```
@Document(collection = "blog")   
@CompoundIndex(def = "{'userid': 1, 'likenum': -1}")
@Data
public class Blog implements Serializable {

    @Id
    private String id;

    @Field("content")
    private String content;

    @Indexed
    private String userid;

    private Integer likenum;

    private Date createtime;

}
```


* `@Document`：指定集合名称，集合名称 collection 省略则默认使用类名小写映射集合

* `@Id`：主键标识，对应mongodb的主键字段 `_id`，如果该属性名就叫 `id` ,则该注解可以省略，否则必须写
* `@Field("content")`：实体中属性名与mongodb中字段名不一致时使用  
* `@Indexed`：单字段索引
* `@CompoundIndex( def = "{'userid': 1, 'starnum': -1}")`：复合索引，添加在类上



#### 四、创建Dao
```
public interface BlogDao extends MongoRepository<Blog, String> {

    Page<Blog> findByUserid(String userid, Pageable pageable);

}
```

* 这个类可以注入使用，里面封装了 `MongoDB` 增删改查方法，实现类是
 `org.springframework.data.mongodb.repository.supportSimpleMongoRepository`
* 注意：继承MongoRepository后，在Dao定义方法，其方法名、参数是有严格要求的，不然会报错


#### 五、测试
```
@SpringBootTest
class MongoDBTest {

    @Autowired
    private BlogDao blogDao;
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 保存，ID 如果省略，MongoDB会自动生成主键
     */
    @Test
    void save() {
        Blog blog = new Blog();
        blog.setId("1");
        blog.setUserid("1001");
        blog.setContent("范老师帅的一批");
        blog.setCreatetime(new Date());
        blog.setStarnum(666);
        blogDao.save(blog);
    }

    /**
     * 根据id查询
     */
    @Test
    void findById() {
        Blog blog = blogDao.findById("1").get();
        System.out.println(blog);
    }

    /**
     * 根据id删除
     */
    @Test
    void deleteById() {
        blogDao.deleteById("1");
    }

    /**
     * 更新
     */
    @Test
    void update() {
        Blog blog = new Blog();
        blog.setId("1");
        blog.setUserid("1002");
        blog.setContent("女神下面给你吃");
        blog.setCreatetime(new Date());
        blog.setStarnum(888);
        blogDao.save(blog);
    }


    /**
     * 查询所有
     */
    @Test
    void findAll() {
        List<Blog> list = blogDao.findAll();
        for (Blog blog : list) {
            System.out.println(blog);
        }
    }


    /**
     * 分页查询
     */
    @Test
    void findPage() {
        Page<Blog> page = blogDao.findByUserid("1001", PageRequest.of(1, 1));
        System.out.println("总数：" + page.getTotalElements());
        List<Blog> list = page.getContent();
        for (Blog blog : list) {
            System.out.println(blog);
        }
    }

    /**
     * 测试 MongoTemplate
     */
    @Test
    void testMongoTemplate() {
        //  查询条件
        Query query = Query.query(Criteria.where("userid").is("1001"));
        //  更新条件
        Update update = new Update();
        update.inc("starnum");
        mongoTemplate.updateFirst(query, update, Blog.class);
    }

}

```