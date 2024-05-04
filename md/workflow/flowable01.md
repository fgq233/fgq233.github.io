###  Flowable 资源

#### 1. 源码下载
* 官网 [https://www.flowable.com/open-source](https://www.flowable.com/open-source)
* github [https://github.com/flowable/flowable-engine/releases](https://github.com/flowable/flowable-engine/releases)

#### 2. 中文用户手册 v6.3.0
[https://tkjohn.github.io/flowable-userguide/](https://tkjohn.github.io/flowable-userguide/)


#### 3. 流程设计器 flowable-ui 部署
* 源码包解压缩后，路径`flowable-6.7.2/wars`下有`flowable-ui.war`部署包，放入`tomcat`中部署
* 访问地址： http://localhost:8080/flowable-ui/
* 用户名 `admin`，密码 `test`
* 配置文件中 `flowable-ui\WEB-INF\classes\flowable-default.properties`，常用的配置如下
  * 端口
  * 用户名密码
  * 存储的数据库

#### 4. flowable-ui 功能
Flowable官方提供了一个基于web应用的流程设计器 flowable-ui，提供了如下功能：
* `Task` **任务应用程序**，具有启动流程实例，完成任务，以及查询流程实例与任务的功能
* `Modeler` **建模器应用程序**，用来创建流程模型
* `Admin` **管理员应用程序**，流程API端点配置
* `IDM` **身份管理应用程序**，用来管理用户、用户组、权限

几个应用都需要`IDM`提供认证才能使用 

![](https://fgq233.github.io/imgs/workflow/flow01.png)


#### 6. BPMN 流程图基本概念
* 事件：开始、中间、结束
* 活动：用户任务、服务任务、手动任务......
* 结构：子流程
* 网关：排他网关、并行网关、包容网关、事件网关
* 连接对象
  * 顺序流：带箭头的`实心线`
  * 信息流：带箭头的`虚心线`
  * 关联
* 泳道


