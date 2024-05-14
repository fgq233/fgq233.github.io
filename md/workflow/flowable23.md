###  任务分配给流程发起人

#### 1. 开始节点设置 - 流程发起人
![](https://fgq233.github.io/imgs/workflow/flow48.png)

* `flowable:initiator="INITIATOR"`

#### 2. 任务节点 - 分配给 ${INITIATOR}
![](https://fgq233.github.io/imgs/workflow/flow49.png)

```
<process id="X" name="X" isExecutable="true">
  <startEvent id="sid-XXXX" flowable:initiator="INITIATOR" flowable:formFieldValidation="true"></startEvent>
  <userTask id="sid-YYYY" name="草稿" flowable:assignee="${INITIATOR}" flowable:formFieldValidation="true">
  </userTask>
</process>
```

* `flowable:assignee="${INITIATOR}"`

#### 3. 测试
* 部署流程
* 启动流程实例，设置流程发起人`identityService.setAuthenticatedUserId()`
* 草稿环节办理人 `ASSIGNEE`_ 自动变成流程发起人

```
try {
    identityService.setAuthenticatedUserId("666");
    runtimeService.startProcessInstanceByKey("X");
} finally {
    identityService.setAuthenticatedUserId(null);
}
```

#### 4、避坑
![](https://fgq233.github.io/imgs/workflow/flow50.png)

在固定值中分配给 `${INITIATOR}`，而不是身份存储中的分配给流程发起人

