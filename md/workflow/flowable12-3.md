###  信号启动事件 
#### 1. 说明
* 作用：根据信号自动启动流程实例，无需调用`startProcessInstanceByXXX`，信号触发方式有2种
  * 由流程实例中的信号抛出中间事件（intermediary signal throw event）
  * API 触发

```
RuntimeService.signalEventReceived(String signalName);
RuntimeService.signalEventReceived(String signalName, String executionId);
```

* 注意：传递的是信号的名称，而不是id



#### 2. 定义信号
![](https://fgq233.github.io/imgs/workflow/flow15.png)

#### 3. 流程图
![](https://fgq233.github.io/imgs/workflow/flow16.png)

```
<signal id="startSignal" name="启动信号" flowable:scope="global"></signal>
<process id="StartSignalEvent" name="StartSignalEvent" isExecutable="true">
  <startEvent>
    <signalEventDefinition signalRef="startSignal"></signalEventDefinition>
  </startEvent>
</process>
```

#### 4. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/StartSignalEvent.bpmn20.xml")
        .name("信号启动事件")
        .deploy();
        
// 发送信号
runtimeService.signalEventReceived("启动信号");
Thread.sleep(Integer.MAX_VALUE);
```


