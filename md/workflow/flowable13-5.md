###  边界补偿事件 
依附在活动边界上的补偿捕获中间事件

#### 一、 说明
* 补偿边界事件与其它边界事件的活动策略不同
  * 其它边界事件，例如信号边界事件，在其依附的活动启动时激活，当该活动结束时会被解除，并取消相应的事件订阅
  * 而补偿边界事件在其依附的活动成功完成时激活，同时创建补偿事件的相应订阅，当补偿事件被触发，或者相应的流程实例结束时，才会移除订阅
* 注意
  * 当补偿被触发时，会调用补偿边界事件关联的补偿处理器，调用次数与其依附的活动成功完成的次数相同
  * 如果补偿边界事件依附在具有多实例特性的活动上，则会为每一个实例创建补偿事件订阅
  * 如果补偿边界事件依附在位于循环内部的活动上，则每次该活动执行时，都会创建一个补偿事件订阅
  * 如果流程实例结束，则取消补偿事件的订阅
  * 边界补偿事件在活动完成后才激活，因此不支持`cancelActivity`中断属性

#### 二、 边界补偿事件
#### 1. 流程图、定义异常
![](https://fgq233.github.io/imgs/workflow/flow27.png)

```
<definitions ....>
  <process id="BoundCompensationEvent" name="BoundCompensationEvent" isExecutable="true">
    <!-- 边界补偿事件依附的活动任务 -->
    <userTask id="sid-A412A6F5-47C2-4165-B0AC-1428D3FF65CC" name="人工任务" flowable:formFieldValidation="true"></userTask>
    <!-- 边界补偿事件 -->
    <boundaryEvent id="sid-E34F4255-2D76-4D79-BE35-0E8CD47F2C1E" attachedToRef="sid-A412A6F5-47C2-4165-B0AC-1428D3FF65CC" cancelActivity="false">
      <compensateEventDefinition></compensateEventDefinition>
    </boundaryEvent>
    <!-- 补偿活动 -->
    <serviceTask id="sid-0F6CC7A9-D7C7-45C1-B8AB-053B599B9F7A" name="补偿服务" isForCompensation="true" flowable:class="com.fgq.demo.delegate.MyJavaDelegate"></serviceTask>
    <!-- 关联边界补偿事件、补偿活动 -->
    <association id="sid-AB1C8EB1-0F55-42B1-AFDD-3F05149C8F80" sourceRef="sid-E34F4255-2D76-4D79-BE35-0E8CD47F2C1E" 
                 targetRef="sid-0F6CC7A9-D7C7-45C1-B8AB-053B599B9F7A" associationDirection="None"></association>
  </process>
</definitions>
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
public class MyJavaDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("补偿服务：" + LocalDateTime.now());
    }
}
```


#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/BoundCompensationEvent.bpmn20.xml")
        .name("边界补偿事件")
        .deploy();
runtimeService.startProcessInstanceByKey("BoundCompensationEvent");

taskService.complete("人工任务taskId");
Thread.sleep(Integer.MAX_VALUE);
```

打印结果

```
异常服务任务ErrorDelegate：2024-05-05T18:40:08.828
补偿服务：2024-05-05T18:40:08.890
```

* 完成人工任务，流向异常服务任务 `ErrorDelegate`
* 抛出异常，被边界错误事件捕获，流向中间补偿投掷事件
* 边界补偿事件捕获，调用补偿服务 `MyJavaDelegate`

 
