###  执行监听器  ExecutionListener

#### 1、定义
执行监听器是针对**整个流程实例**的事件监听器，可以被捕获的事件有：

* 流程实例的启动和结束
* 流程执行转移
* 活动的启动和结束
* 网关的启动和结束
* 中间事件的启动和结束
* 启动事件的结束，和结束事件的启动

![](https://fgq233.github.io/imgs/workflow/flow51.png)


#### 2、监听器3种实现区别
* 类：`com.fgq.demo.listener.MyExecutionListener`，
    * 全限定类名，类必须要继承 `ExecutionListener`
    * 不要求是`Spring`管理的`Bean`
* 表达式：`${myBean.do()}`
    * 必须是`Spring`管理的`Bean`
    * 调用类中的方法
* 委托表达式：`${myExecutionListener}`
    * 类必须要继承 `ExecutionListener`
    * 必须是`Spring`管理的`Bean`的`Name`

#### 3、监听器类
* 需要实现 `org.flowable.engine.delegate.ExecutionListener` 接口

```
public class MyExecutionListener implements ExecutionListener {

    @Override
    public void notify(DelegateExecution execution) {
        System.out.println("MyExecutionListener...");
    }

}
```

