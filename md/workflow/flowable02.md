###  Flowable 流程部署
通过 `bpmn2.xml` 部署流程

### 一、环境
* SpringBoot2.6.13
* JDK8
* Flowable6.7.2
* MySQL8

#### 1. 依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!--Flowable的核心依赖-->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter</artifactId>
    <version>6.7.2</version>
</dependency>

<!--MySQL驱动-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

#### 2. application.yml
```
server:
  port: 8888
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/flowable?serverTimezone=UTC&nullCatalogMeansCurrent=true
    username: root
    password: 123456
flowable:
  async-executor-activate: true  # 关闭定时任务JOB
  database-schema-update: true    
```


### 二、部署
#### 1. 非 Spring 环境部署
```
@Test
void deployFlow() {
    // 1.流程引擎的配置
    ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
            .setJdbcUrl("jdbc:mysql://127.0.0.1:3306/flowable?serverTimezone=UTC&nullCatalogMeansCurrent=true")
            .setJdbcDriver("com.mysql.cj.jdbc.Driver")
            .setJdbcUsername("root")
            .setJdbcPassword("123456")
            .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
    // 2.构建流程引擎对象
    ProcessEngine processEngine = cfg.buildProcessEngine();
    // 3. 部署流程
    Deployment deploy = processEngine.getRepositoryService().createDeployment()
            .addClasspathResource("xml/flow1.bpmn20.xml")
            .name("第一个流程案例")
            .deploy();
    System.out.println(deploy.getId());
}
```

**databaseSchemaUpdate**：用于设置流程引擎启动关闭时，使用的数据库表结构控制策略

* `false` (默认): 当引擎启动时，检查数据库表结构的版本是否匹配库文件版本，版本不匹配时抛出异常
* `true`: 构建引擎时，检查并在需要时更新表结构，表结构不存在则会创建
* `create-drop`: 引擎创建时创建表结构，并在引擎关闭时删除表结构



#### 2. Spring 环境部署
```
@Autowired
private RepositoryService repositoryService;

@Test
void deployFlow(){
    Deployment deploy = repositoryService.createDeployment()
            .addClasspathResource("xml/flow1.bpmn20.xml") 
            .name("第一个流程案例")
            .deploy();
    System.out.println(deploy.getId());
}
```


#### 3. 部署结果
部署成功后，会在下面三张表中记录流程部署的信息
* `act_ge_bytearray` 记录流程定义的资源信息，xml和流程图的图片信息
* `act_re_deployment` 流程部署表，记录这次的部署行为
* `act_re_procdef` 流程定义表，记录这次部署动作对应的流程定义信息
