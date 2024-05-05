###  中间定时器捕获事件 

#### 1. 作用
类似跑表，可以在两个任务之间起到延时的作用
* 当执行到达捕获事件时，启动定时器
* 当定时器触发时（例如在一段时间间隔后），沿定时器中间事件的出口顺序流继续执行


#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow28.png)

```
<intermediateCatchEvent id="sid-A0695E1B-32A5-4263-8DCF-4FBBDE434FBD">
  <timerEventDefinition>
    <timeDuration>PT1M</timeDuration>
  </timerEventDefinition>
</intermediateCatchEvent>
```

#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/TimerCatchEvent.bpmn20.xml")
        .name("中间定时器捕获事件")
        .deploy();
runtimeService.startProcessInstanceByKey("TimerCatchEvent");

taskService.complete("人工任务1 taskId");
```

* 在完成人工任务1后，等待1分钟后，act_ru_task 才出现人工任务2



