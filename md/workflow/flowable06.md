###  Flowable 分配用户
分配用户决定了每个环节的处理人

### 一、两类分配用户
![](https://fgq233.github.io/imgs/workflow/flow03.png)
![](https://fgq233.github.io/imgs/workflow/flow04.png)


* 身份存储：使用 flowable-ui 中定义好的用户、用户组
* 固定值
  * 写死的固定用户
  * 表达式
    * 值表达式
    * 方法表达式

#### 1. 值表达式
如：`${name} 、${user.name}`

#### 2. 方法表达式
* 不带参数：要在方法名后添加空括号`()`，防止与值表达式混淆
* 带参数：传递的参数可以是字面值，也可以是表达式，会被自动解析

```
${user.name()}                // 不带参数           
${user.getLeader('fgq')}      // 带字面值参数
${user.doSomething(myVar, execution)}  // 带表达式参数
```

user 是Spring容器中的个Bean对象


```java
@Component
public class User {

    public String name(){
        return "CCC";
    }
    
    public String getLeader(String name){
      return "CCC";
    }
}
```


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


#### 4. CCC 用户完成任务
```
taskService.complete("taskCCCId");
```

下一环节为结束，所以此处无需传递变量
