###  用户任务 

#### 1、定义
* 用户任务用于需要人工参与执行的任务
* 用户任务分为3种
  * 一个用户
  * 多个候选用户
  * 候选组
* 注意
  * 用户任务只能有一个办理人`Assignee`，但可以分配多个候选人`CandidateUsers`、候选组`CandidateGroup`
    * 当用户任务有`Assignee`时，只有其可见
    * 若是`CandidateUsers`，则所有候选人可见
    * 若是`CandidateGroup`，则候选组中所有用户可见
  * 可以定义在一个用户任务上同时定义`CandidateUsers`与`CandidateGroups`
  * 当候选人或候选组中用户认领`claim`用户任务后，则该用户变为`Assignee`，只有其可见任务


#### 2、用户任务指派的Flowable扩展
```
<userTask id="theTask" name="my task" flowable:assignee="kermit" />

<userTask id="theTask" name="my task" flowable:candidateUsers="kermit, fozzie" />

<userTask id="theTask" name="my task" flowable:candidateGroups="management, accountancy" />
```


#### 3、用户任务 Java API查询
```
List<Task> tasks = taskService.createTaskQuery().taskAssignee("kermit").list();

List<Task> tasks = taskService.createTaskQuery().taskCandidateUser("fozzie").list();

List<Task> tasks = taskService.createTaskQuery().taskCandidateGroup("management").list();
```



#### 4、使用 Java 任务监听器指派用户
```
<userTask id="task1" name="My task" >
  <extensionElements>
    <flowable:taskListener event="create" class="org.flowable.MyAssignmentHandler" />
  </extensionElements>
</userTask>


public class MyAssignmentHandler implements TaskListener {

  public void notify(DelegateTask delegateTask) {
    // 在这里执行自定义身份查询
    // 然后调用如下命令：
    delegateTask.setAssignee("kermit");
    delegateTask.addCandidateUser("fozzie");
    delegateTask.addCandidateGroup("management");
    ...
  }

}
```
