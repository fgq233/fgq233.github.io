###  用户任务委派、转办

#### 一、委派、转办
![](https://fgq233.github.io/imgs/workflow/flow41.png)

第1个用户任务分配用户 A，第2个用户任务分配用户 B

#### 1、委派
* 将任务节点分给其他人处理，等其他人处理好之后，委派任务还会自动回到委派人的任务中


| 环节                     | `act_ru_task.OWNER_ ` | `act_ru_task.Assignee` | 说明                    |
|------------------------|-----------------------|------------------------|-----------------------|
| 启动流程实例后                | 空                     | `A`                    |                       |
| A委派任务给B后`delegateTask` | `A`                   | `B`                    | 委托后A查询不到任务，B可以查询到     |
| B处理任务后`resolveTask`    | `A`                   | `A`                    |                       |
| A完成任务后`complete`    |              |                    | 第一条用户任务数据删除，出现第二条任务数据 |

* 启动流程实例后，第一个任务 `act_ru_task.OWNER_` 为空，`act_ru_task.Assignee` 为 A
* 委派给用户B，此时第一个任务 `act_ru_task.OWNER_` 为A，`act_ru_task.Assignee` 为 B，a
* 用户B处理任务

```
// 委派任务
taskService.delegateTask(taskId1, "B");

// 被委派的用户处理任务
taskService.resolveTask(taskId1);

// 拥有者完成任务
taskService.complete(taskId1);
```

#### 2、转办
* 直接将办理人`Assignee`换成别人，这时任务的拥有着不再是转办人，而是为空，相当与将任务转出



```

```



