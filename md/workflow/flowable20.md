###  用户任务委派、转办

![](https://fgq233.github.io/imgs/workflow/flow41.png)

第1个用户任务分配用户 A，第2个用户任务分配用户 B

#### 1、委派
* 将任务节点分给其他人处理，等其他人处理好之后，委派任务还会自动回到委派人的任务中

```
// 委派任务
taskService.delegateTask(taskId1, "B");

// 被委派的用户 B 处理任务
taskService.resolveTask(taskId1);

// A 完成任务
taskService.complete(taskId1);
```

#### 2、转办
* 直接将办理人`Assignee`换成别人，相当与将任务转出，原办理人无需完成任务

```
// 转办任务
taskService.setAssignee(taskId2, "C");

// C 完成任务
taskService.complete(taskId2);
```


#### 3、过程

| 环节                     | `act_ru_task.OWNER_ ` | `act_ru_task.Assignee` | 委托状态`act_ru_task.DELEGATION_`  | 说明                    |
|------------------------|----------|------------|---------|-----------------------|
| 启动流程实例后                | 空     | `A`   |    空     | 出现第一条任务数据             |
| A委派任务给B后`delegateTask` | `A`   | `B`   |   `PENDING`  | 委托后A查询不到任务，B可以查询到     |
| B处理任务后`resolveTask`    | `A`    | `A`   |    `RESOLVED`    |                       |
| A完成任务后`complete`       |       |       |  | 第一条用户任务数据删除，出现第二条任务数据 |
| B将任务转办给C               |  空     | `C`     |  | 第一条用户任务数据删除，出现第二条任务数据 |
| C完成任务                  |       |       |     | 第二条用户任务数据删除，流程实例结束    |



