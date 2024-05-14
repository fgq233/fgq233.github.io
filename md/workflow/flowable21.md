###  用户任务多人会签
* 多人会签是指一个任务需要多个用户来处理
* 多人会签功能的实现需要使用 Flowable 多实例用户任务

#### 一、说明
![](https://fgq233.github.io/imgs/workflow/flow42.png)
![](https://fgq233.github.io/imgs/workflow/flow43.png)

#### 1、描述
* 多实例类型
  * `None`  不是多实例，也就是不需要多人会签
  * `Parallel`   并行
  * `Sequential` 串行
* 基数(多实例)：会签人数
* 集合(多实例)：是一个变量，会签用户集合
* 元素变量(多实例)：是一个变量，表示当前会签用户
* 完成条件(多实例)：多人会签任务完成的条件，是一个`boolean`结果
* 分配用户：可以引用元素变量(当前会签用户)为办理人

#### 2、完成条件
* 多人会签任务并不是所有人完成了才结束，而是根据完成条件决定
  * 完成条件为false，会签任务继续
  * 完成条件为true，会签任务结束
* 完成条件使用的是 UEL 表达式，结果为`boolean`，可以是值表达式、也可以使用方法表达式
  * 值表达式：`${flag}、${node.result}`
  * 方法表达式：`${myTaskCompleteBean.completeTaskTo(execution)}`，完成条件 = 方法返回值



#### 二、测试案例
#### 1、流程图
![](https://fgq233.github.io/imgs/workflow/flow44.png)

```
<userTask id="sid-XXX" name="多人会签用户任务" flowable:formFieldValidation="true">
  <multiInstanceLoopCharacteristics isSequential="false" flowable:collection="personList" flowable:elementVariable="person">
    <extensionElements></extensionElements>
    <loopCardinality>3</loopCardinality>
    <completionCondition>${flag}</completionCondition>
  </multiInstanceLoopCharacteristics>
</userTask>
```

#### 2、部署流程(略)
#### 3、启动流程实例
```
Map<String, Object> variables = new HashMap<>();
variables.put("personList", Arrays.asList("user1", "user2", "user3"));
runtimeService.startProcessInstanceByKey("X", variables);
```

* 传入变量`personList`：会签用户集合，此时`act_ru_task`出现3条任务

![](https://fgq233.github.io/imgs/workflow/flow45.png)

#### 4、user1 完成任务(不结束)
```
Task task = taskService.createTaskQuery().taskAssignee("user1").singleResult();
if (task != null) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("flag", false);
    taskService.complete(task.getId(), variables);
}
```

* 结束条件`flag`设置为false
* `user1` 完成任务，多实例任务未结束，`act_ru_task` 还剩 2条任务数据

#### 5、user2 完成任务(结束)
```
Task task = taskService.createTaskQuery().taskAssignee("user2").singleResult();
if (task != null) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("flag", true);
    taskService.complete(task.getId(), variables);
}
```

* 结束条件`flag`设置为true
* `user2` 完成任务，多实例任务结束，`act_ru_task` 没有数据了
