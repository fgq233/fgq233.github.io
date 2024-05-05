###  Flowable 事件

### 一、概念
* 事件（event）通常用于为流程生命周期中发生的事情建模，图形化为圆圈
* 在BPMN 2.0中，有两种主要的事件分类：捕获（catching）与抛出（throwing）事件
  * 捕获: 当流程执行到达这个事件时，会等待直到触发器动作
  * 抛出: 当流程执行到达这个事件时，会触发一个触发器


### 二、功能分类
#### 1. Flowable-UI 中分类
* 启动事件
* 边界事件
* 中间捕捉事件
* 中间抛出事件
* 结束事件

#### 2. 按事件功能分类
* 定时器事件
* 消息事件
* 错误事件
* 信号事件
* 其他的事件

### 二、边界事件 boundary event
* 边界事件是捕获型事件，依附在活动（activity）上
* 边界事件永远不会抛出，当活动运行时，事件将监听特定类型的触发器，当捕获到事件时，会终止活动，并沿该事件的出口顺序流继续
* 边界事件定义
  * `id` 流程范围内唯一的标识符
  * `attachedToRef` 对该事件所依附活动的引用
  * 边界事件的类型，形如XXXEventDefinition的XML子元素

```
<boundaryEvent id="myBoundaryEvent" attachedToRef="theActivity">
      <XXXEventDefinition/>
</boundaryEvent>
```

### 三、定时器事件 timer event definition
* 由定时器所触发的事件
* 定时器定义必须且只能包含下列的一种元素
  * `timeDate` 开始时间，ISO 8601格式的`固定时间`，在这个时间就会触发触发器
  * `timeDuration` 等待时间，定时器需要`等待多长时间`再触发
  * `timeCycle` 循环时间，有2种方式
    * 标准的ISO 8601格式，指定重复周期、触发次数、结束时间
    * cron 表达式
* 定时器只有在异步执行器启用时才能触发，需要在配置文件将`async-executor-activate`置为 true
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


### 四、消息事件 message event
* 引用具名消息的事件
* 消息事件定义使用`messageEventDefinition`元素声明，其`messageRef`属性引用一个`message`元素
* 与信号不同，消息事件只有一个接收者

```
<definitions ...>
  <!-- 声明消息 -->
  <message id="newInvoice" name="newInvoiceMessage" />
  <message id="payment" name="paymentMessage" />

  <process id="invoiceProcess">
    <startEvent id="messageStart" >
        <!-- 消息事件定义 -->
    	<messageEventDefinition messageRef="newInvoice" />
    </startEvent>
    ...
    <intermediateCatchEvent id="paymentEvt" >
        <!-- 消息事件定义 -->
    	<messageEventDefinition messageRef="payment" />
    </intermediateCatchEvent>
    ...
  </process>

</definitions>
```


### 五、信号事件 signal event
#### 1. 定义
* 引用具名信号的事件
* 信号事件定义使用`signalEventDefinition`元素声明，其`signalRef`属性引用一个`signal`元素

```
<definitions... >
    <!-- 声明信号 -->
    <signal id="alertSignal" name="alert" />

    <process id="catchSignal">
        <intermediateThrowEvent id="throwSignalEvent" name="Alert">
            <!-- 信号事件定义 -->
            <signalEventDefinition signalRef="alertSignal" />
        </intermediateThrowEvent>
        ...
        <intermediateCatchEvent id="catchSignalEvent" name="On Alert">
            <!-- 信号事件定义 -->
            <signalEventDefinition signalRef="alertSignal" />
        </intermediateCatchEvent>
        ...
    </process>
</definitions>
```

#### 2. 信号事件的范围
* 默认情况，信号事件在流程引擎全局广播
  * 在一个流程实例中抛出一个信号事件，而不同流程定义的不同流程实例都会响应这个事件
* 限制信号事件的范围（scope），可以在信号事件定义中添加（非BPMN 2.0标准！）scope属性
  * `scope="global" `默认全局
  * `scope="processInstance"` 代表流程实例范围

```
<signal id="alertSignal" name="alert" flowable:scope="processInstance"/>
```

#### 3. Java API抛出信号
信号可以由流程实例使用BPMN结构抛出（throw），也可以通过编程方式使用Java API抛出

```
// 在全局范围为所有已订阅处理器抛出信号
RuntimeService.signalEventReceived(String signalName);

// 只为指定的执行实例传递信号，搭配 scope="processInstance" 使用
RuntimeService.signalEventReceived(String signalName, String executionId);
```

#### 4. 查询信号事件订阅
```
// 查询订阅了某一信号事件的所有执行实例
List<Execution> executions = runtimeService.createExecutionQuery()
      .signalEventSubscriptionName("alert")
      .list();
```


### 六、 错误事件 error event definition
* BPMN错误与Java异常不是一回事
  * BPMN错误事件是建模业务异常（business exceptions）
  * Java异常会按它们自己的方式处理
  
```
<error id="myError" errorCode="404" />

<endEvent id="myErrorEndEvent">
  <errorEventDefinition errorRef="myError" />
</endEvent>
```


* 如果省略了errorRef，错误边界事件会捕获所有错误事件，无论error的errorCode是什么
* 如果提供了errorRef，并且其引用了存在的error，则边界事件只会捕获相同错误代码的错误
* 如果提供了errorRef，但BPMN文件中没有定义error，则errorRef会用作errorCode
