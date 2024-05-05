###  边界定时器事件 
依附在任务活动上的定时器事件

#### 一、 说明
* 当执行到达边界事件所依附的任务时，将启动定时器
* 当定时器触发时，沿着边界事件的出口顺序流继续执行
  * 中断定时器：默认`cancelActivity="true"`，图标为实线，原任务会被中断
  * 非中断定时器：图标为虚线，`cancelActivity="false"`，原任务仍存在



#### 二、 边界定时器事件(中断任务)
#### 1. 流程图
![](https://fgq233.github.io/imgs/workflow/flow18.png)

```
<process id="BoundTimerEvent1" name="BoundTimerEvent1" isExecutable="true">
  <userTask id="sid-B8E7A4EF-9424-4EFA-A996-C1FFEF8F2163" name="人工任务" flowable:assignee="A" flowable:formFieldValidation="true"></userTask>
  <boundaryEvent id="sid-2FFD5B4B-3614-4BE8-8C54-509D06127890" attachedToRef="sid-B8E7A4EF-9424-4EFA-A996-C1FFEF8F2163" cancelActivity="true">
    <timerEventDefinition>
      <timeDuration>PT1M</timeDuration>
    </timerEventDefinition>
  </boundaryEvent>
</process>
```

流程图绘制完成后，注意看`bpmn.xml`中attachedToRef是否依附到具体任务活动上

#### 2. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/BoundTimerEvent1.bpmn20.xml")
        .name("边界定时器事件")
        .deploy();
runtimeService.startProcessInstanceByKey("BoundTimerEvent1");
Thread.sleep(Integer.MAX_VALUE);
```

* 部署流程、启动流程实例
* 此时 `act_ru_timer_job`有一条定时信息，`act_ru_task`有一个人工任务信息
* 1M 后，定时器触发，中断人工任务，`act_ru_timer_job、act_ru_task` 数据消失，服务任务自动触发


#### 三 边界定时器事件(不中断任务)
#### 1. 流程图
![](https://fgq233.github.io/imgs/workflow/flow19.png)

```
  <process id="BoundTimerEvent2" name="BoundTimerEvent2" isExecutable="true">
    <startEvent id="startEvent1" flowable:formFieldValidation="true"></startEvent>
    <userTask id="sid-14689728-557D-47F5-92A8-34878DA7F931" name="人工任务" flowable:formFieldValidation="true"></userTask>
    <boundaryEvent id="sid-F7AE253A-CC5F-439B-9ECC-E15D47A6B0D7" attachedToRef="sid-14689728-557D-47F5-92A8-34878DA7F931" cancelActivity="false">
      <timerEventDefinition>
        <timeDuration>PT1M</timeDuration>
      </timerEventDefinition>
    </boundaryEvent>
  </process>
```

不中断任务 `cancelActivity="false"`

#### 2. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/BoundTimerEvent2.bpmn20.xml")
        .name("边界定时器事件2")
        .deploy();
runtimeService.startProcessInstanceByKey("BoundTimerEvent2");
Thread.sleep(Integer.MAX_VALUE);

taskService.complete("人工任务taskId");
```

* 部署流程、启动流程实例
* 此时 `act_ru_timer_job`有一条定时信息，`act_ru_task`有一个人工任务信息
* 1M 后，定时器触发，`act_ru_timer_job` 数据消失，服务任务自动触发
* 不中断人工任务，`act_ru_task` 数据还存在，需要完成

