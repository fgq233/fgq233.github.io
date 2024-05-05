###  中间信号捕获事件 

#### 1. 作用
* 流程中将一个消息事件作为独立的节点来运行，它是一种捕获事件
* 当流程执行到该事件时就会暂停在这里，一直等待，直接到该事件接收到相应的**信号**后，才继续向后执行


#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow30.png)

```
<signal id="midSignal" name="中间信号" flowable:scope="global"></signal>

<process id="SignalCatchEvent" name="SignalCatchEvent" isExecutable="true">
  <intermediateCatchEvent id="sid-122347E7-4916-41B4-8691-86AD11D6EC1A">
    <signalEventDefinition signalRef="midSignal"></signalEventDefinition>
  </intermediateCatchEvent>
</process>
```

#### 3. 测试
```
// 部署流程
repositoryService.createDeployment()
        .addClasspathResource("xml/SignalCatchEvent.bpmn20.xml")
        .name("中间消息捕获事件")
        .deploy();
// 启动2次流程实例 
runtimeService.startProcessInstanceByKey("SignalCatchEvent");
runtimeService.startProcessInstanceByKey("SignalCatchEvent");
Thread.sleep(10000);

// 发送信号
runtimeService.signalEventReceived("中间信号");
Thread.sleep(Integer.MAX_VALUE);
```

* 发送信号后，2个流程实例都进入到自动服务2



