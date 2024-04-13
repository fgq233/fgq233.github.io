###  Flowable 一个简单的流程使用步骤
![](https://fgq233.github.io/imgs/workflow/flow02.png)

### 一、流程引擎 ProcessEngine
流程操作都需要使用到流程引擎对象`ProcessEngine`，然后通过`ProcessEngine`获取对应服务来进行具体操作

#### 1. 非Spring环境构建流程引擎对象 
```
// 1.流程引擎的配置
ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
        .setJdbcUrl("jdbc:mysql://127.0.0.1:3306/flowable?serverTimezone=UTC&nullCatalogMeansCurrent=true")
        .setJdbcDriver("com.mysql.cj.jdbc.Driver")
        .setJdbcUsername("root")
        .setJdbcPassword("123456")
        .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
// 2.构建流程引擎对象
ProcessEngine processEngine = cfg.buildProcessEngine();
```

若是`Spring`环境，只要在`application.yml`配置好数据库、`flowable`相关配置，即可注入`ProcessEngine`对象使用

#### 2. 常用的四大服务

| 服务                | 作用                   | 表            |
|-------------------|----------------------|--------------|
| RepositoryService | 资源管理，如：部署流程，流程的挂起与激活 | act_re_...   |
| RuntimeService    | 流程运行管理，如：启动流程实例      | act_ru_...   |
| TaskService       | 任务管理，如：查询待办任务、完成任务   | act_ru_task  |
| HistoryService    | 历史管理，如：查询流程任务完成历史    | act_hi_...   |

若是`Spring`环境，这些服务可以直接注入使用


### 二、流程部署 RepositoryService
```
@Autowired
private RepositoryService repositoryService;

@Test
void deployFlow(){
    Deployment deploy = repositoryService.createDeployment()
            .addClasspathResource("xml/X1.bpmn20.xml") 
            .name("第一个流程案例")
            .deploy();
    System.out.println(deploy.getId());
}
```

部署成功后，会在下面三张表中记录流程部署的信息
* `act_re_procdef` 流程定义表，记录这次部署动作对应的流程定义信息
* `act_re_deployment` 流程部署表，记录这次的部署行为
* `act_ge_bytearray` 记录流程定义的资源信息，xml和流程图的图片信息


### 三、启动流程实例 RuntimeService
* 常用的启动流程实例有两种方法
  * `startProcessInstanceByKey()`  根据流程定义 Key 启动流程实例
  * `startProcessInstanceById()`   根据流程定义 ID 启动流程实例
* 在成功部署流程后，`act_re_procdef`流程定义表中的`ID_、KEY_`字段可以找到这2个值
  * Key 是创建流程图的时候，自己定义的，需要保证唯一
  * ID 是程序自动生成的

```
@Autowired
private RuntimeService runtimeService;

@Test
void startProcessInstance() {
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("X1");
    System.out.println("ProcessInstanceId:" + processInstance.getProcessInstanceId());
}
```

* 流程定义和流程实例的关系
  *  流程定义：Java中的类
  *  流程实例：Java中的对象
* 启动流程实例成功后，会记录以下信息
  * `act_hi_procinst` 记录流程实例历史，每启动一次流程实例，就记录一条(流程实例id、关联的流程定义id......)
  * `act_ru_task`  记录流程实例的任务信息，即当前待办  (任务id、环节名称、当前待办人)
  * `act_ru_execution` 流程执行信息


### 四、待办任务、完成任务 TaskService
```
@Autowired
private TaskService taskService;

@Test
void queryTask() {
    // 查询某个流程定义下某个用户的待办任务
    List<Task> list = taskService.createTaskQuery()
            .processDefinitionId("X1:1:ad3301c4-f968-11ee-ab3f-00ff306296e3")
            .taskAssignee("A")
            .list();
    for (Task task : list) {
        System.out.println("任务id：" + task.getId());
        System.out.println("环节名称：" + task.getName());
    }
}

@Test
void completeTask() {
    // 完成任务环节
    taskService.complete("bc2748ad-f968-11ee-98ce-00ff306296e3");
}

@Test
void completeTask() {
    // 完成任务环节时，存在变量
    Map<String, Object> variables = new HashMap<>();
    variables.put("approved", false); // 拒绝请假
    taskService.complete("bc2748ad-f968-11ee-98ce-00ff306296e3", variables);
}
```

* 流程启动后会进入到开始环节后的第一个任务节点：组长审批
  * 任务id：`act_ru_task.ID_ = bc2748ad-f968-11ee-98ce-00ff306296e3`
  * 环节名称：`act_ru_task.NAME_ = 组长审批`
  * 分配用户：`act_ru_task.Assignee_ = A`
* 调用 complete(任务id) 完成组长审批环节，此时环节流传到经理审批
  * 任务id：`act_ru_task.ID_ = ab4e1f79-f969-11ee-a1c7-00ff306296e3`
  * 环节名称：`act_ru_task.NAME_ = 经理审批`
  * 分配用户：`act_ru_task.Assignee_ = B`
* 再次调用 complete(任务id) 完成经理审批环节，此时环节流传到结束，流程实例结束
* PS：任务完成后，act_ru_task 任务数据会删除

