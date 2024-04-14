###  Flowable 分配用户
分配用户决定了每个环节的处理人

### 一、三类任务分配方式
![](https://fgq233.github.io/imgs/workflow/flow03.png)


* 身份存储：使用 flowable-ui 中定义好的用户、用户组
* 固定值：使用者自己定义的值
  * 写死的固定用户
  * 表达式：值表达式、方法表达式
* 任务监听器


#### 1. 表达式
```
// 值表达式
${name}
${user.name}

// 方法表达式，其中 user是Spring容器中的Bean对象
${user.name()}                          // 不带参数           
${user.getLeader('fgq')}                // 带字面值参数
${user.doSomething(myVar, execution)}   // 带表达式参数
```


```java
@Component
public class User {
  public String name() { return "CCC"; }
  public String getLeader(String name) { return "CCC";}
}
```

#### 2. 任务监听器
![](https://fgq233.github.io/imgs/workflow/flow04.png)

* 使用Java类作为任务监听器，设置任务处理人
* 监听器事件分为 5 种
  * `create`      当任务环节**创建**时触发
  * `assignment`  当任务环节**分配**时触发
  * `complete`    当**完成**任务环节时触发
  * `delete`      当任务环节**删除**时触发


### 二、测试固定用户、值表达式、方法表达式
![](https://fgq233.github.io/imgs/workflow/flow05.png)

#### 1. 部署流程(略)
#### 2. 启动流程实例
* 若第一个任务环节是固定用户，启动流程无需传递变量
* 若第一个任务环节是表达式，则启动流程时需要传递变量，变量记录在`ACT_RU_VARIABLE`表中

```
runtimeService.startProcessInstanceByKey("X2");

// Map<String, Object> var = new HashMap<>();
// var.put("name", "XXX");
// runtimeService.startProcessInstanceByKey("X2", var);
```

此处由于第一个任务环节是固定用户，无需传递变量


#### 3. AAA 用户完成任务
```
Map<String, Object> variables = new HashMap<>();
variables.put("name", "BBB");
taskService.complete("taskAAAId", variables);
```

下一环节用户为值表达式`${name}`，所以在完成任务时需要传递变量，指定用户


#### 4. BBB 用户完成任务
```
@Component
public class User {
    public String getName() { return "CCC"; }
}

taskService.complete("taskBBBId");
```

下一环节用户为方法表达式`${user.getName()}`，所以需要定义JavaBean注入到Spring容器


#### 5. CCC 用户完成任务
```
public class UserListener implements TaskListener {

    @Override
    public void notify(DelegateTask delegateTask) {
        if (EVENTNAME_CREATE.equals(delegateTask.getName())) {
            // 任务节点的创建时，指定处理人
            delegateTask.setAssignee("DDD");
        }
    }
}

taskService.complete("taskCCCId");
```


下一环节用户为监听器，当环节C完成时，环节D任务创建，监听器触发，指定处理人为 `DDD`


#### 6. DDD 用户完成任务
```
taskService.complete("taskDDDId");
```

所有任务环节完成，流程结束
