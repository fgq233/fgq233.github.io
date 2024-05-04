###  Flowable 定时器事件
*  定时器启动事件
*  定时器捕获中间事件
*  定时器边界事件

### 一、概念
* 定时器事件（timer event definition），是由定时器所触发的事件 
* 定时器定义必须且只能包含下列的一种元素
  * `timeDate` 开始时间，ISO 8601格式的`固定时间`，在这个时间就会触发触发器
  * `timeDuration` 等待时间，定时器需要`等待多长时间`再触发
  * `timeCycle` 循环时间，有2种方式
    * 标准的ISO 8601格式，指定重复周期、触发次数、结束时间
    * cron 表达式
* 定时器只有在异步执行器启用时才能触发，在配置文件将`async-executor-activate`置为 true
* 在触发前，`act_ru_timer_job` 中可以查询到定时器信息

```
<timerEventDefinition>
    <timeDate>2011-03-11T12:13:14</timeDate>
</timerEventDefinition>

等待10天
<timerEventDefinition>
    <timeDuration>P10D</timeDuration>
</timerEventDefinition>

三次重复间隔，每次间隔为10小时
<timerEventDefinition>
    <timeCycle flowable:endDate="2015-02-25T16:42:11+00:00">R3/PT10H</timeCycle>
</timerEventDefinition>
<timerEventDefinition>
    <timeCycle>R3/PT10H/${EndDate}</timeCycle>
</timerEventDefinition>

<timerEventDefinition>
    <timeCycle>0 0/5 * * * ?</timeCycle>
</timerEventDefinition>0 0/5 * * * ?
```


### 二、定时器启动事件
#### 1. 作用
* 作用：在指定时间创建流程实例，不需要调用`startProcessInstanceByXXX`
* 注意
  * 子流程不能有定时器启动事件
  * 若调用startProcessInstanceByXXX，则会在定时启动之外额外启动一个流程
  * 当部署带有定时器启动事件的流程的更新版本时，上一版本的定时器作业会被移除


#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow13.png)

```
<startEvent id="sid-605D4213-D687-47F1-822B-E04FF57D2A89" isInterrupting="false">
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

### 三、 定时器捕获中间事件
#### 1. 作用
类似跑表，可以在两个任务之间起到延时的作用
* 当执行到达捕获事件时，启动定时器
* 当定时器触发时（例如在一段时间间隔后），沿定时器中间事件的出口顺序流继续执行


#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow14.png)

```
<intermediateCatchEvent id="sid-10691640-27A0-433B-AD16-85F81BDBA330">
  <timerEventDefinition>
    <timeDuration>PT1M</timeDuration>
  </timerEventDefinition>
</intermediateCatchEvent>
```

#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/TimerEvent2.bpmn20.xml")
        .name("定时器捕获中间事件")
        .deploy();
runtimeService.startProcessInstanceByKey("TimerEvent2");
Thread.sleep(Integer.MAX_VALUE);
```

* 部署流程
* 启动流程实例
* 自动完成第一个服务任务，等待1分钟后，自动完成第二个服务任务



### 四、 定时器边界事件
#### 1. 作用
类似跑表，可以在两个任务之间起到等待、延时的作用
* 当执行到达捕获事件时，启动定时器
* 当定时器触发时（例如在一段时间间隔后），沿定时器中间事件的出口顺序流继续执行


#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow14.png)

```
<intermediateCatchEvent id="sid-10691640-27A0-433B-AD16-85F81BDBA330">
  <timerEventDefinition>
    <timeDuration>PT1M</timeDuration>
  </timerEventDefinition>
</intermediateCatchEvent>
```

#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/TimerEvent2.bpmn20.xml")
        .name("定时器捕获中间事件")
        .deploy();
runtimeService.startProcessInstanceByKey("TimerEvent2");
Thread.sleep(Integer.MAX_VALUE);
```

* 部署流程
* 启动流程实例
* 自动完成第一个服务任务，等待1分钟后，自动完成第二个服务任务
