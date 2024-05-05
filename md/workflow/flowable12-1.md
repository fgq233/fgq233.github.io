###  定时器启动事件 
#### 1. 说明
* 作用：在指定时间创建流程实例，不需要调用`startProcessInstanceByXXX`
* 注意
  * 子流程不能有定时器启动事件
  * 若调用startProcessInstanceByXXX，则会在定时启动之外额外启动一个流程
  * 当部署带有定时器启动事件的流程的更新版本时，上一版本的定时器作业会被移除


#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow12.png)

```
<startEvent>
  <timerEventDefinition>
    <timeCycle>R6/PT10S</timeCycle>
  </timerEventDefinition>
</startEvent>
```

#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/TimerEvent1.bpmn20.xml")
        .name("定时器启动事件")
        .deploy();
Thread.sleep(Integer.MAX_VALUE);
```

* 部署流程后，每隔 10s 自动启动流程实例，一共6次

