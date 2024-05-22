###  事件监听器  
![](https://fgq233.github.io/imgs/workflow/flow54.png)

### 一、概念
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


### 二、配置事件监听器
#### 1、为流程定义配置事件监听器
![](https://fgq233.github.io/imgs/workflow/flow55.png)



#### 2、在运行时添加监听器
* 使用API(`RuntimeService`)为引擎添加或删除事件监听器

```
/**
 * 新增一个监听器，会在所有事件发生时被通知。
 * @param listenerToAdd 要新增的监听器
 */
void addEventListener(FlowableEventListener listenerToAdd);

/**
 * 新增一个监听器，在给定类型的事件发生时被通知。
 * @param listenerToAdd 要新增的监听器
 * @param types 监听器需要监听的事件类型
 */
 void addEventListener(FlowableEventListener listenerToAdd, FlowableEventType... types);

/**
 * 从分发器中移除指定监听器。该监听器将不再被通知，无论该监听器注册为监听何种类型。
 * @param listenerToRemove 要移除的监听器
 */
void removeEventListener(FlowableEventListener listenerToRemove);
```


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


#### 3、通过API分发事件
* 通过API提供事件分发机制，向任何在引擎中注册的监听器分发自定义事件
* 建议（但不强制）只分发CUSTOM类型的FlowableEvents

```
/**
 * 将给定事件分发给所有注册监听器。
 * @param event 要分发的事件。
 *
 * @throws FlowableException 当分发事件发生异常，或者{@link FlowableEventDispatcher}被禁用。
 * @throws FlowableIllegalArgumentException 当给定事件不可分发
 */
 void dispatchEvent(FlowableEvent event);
```



```java
@Configuration
@RequiredArgsConstructor
public class FlowableEventConfig {

    private final MyEventListener myEventListener;
    private final MyEventListener2 myEventListener2;

    private final SpringProcessEngineConfiguration configuration;

    @PostConstruct
    public void init() {
        FlowableEventDispatcher dispatcher = configuration.getEventDispatcher();
        dispatcher.addEventListener(myEventListener,
                FlowableEngineEventType.PROCESS_CREATED,
                FlowableEngineEventType.PROCESS_COMPLETED);
        dispatcher.addEventListener(myEventListener2,
                FlowableEngineEventType.TASK_CREATED,
                FlowableEngineEventType.TASK_COMPLETED);
    }

}
```
