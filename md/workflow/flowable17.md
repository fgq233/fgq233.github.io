###  边界消息事件 
依附在任务活动上的消息事件

#### 一、 说明
* 当执行到达边界事件所依附的任务时
* 此时任务如果还没有完成，若收到了订阅的消息，则沿着边界事件的出口顺序流继续执行
  * 中断：默认`cancelActivity="true"`，图标为实线，原任务会被中断
  * 非中断：图标为虚线，`cancelActivity="false"`，原任务仍存在
  
```
void messageEventReceived(String messageName, String executionId);
void messageEventReceived(String messageName, String executionId, Map<String, Object> processVariables);
```

#### 二、 边界消息事件(中断任务)
#### 1. 定义消息
![](https://fgq233.github.io/imgs/workflow/flow20.png)

#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow21.png)

```
<message id="boundMsg" name="边界消息"></message>
<process id="BoundMessageEvent1" name="BoundMessageEvent1" isExecutable="true">
  <userTask id="sid-1BB4FF52-53F4-4327-819C-3B5E8FA854A7" name="人工任务" flowable:assignee="A" flowable:formFieldValidation="true"></userTask>
  <boundaryEvent id="sid-8B69D7CB-BD5D-4AFC-BA94-CE0D2640786C" attachedToRef="sid-1BB4FF52-53F4-4327-819C-3B5E8FA854A7" cancelActivity="true">
    <messageEventDefinition messageRef="boundMsg"></messageEventDefinition>
  </boundaryEvent>
</process>
```

流程图绘制完成后，注意看`bpmn.xml`中attachedToRef是否依附到具体任务活动上

#### 3. 测试
```
// 部署流程
repositoryService.createDeployment()
        .addClasspathResource("xml/BoundMessageEvent1.bpmn20.xml")
        .name("边界消息事件")
        .deploy();
// 启动流程实例 
ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("BoundMessageEvent1");

// 获取订阅了消息的执行实例
Execution execution = runtimeService.createExecutionQuery()
        .processInstanceId(processInstance.getProcessInstanceId())
        .messageEventSubscriptionName("边界消息")
        .singleResult();
// 发送消息  
runtimeService.messageEventReceived("边界消息", execution.getId());
Thread.sleep(Integer.MAX_VALUE);
```

* 部署流程、启动流程实例
* 此时`act_ru_task`有一个人工任务信息
* 获取订阅了消息的执行实例，发送消息
* 边界消息事件中断人工任务，`act_ru_task` 数据消失，服务任务自动执行


#### 三 边界消息事件(不中断任务)
#### 1. 定义消息(略)
#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow19.png)

```
<message id="boundMsg" name="边界消息"></message>

<process id="BoundMessageEvent2" name="BoundMessageEvent2" isExecutable="true">
  <userTask id="sid-B10BCD50-B0EE-473A-82C2-2703FD874F99" name="人工任务" flowable:formFieldValidation="true"></userTask>
  <boundaryEvent id="sid-49DA3004-F491-4742-A9B4-BBCCDA86CDF6" attachedToRef="sid-B10BCD50-B0EE-473A-82C2-2703FD874F99" cancelActivity="false">
    <messageEventDefinition messageRef="boundMsg"></messageEventDefinition>
  </boundaryEvent>
</process>
```

不中断任务 `cancelActivity="false"`

#### 3. 说明
非中断的区别在于边界消息依附的任务仍存在，需要完成

