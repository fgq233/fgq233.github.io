###  任务监听器  TaskListener

#### 1、定义
执行监听器是针对**用户任务**的事件监听器，可以被捕获的事件有：

```
<userTask id="myTask" name="My Task" >
  <extensionElements>
    <flowable:taskListener event="create" class="com.test.MyTaskListener" />
  </extensionElements>
</userTask>
```

任务监听器包含下列属性
* `event`（事件）（必填）：触发任务监听器的任务事件类型，可用的事件有：
  * `create`（创建）：当任务已经创建，并且所有任务参数都已经设置时触发
  * `assignment`（指派）：当任务已经指派给某人时触发 (在触发`create`事件之前，会首先触发`assignment`事件)
  * `complete`（完成）：当任务已经完成，从运行时数据中删除前触发
  * `delete`（删除）：在任务即将被删除前触发，请注意：任务由`completeTask()`正常完成时也会触发。
* `class`：需要调用的委托类，这个类必须实现org.flowable.engine.delegate.TaskListener接口



#### 2、监听器类
* 需要实现 `org.flowable.task.service.delegate.TaskListener` 接口

```
public class MyTaskListener implements TaskListener {

    @Override
    public void notify(DelegateTask delegateTask) {
        System.out.println("触发UserListener");
        if (EVENTNAME_CREATE.equals(delegateTask.getEventName())) {
            System.out.println("任务节点创建事件触发，指定处理人");
            delegateTask.setAssignee("fgq");
        } 
    }
}

public interface BaseTaskListener extends Serializable {
    String EVENTNAME_CREATE = "create";
    String EVENTNAME_ASSIGNMENT = "assignment";
    String EVENTNAME_COMPLETE = "complete";
    String EVENTNAME_DELETE = "delete";
    String EVENTNAME_ALL_EVENTS = "all";
}
```

 
