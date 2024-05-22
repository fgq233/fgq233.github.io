###  事件监听器  
![](https://fgq233.github.io/imgs/workflow/flow54.png)

#### 1、定义
* Flowable引擎中的事件机制可以让你在引擎中发生多种事件的时候得到通知

* 所有被分发的事件都是 `org.flowable.engine.common.api.delegate.event.FlowableEvent`的子类
  * 事件（在可用时）提供`type、executionId、processInstanceId、processDefinitionId`
  * 部分事件含有关于发生事件的上下文信息

* 事件监听器要实现 `org.flowable.engine.delegate.event.FlowableEventListener`，或者继承其子类


#### 2、监听器类
```java
@Component
public class MyEventListener implements FlowableEventListener {

  @Override
  public void onEvent(FlowableEvent event) {
    FlowableEventType type = event.getType();
    if (JOB_EXECUTION_SUCCESS.equals(type)) {
      System.out.println("A job well done!");
    } else if (JOB_EXECUTION_FAILURE.equals(type)) {
      System.out.println("A job has failed...");
    } else {
      System.out.println("Event received: " + event.getType());
    }
  }

  @Override
  public boolean isFailOnException() {
    return false;
  }

  @Override
  public boolean isFireOnTransactionLifecycleEvent() {
    return false;
  }

  @Override
  public String getOnTransaction() {
    return null;
  }
}
```

* `isFailOnException()` 方法决定了当事件分发后，`onEvent(..)`方法抛出异常时怎么处理
  * 若返回`false`，忽略异常
  * 若返回`true`，异常不会被忽略而会被上抛，使当前执行的命令失败
  * 如果事件是API调用（或其他事务操作，例如作业执行）的一部分，事务将被回滚
  * 如果事件监听器中并不是重要的业务操作，建议返回`false`



#### 3、简化
Flowable提供了少量基础实现，以简化常用的事件监听器使用场景
* `org.flowable.engine.delegate.event.BaseEntityEventListener`
* `org.flowable.engine.delegate.event.AbstractFlowableEngineEventListener`
  * 子类 `org.flowable.engine.delegate.event.AbstractFlowableEngineEventListener`


#### 4、配置事件监听器
```java
@AllArgsConstructor
@Configuration
public class FlowableEventConfig implements ApplicationListener<ContextRefreshedEvent> {

  private final MyEventListener myEventListener;
  private final MyEventListener2 myEventListener2;
  private final RuntimeService runtimeService;

  @Override
  public void onApplicationEvent(ContextRefreshedEvent event) {
    runtimeService.addEventListener(myEventListener,
            FlowableEngineEventType.PROCESS_CREATED,
            FlowableEngineEventType.PROCESS_COMPLETED);
    runtimeService.addEventListener(myEventListener2,
            FlowableEngineEventType.TASK_CREATED,
            FlowableEngineEventType.TASK_COMPLETED);
  }

}
```
