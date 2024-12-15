###  中间补偿投掷事件 

#### 1. 作用
用于触发补偿

#### 2. 触发补偿
既可以为设计的活动触发补偿，也可以为补偿事件所在的范围触发补偿

* 活动抛出补偿时，活动关联的补偿处理器将执行的次数，为活动成功完成的次数

* 抛出补偿时，当前范围中所有的活动，包括并行分支上的活动都会被补偿

* 补偿分层触发：如果将要被补偿的活动是一个子流程，则该子流程中所有的活动都会触发补偿。
如果该子流程有嵌套的活动，则会递归地抛出补偿。
然而，补偿不会传播至流程的上层：如果子流程中触发了补偿，该补偿不会传播至子流程范围外的活动。
BPMN规范指出，对“与子流程在相同级别”的活动触发补偿。

* 在Flowable中，补偿按照执行的相反顺序运行，这意味着最后完成的活动会第一个补偿。

* 可以使用补偿抛出中间事件补偿已经成功完成的事务子流程



参考[边界补偿事件](https://fgq233.github.io/md/workflow/flowable13-5)

![](https://fgq233.github.io/imgs/workflow/flow27.png)


