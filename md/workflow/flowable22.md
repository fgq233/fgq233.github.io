###  任务驳回、回退

#### 一、串行回退
![](https://fgq233.github.io/imgs/workflow/flow46.png)

```
<process id="X" name="X" isExecutable="true">
  <userTask id="userTask1" name="用户任务1" flowable:assignee="user1" flowable:formFieldValidation="true">
  </userTask>
  <userTask id="userTask2" name="用户任务2" flowable:assignee="user2" flowable:formFieldValidation="true">
  </userTask>
</process>
```

#### 1、测试
* 部署流程、启动流程实例
* 用户1完成任务
* 用户2回退任务
  * 要在两个任务之间回退，需要知道流程图中`userTask`节点的`id`，对应`act_ru_task.TASK_DEF_KEY_`
  * 单个任务回退使用`moveActivityIdTo()`
* 用户1完成任务、用户2完成任务
* 流程实例结束

```
// 流程实例id
String processInstaceId = "xxx......";
// 当前任务节点 id
String curActivityId = "userTask2";
// 回退到哪个任务节点 id
String newActivityId = "userTask1";

runtimeService.createChangeActivityStateBuilder()
        .processInstanceId(processInstaceId)
        .moveActivityIdTo(curActivityId, newActivityId)
        .changeState();
```

#### 2、查询历史
```
// 查询已经完成的历史流程实例
List<HistoricProcessInstance> instanceList = historyService.createHistoricProcessInstanceQuery()
        .finished()
        .orderByProcessInstanceEndTime()
        .desc()
        .list();
for (HistoricProcessInstance hiProcessInstance : instanceList) {
    // 查询已经完成的历史任务实例
    List<HistoricTaskInstance> taskList = historyService.createHistoricTaskInstanceQuery()
            .processInstanceId(hiProcessInstance.getId())
            .finished()
            .orderByHistoricTaskInstanceEndTime()
            .asc()
            .list();
    taskList.forEach(hiTask -> System.out.println("环节：" + hiTask.getName() + ",办理人：" + hiTask.getAssignee() + ",完成时间：" + hiTask.getEndTime()));
}

环节：用户任务1,办理人：user1,完成时间：Tue May 14 14:48:41 CST 2024
环节：用户任务2,办理人：user2,完成时间：Tue May 14 14:50:46 CST 2024
环节：用户任务1,办理人：user1,完成时间：Tue May 14 14:51:59 CST 2024
环节：用户任务2,办理人：user2,完成时间：Tue May 14 14:52:15 CST 2024
```


#### 二、并行回退
![](https://fgq233.github.io/imgs/workflow/flow47.png)

```
<process id="X" name="X" isExecutable="true">
  <userTask id="userTask1" name="用户任务1" flowable:assignee="user1" flowable:formFieldValidation="true">
  </userTask>
  <userTask id="userTask2" name="用户任务2" flowable:assignee="user2" flowable:formFieldValidation="true">
  </userTask>
  <userTask id="userTask3" name="用户任务3" flowable:assignee="user3" flowable:formFieldValidation="true">
  </userTask>
</process>
```

#### 1、测试
* 部署流程、启动流程实例
* 用户1完成任务
* 用户2、3回退任务
  * 多个任务同时回退使用`moveActivityIdsToSingleActivityId()`
* 用户1完成任务、用户2完成任务
* 流程实例结束

```
// 流程实例id
String processInstaceId = "xxx......";
// 当前任务节点 id
List<String> curActivitys = Arrays.asList("userTask2", "userTask3");
// 回退到哪个任务节点 id
String newActivityId = "userTask1";

runtimeService.createChangeActivityStateBuilder()
        .processInstanceId(processInstaceId)
        .moveActivityIdsToSingleActivityId(curActivitys, newActivityId)
        .changeState();
```

#### 2、查询历史
```
环节：用户任务1,办理人：user1,完成时间：Tue May 14 15:22:23 CST 2024
环节：用户任务2,办理人：user2,完成时间：Tue May 14 15:26:23 CST 2024
环节：用户任务3,办理人：user3,完成时间：Tue May 14 15:26:23 CST 2024
环节：用户任务1,办理人：user1,完成时间：Tue May 14 15:27:02 CST 2024
环节：用户任务2,办理人：user2,完成时间：Tue May 14 15:27:19 CST 2024
环节：用户任务3,办理人：user3,完成时间：Tue May 14 15:27:35 CST 2024
```
