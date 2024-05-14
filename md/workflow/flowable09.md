###  Flowable 候选人、候选组
* 当任务环节分配用户有多个人可以处理时，就可以使用候选人
* 当候选人太多时，可以使用候选组

![](https://fgq233.github.io/imgs/workflow/flow06.png)

### 一、测试
![](https://fgq233.github.io/imgs/workflow/flow07.png)

#### 1. 部署流程(略)
#### 2. 启动流程实例
```
Map<String, Object> variables = new HashMap<>();
variables.put("candidateUser1", "A");
variables.put("candidateUser2", "B");
runtimeService.startProcessInstanceByKey("X4", variables);
```

* 设置了2名候选人，启动成功后，此时`act_ru_task`中第一个环节任务数据已存在，但是处理人`Assignee`为空
* 候选人在`act_ru_identitylink`表，通过`TASK_ID_`关联`act_ru_task`任务 

#### 3. 候选人查询任务、认领任务
```
List<Task> list = taskService.createTaskQuery().taskCandidateUser("A").list();
for (Task task : list) {
    System.out.println("任务id：" + task.getId());
    System.out.println("环节名称：" + task.getName());
    // 认领任务
    taskService.claim(task.getId(), "A");
}
```

认领任务是先到先得，一旦一个用户认领了，任务表中`act_ru_task`的`Assignee`就会更新为该用户，其他用户无法认领

#### 4. 候选人归还任务
* 当用户认领任务后不想操作，那么可以归还任务
* 归还后，`act_ru_task`的`Assignee`表清空，所有候选人可以重新认领
* 注意：查询候选人任务用`taskCandidateUser()`、处理人任务用`taskAssignee()`、用`taskCandidateOrAssigned()`都可以查出

```
Task task = taskService.createTaskQuery().taskAssignee("A").singleResult();
if (task != null) {
    taskService.unclaim(task.getId());
}
```


#### 5. 第一环节完成任务
```
Map<String, Object> variables = new HashMap<>();
variables.put("candidateGroup", "group_1");
taskService.complete("task1-id-xxxxxx", variables);
```

* 第二环节处理人为候选组变量，所以变量中需要传候选组`id`
* 候选组为 `flowable-ui` 中的用户组
* 此时`act_ru_task`中第二个环节任务数据已存在，但是处理人`Assignee`为空
* 候选组在`act_ru_identitylink`表，通过`GROUP_ID_`关联`act_ru_task`任务 


#### 6. 候选组中用户查询任务、认领任务
```
Group group = identityService.createGroupQuery().groupId("group_1").singleResult();
List<Task> list = taskService.createTaskQuery().taskCandidateGroup(group.getId()).list();
for (Task task : list) {
    System.out.println("任务id：" + task.getId());
    System.out.println("环节名称：" + task.getName());
    // 认领任务
    taskService.claim(task.getId(), "user_1");
}
```

* 候选组认领任务也是先到先得，此时任务表中`act_ru_task`的`Assignee`就会更新为该用户，其他用户无法认领

#### 7. 第二环节完成任务
```
taskService.complete("task2-id-xxxxxx");
```
