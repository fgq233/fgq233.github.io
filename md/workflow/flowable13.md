###  消息启动事件 
#### 1. 说明
* 作用：根据消息启动流程实例，调用`startProcessInstanceByMessage`

```
ProcessInstance startProcessInstanceByMessage(String messageName);
ProcessInstance startProcessInstanceByMessage(String messageName, Map<String, Object> processVariables);
ProcessInstance startProcessInstanceByMessage(String messageName, String businessKey, Map<String, Object< processVariables);
```

* 注意
  * `startProcessInstanceByMessage`传递的是消息的名称，而不是id
  * 子流程不支持消息启动事件，必须用空启动事件
  * 若一个流程定义中有多个消息启动事件，可以使用`startProcessInstanceByMessage()`选择合适的启动事件
  * 若一个流程定义中有多个消息启动事件与一个空启动事件，则`startProcessInstanceByKey()、startProcessInstanceById()`会使用空启动事件启动流程实例
  * 若一个流程定义中有多个消息启动事件与0个空启动事件，则`startProcessInstanceByKey()、startProcessInstanceById()`会抛出异常
  * 若一个流程定义中有1个消息启动事件，则`startProcessInstanceByKey()、startProcessInstanceById()`会使用这个消息启动事件启动流程实例



#### 2. 定义消息
![](https://fgq233.github.io/imgs/workflow/flow13.png)

#### 3. 流程图
![](https://fgq233.github.io/imgs/workflow/flow14.png)

```
<message id="startMessage" name="启动消息"></message>
<process id="StartMessageEvent" name="StartMessageEvent" isExecutable="true">
  <startEvent>
    <messageEventDefinition messageRef="startMessage"></messageEventDefinition>
  </startEvent>
</process>
```

#### 4. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/StartMessageEvent.bpmn20.xml")
        .name("消息启动事件")
        .deploy();
runtimeService.startProcessInstanceByMessage("启动消息");
Thread.sleep(Integer.MAX_VALUE);
```


