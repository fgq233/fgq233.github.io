###  接收任务 

#### 1、定义
* 接收任务是等待特定消息到达的任务
* 当流程执行到达接收任务时，流程状态将提交至持久化存储，保持等待状态，直到引擎接收到特定的消息，触发流程穿过接收任务继续执行

```
<receiveTask id="waitState" name="wait" />
```


#### 2、激活
* `void trigger(String executionId)`

```
repositoryService.createDeployment().addClasspathResource("xml/XX.bpmn20.xml").name("测试接收任务").deploy();
ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("XX");
Execution execution = runtimeService.createExecutionQuery()
    .processInstanceId(processInstance.getId())
    .activityId("waitState")
    .singleResult();

runtimeService.trigger(execution.getId());
```

