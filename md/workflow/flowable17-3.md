###  手动任务 

#### 1、定义
* 手动任务是定义在BPMN引擎之外的任务
* 对于引擎来说，在流程执行到达手动任务时，自动通过，执行后续的顺序流

```
<manualTask id="myManualTask" name="Call client for more information" />
```


#### 2、添加执行监听器
使用 `flowable:executionListener` 元素为手动任务添加一个执行监听器

```
<manualTask id="sid-B235223D-469B-4951-951C-4766793692E7">
  <extensionElements>
    <flowable:executionListener event="start" class="com.fgq.demo.listener.MyExecutionListener"></flowable:executionListener>
  </extensionElements>
</manualTask>


public class MyExecutionListener implements ExecutionListener {
    @Override
    public void notify(DelegateExecution execution) {
        System.out.println("MyExecutionListener...");
    }
}
```

