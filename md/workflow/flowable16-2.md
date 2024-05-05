###  结束终止事件 

#### 1. 作用
提前结束流程
* 当到达终止结束事件时，会判断第一个范围 scope（流程或子流程）并终止它
* 可选属性：终止所有`terminateAll`，当其为true时，则直接终止顶层流程实例

#### 2. 流程图
![](https://fgq233.github.io/imgs/workflow/flow33.png)



#### 3. 测试
```
repositoryService.createDeployment()
        .addClasspathResource("xml/EndErrorEvent.bpmn20.xml")
        .name("结束终止事件")
        .deploy();
runtimeService.startProcessInstanceByKey("EndErrorEvent");


Map<String, Object> var  = new HashMap<>();
var.put("num", 80);
taskService.complete("人工任务3 taskId", var);
Thread.sleep(Integer.MAX_VALUE);
```

* 启动流程实例后，act_ru_task 出现3条任务
* 完成人工任务3，传入符合结束终止事件的变量，则流程终止，另外2条任务消失
