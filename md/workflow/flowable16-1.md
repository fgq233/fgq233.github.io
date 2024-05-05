###  结束错误事件 

#### 1. 作用
当流程执行到达结束错误事件时，结束执行的当前分支，并抛出BPMN错误
* 这个错误可以由匹配的[边界错误事件](https://fgq233.github.io/md/workflow/flowable13-4)捕获
* 如果找不到匹配的[边界错误事件](https://fgq233.github.io/md/workflow/flowable13-4)，将会抛出异常。

#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow32.png)


```
<error id="myError" errorCode="404" />

<process id="EndErrorEvent" name="EndErrorEvent" isExecutable="true">
  <startEvent id="startEvent1" flowable:formFieldValidation="true"></startEvent>
  <subProcess id="sid-15103F94-BD41-42E0-9EF6-1B1AC3B7E65A" name="subProcess">
      <!--  结束错误事件 -->
    <endEvent id="sid-9C77F8B9-021B-458A-B430-A305A190EE5D">
      <errorEventDefinition errorRef="myError" flowable:errorVariableLocalScope="true" flowable:errorVariableTransient="true"></errorEventDefinition>
    </endEvent>
  </subProcess>
    <!--  边界错误事件 -->
  <boundaryEvent id="sid-65DF2146-D7E7-46B5-B785-1BFC66FEA141" attachedToRef="sid-15103F94-BD41-42E0-9EF6-1B1AC3B7E65A">
    <errorEventDefinition errorRef="myError" flowable:errorVariableLocalScope="true" flowable:errorVariableTransient="true"></errorEventDefinition>
  </boundaryEvent>
</process>
```


#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/EndErrorEvent.bpmn20.xml")
        .name("结束错误事件")
        .deploy();
runtimeService.startProcessInstanceByKey("EndErrorEvent");


Map<String, Object> var  = new HashMap<>();
var.put("num", 88);
taskService.complete("人工任务taskId", var);
Thread.sleep(Integer.MAX_VALUE);
```

