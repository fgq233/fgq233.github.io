###  Flowable 启动流程实例

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
