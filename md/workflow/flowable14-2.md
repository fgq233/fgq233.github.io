###  中间消息捕获事件 

#### 1. 作用
* 流程中将一个消息事件作为独立的节点来运行，它是一种捕获事件
* 当流程执行到该事件时就会暂停在这里，一直等待，直接到该事件接收到相应的**消息**后，才继续向后执行


#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow29.png)

```
<message id="midMsg" name="中间消息"></message>

<process id="MsgCatchEvent" name="MsgCatchEvent" isExecutable="true">
  <intermediateCatchEvent id="sid-952E0BAA-D919-42EB-9B6A-C2D8070E0D17">
    <messageEventDefinition messageRef="midMsg"></messageEventDefinition>
  </intermediateCatchEvent>
</process>
```

#### 3. 测试
```
// 部署流程
repositoryService.createDeployment()
        .addClasspathResource("xml/MsgCatchEvent.bpmn20.xml")
        .name("中间消息捕获事件")
        .deploy();
// 启动流程实例 
ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("MsgCatchEvent");

// 获取订阅了消息的执行实例
Execution execution = runtimeService.createExecutionQuery()
        .processInstanceId(processInstance.getProcessInstanceId())
        .messageEventSubscriptionName("中间消息")
        .singleResult();
// 发送消息  
runtimeService.messageEventReceived("中间消息", execution.getId());
Thread.sleep(Integer.MAX_VALUE);
```

* 在自动完成自动服务1后，必须发送消息，才能进入下一个活动



