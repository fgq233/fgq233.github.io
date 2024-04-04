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
Flowable官方提供了一个基于web应用的流程设计器 flowable-ui，用于流程相关的操作，具体提供了如下功能：
* `Task` **任务应用程序**
* `Modeler` **建模器应用程序**，创建流程模型、表单、选择表与应用定义
* `Admin` **管理员应用程序** 
* `IDM` **身份管理应用程序**，管理用户、用户组、权限

几个应用都需要`IDM`提供认证才能使用


![](https://fgq233.github.io/imgs/workflow/flow01.png)



