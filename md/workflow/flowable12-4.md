###  异常启动事件 
#### 1. 说明
* 作用：只能用于触发**事件子流程**（Event Sub-Process）
* 注意
  * 异常启动事件不能用于启动流程实例
  * 该事件不能使用在其它流程中，包括最高级流程（Top-Level Process）、嵌套子流程（Sub-Process）和调用子流程（Call Activity）


#### 2. 流程图、定义异常
![](https://fgq233.github.io/imgs/workflow/flow17.png)

```
<definitions ...>
  <!-- 声明异常 -->
  <error id="myError" errorCode="404" />

  <process id="StartErrorEvent" name="StartErrorEvent" isExecutable="true">
    ...
    <subProcess id="sid-D2275222-9246-4642-937D-106D19199A3C" name="subProcess" triggeredByEvent="true">
      <startEvent id="sid-5A7EC9B6-8745-495D-B37C-5504E4A6F475" isInterrupting="true">
        <!-- 错误事件定义 -->
        <errorEventDefinition errorRef="myError" flowable:errorVariableLocalScope="true" flowable:errorVariableTransient="true"></errorEventDefinition>
      </startEvent>
      ...
    </subProcess>
  </process>
</definitions>
```

* 注意：FlowableUI中没有错误定义的选项，在BPMN.xml流程文件中自己添加即可


#### 3. JavaDelegate
两个服务任务所引用的类

```
public class ErrorDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("异常服务任务ErrorDelegate：" + LocalDateTime.now());
        // 业务执行发现有异常，手动抛出BpmnError
        // 此处的 errorCode 需要和 BPMN.xml 中定义的errorCode一致
        throw new BpmnError("404");
    }
}

public class MyJavaDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("服务任务：" + LocalDateTime.now());
    }
}
```

#### 4. 测试
```
// 部署流程
repositoryService.createDeployment()
        .addClasspathResource("xml/StartErrorEvent.bpmn20.xml")
        .name("错误启动事件")
        .deploy();
        
// 启动流程实例
runtimeService.startProcessInstanceByKey("StartErrorEvent");
Thread.sleep(Integer.MAX_VALUE);
```


* 启动流程实例后，自动执行错误服务`ErrorDelegate`，抛出BpmnError
* 事件子流程触发，自动执行服务`MyJavaDelegate`
