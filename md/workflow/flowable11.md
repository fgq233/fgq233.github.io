###  Flowable 事件

### 一、概念
* 事件（event）通常用于为流程生命周期中发生的事情建模，图形化为圆圈
* 在BPMN 2.0中，有两种主要的事件分类：捕获（catching）与抛出（throwing）事件
  * 捕获: 当流程执行到达这个事件时，会等待直到触发器动作
  * 抛出: 当流程执行到达这个事件时，会触发一个触发器


### 二、Flowable-UI 中分类
* 启动事件
* 边界事件
* 中间捕捉事件
* 中间抛出事件
* 结束事件

![](https://fgq233.github.io/imgs/workflow/flow12.png)


### 三、按功能划分
* 定时器事件
* 消息事件
* 错误事件
* 信号事件
* 其他的事件

#### 1.定时器事件
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
