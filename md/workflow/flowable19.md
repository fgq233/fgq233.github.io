###  边界错误事件 
捕获其所依附的活动范围内抛出的错误

#### 一、 两种定义方式
* 在`任务活动`上定义边界错误事件
* 在`嵌入式子流程`上定义边界错误事件
  * 子流程的范围包括其中的所有活动，错误可以由错误结束事件抛出，这样的错误会逐层向其上级父范围传播，直到在范围内找到一个匹配的错误边界事件

* 注意
  * 当捕获错误事件时，会销毁边界事件定义所在的任务活动，同时销毁其中所有的当前执行（例如，并行活动，嵌套子流程，等等）
  * 流程执行将沿着边界事件的出口顺序流继续


#### 二、 边界错误事件(任务活动上)
#### 1. 流程图、定义异常
![](https://fgq233.github.io/imgs/workflow/flow25.png)

```
<error id="myError" errorCode="404" />

<process id="BoundErrorEvent" name="BoundErrorEvent" isExecutable="true">
  <serviceTask id="sid-A8B297FE-FEBD-4A2D-80A5-286FFA9BA6FA" name="错误服务" flowable:class="com.fgq.demo.delegate.ErrorDelegate"></serviceTask>
  <boundaryEvent id="sid-810BCF7E-A18F-43A4-8379-3D57190DD2CE" attachedToRef="sid-A8B297FE-FEBD-4A2D-80A5-286FFA9BA6FA">
    <errorEventDefinition errorRef="myError" flowable:errorVariableLocalScope="true" flowable:errorVariableTransient="true"></errorEventDefinition>
  </boundaryEvent>
</process>
```

#### 2. JavaDelegate
```
public class ErrorDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("异常服务任务ErrorDelegate：" + LocalDateTime.now());
        throw new BpmnError("404");
    }
}
```


#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/BoundErrorEvent.bpmn20.xml")
        .name("边界错误事件")
        .deploy();
        
runtimeService.startProcessInstanceByKey("BoundErrorEvent");

taskService.complete("人工任务A");
```

* 错误服务抛出异常，被边界错误事件捕获
* 流程执行将沿着边界事件的出口顺序人工任务A继续
* 完成人工任务A
