###  Flowable 流程的挂起、激活

### 一、 流程挂起、激活
流程部署后，**act_re_procdef** 表 `SUSPENSION_STATE_` 字段表示流程是否挂起
* `SUSPENSION_STATE = 1` 激活状态
* `SUSPENSION_STATE = 2` 挂起状态

```
@Autowired
private RepositoryService repositoryService;

@Test
void suspended() {
    String processDefId = "X1:1:ad3301c4-f968-11ee-ab3f-00ff306296e3";
    // 查询流程定义信息
    ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
            .processDefinitionId(processDefId)
            .singleResult();
    // 获取流程定义的状态
    boolean suspended = processDefinition.isSuspended();
    System.out.println("流程当前状态：" + (suspended ? "挂起" : "激活"));
    if (suspended) {
        System.out.println("激活流程");
        repositoryService.activateProcessDefinitionById(processDefId);
    } else {
        System.out.println("挂起流程");
        repositoryService.suspendProcessDefinitionById(processDefId);
    }
}
```

* 流程挂起后，不能再启动流程实例，但是不影响已经启动的流程实例中任务执行



### 二、 流程实例挂起、激活
流程任务表，**act_ru_task** 表 `SUSPENSION_STATE_` 字段表示**流程实例**是否挂起
* `SUSPENSION_STATE = 1` 激活状态
* `SUSPENSION_STATE = 2` 挂起状态

```
@Autowired
private RuntimeService runtimeService;

@Test
void suspendedInstance() {
    String processInstanceId = "38ab1ceb-f972-11ee-ad6b-00ff306296e3";
    // 挂起流程实例
    runtimeService.suspendProcessInstanceById(processInstanceId);
    
    // 激活流程实例
    // runtimeService.activateProcessInstanceById(processInstanceId);
}
```

* 流程实例挂起后，不能再完成任务

