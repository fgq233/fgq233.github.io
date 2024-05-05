###  边界信号事件 
依附在任务活动上的信号事件

#### 一、 说明
* 当执行到达边界事件所依附的任务时
* 此时任务如果还没有完成，若收到了信号，则沿着边界事件的出口顺序流继续执行
  * 中断：默认`cancelActivity="true"`，图标为实线，原任务会被中断
  * 非中断：图标为虚线，`cancelActivity="false"`，原任务仍存在
* 注意
  * 信号与消息的区别在于其范围，可以是全局`global`、流程实例`processInstance`
  * 信号的范围若是全局的，则信号边界事件可以捕获从任何地方抛出，甚至可以是不同的流程实例
  * 信号在被捕获后不会被消耗，如果有两个激活的信号边界事件，捕获相同的信号事件，则两个边界事件都会被触发，哪怕它们不在同一个流程实例里

```
RuntimeService
void signalEventReceived(String signalName);
void signalEventReceived(String signalName, String executionId);
```

#### 二、 边界消息事件(中断任务)
#### 1. 定义信号
![](https://fgq233.github.io/imgs/workflow/flow23.png)

#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow24.png)

```
<signal id="boundSignal" name="边界信号" flowable:scope="global"></signal>
<process id="BoundSignalEvent" name="BoundSignalEvent" isExecutable="true">
  <userTask id="sid-EEE19F8C-1F08-446F-9982-38CAF0A0608D" name="人工任务" flowable:formFieldValidation="true"></userTask>
  <boundaryEvent id="sid-91F8E201-B33A-4886-ABEE-0E69B10301DA" attachedToRef="sid-EEE19F8C-1F08-446F-9982-38CAF0A0608D" cancelActivity="true">
    <signalEventDefinition signalRef="boundSignal"></signalEventDefinition>
  </boundaryEvent>
</process>
```


#### 3. 说明
```
repositoryService.createDeployment()
        .addClasspathResource("xml/BoundSignalEvent.bpmn20.xml")
        .name("边界信号事件")
        .deploy();
runtimeService.startProcessInstanceByKey("BoundSignalEvent");
runtimeService.startProcessInstanceByKey("BoundSignalEvent");

runtimeService.signalEventReceived("边界信号");
Thread.sleep(Integer.MAX_VALUE);
```

* 部署流程、启动2个流程实例，此时`act_ru_task`有2个人工任务信息
* 发送信号
* 边界信号事件中断人工任务，2条`act_ru_task` 数据都消失，服务任务自动执行

