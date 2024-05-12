###  执行监听器  ExecutionListener

#### 1、定义
执行监听器是针对**整个流程实例**的事件监听器，可以被捕获的事件有：

* 流程实例的启动和结束
* 流程执行转移
* 活动的启动和结束
* 网关的启动和结束
* 中间事件的启动和结束
* 启动事件的结束，和结束事件的启动



#### 2、监听器类
* 需要实现 `org.flowable.engine.delegate.ExecutionListener` 接口

```
public class MyExecutionListener implements ExecutionListener {

    @Override
    public void notify(DelegateExecution execution) {
        System.out.println("MyExecutionListener...");
    }

}
```

