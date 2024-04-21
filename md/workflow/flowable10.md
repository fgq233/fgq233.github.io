###  Flowable 网关
网关用来控制流程的流向

### 一、排他网关
* 特点：对排他网关所有分支的条件进行判断，选择第一个条件计算为true的分支进行后续环节
* 注意
  * 当没有设置条件时，默认分支判断结果为true
  * 当有多个分支结果为true时，会选择XML中最先定义的分支继续流程
  * 如果没有可选的分支，会抛出异常

![](https://fgq233.github.io/imgs/workflow/flow08.png)

```
Map<String, Object> var = new HashMap<>();
var.put("num", 2);
taskService.complete("task1_id_......", var);
```

* 如图：两个分支条件分别是`${num < 3}、${num >= 3}`
* 当员工请假分支在完成任务时，传入网关判断需要的变量，进行结果为`true`的后续环节

