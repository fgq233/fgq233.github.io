###  Flowable 数据库常用表的作用
* `ACT_GE_` (General)，通用数据
* `ACT_RE_` (Repository)，流程定义和流程静态资源
* `ACT_RU_` (Runtime)，运行时的表，包含流程实例、任务、变量、异步任务，在流程实例结束时会删除数据
* `ACT_HI_` (History)，历史数据，如历史流程实例、变量，任务...
* `ACT_ID_` (Identity)，身份信息，如用户、用户组

### 一、General

| 表名               | 作用               |
|------------------|------------------|
| `ACT_GE_BYTEARRAY` | 通用的流程定义和流程资源  |
| `ACT_GE_PROPERTY`  | 系统相关属性           |


### 二、Repository

| 表名                  | 作用               |
|---------------------|------------------|
| `ACT_RE_DEPLOYMENT` | 部署信息     |
| `ACT_RE_MODEL`      | 模型信息           |
| `ACT_RE_PROCDEF`    | 已部署的流程定义           |

`ACT_RE_DEPLOYMENT`和 `ACT_RE_PROCDEF` 是一对多，因为一次可以部署多个流程

### 三、Runtime

| 表名                      | 作用                        |
|-------------------------|---------------------------|
| `ACT_RU_EVENT_SUBSCR`   | 运行时事件                     |
| `ACT_RU_EXECUTION`      | 运行时流程执行实例                 |
| `ACT_RU_IDENTITYLINK`   | 运行时用户关系信息，存储任务节点与参与者的相关信息 |
| `ACT_RU_JOB`            | 运行时作业                     |
| `ACT_RU_SUSPENDED_JOB`  | 暂停作业表                     |
| `ACT_RU_TIMER_JOB`      | 定时作业表                     |
| `ACT_RU_HISTORY_JOB`    | 历史作业表                     |
| `ACT_RU_TASK`           | 运行时任务                     |
| `ACT_RU_VARIABLE`       | 运行时变量表                    |
| `ACT_RU_DEADLETTER_JOB` | 正在运行的任务表                    |



启动一个流程实例的时候涉及到的表有
* ACT_RU_EXECUTION 
* ACT_RU_TASK 
* ACT_RU_VARIABLE 
* ACT_RU_IDENTITYLINK 


### 四、ACT_HI

| 表名                    | 作用                        |
|-----------------------|---------------------------|
| `ACT_HI_ACTINST`      | 历史的流程实例                     |
| `ACT_HI_ATTACHMENT`   | 历史的流程附件                 |
| `ACT_HI_COMMENT`      | 历史的说明性信息 |
| `ACT_HI_DETAIL`       | 历史的流程运行中的细节信息    |
| `ACT_HI_IDENTITYLINK` | 历史的流程运行过程中用户关系            |
| `ACT_HI_PROCINST`     | 历史的流程实例                    |
| `ACT_HI_TASKINST`     | 历史的任务实例                    |
| `ACT_HI_VARINST`      | 历史的流程运行中的变量信息      |


### 五、Identity

| 表名                    | 作用                        |
|-----------------------|---------------------------|
| `ACT_ID_BYTEARRAY`    | 二进制数据表                     |
| `ACT_ID_GROUP`        | 用户组信息表                 |
| `ACT_ID_INFO`         | 用户信息详情表 |
| `ACT_ID_MEMBERSHIP`   | 人与组关系表    |
| `ACT_ID_PRIV`         | 权限表            |
| `ACT_ID_PRIV_MAPPING` | 用户或组权限关系表                    |
| `ACT_ID_PROPERTY`     | 属性表                    |
| `ACT_ID_TOKEN`        | 记录用户的token信息      |
| `ACT_ID_USER`         | 用户表      |



