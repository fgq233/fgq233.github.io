### Jenkins 集群搭建
### 1. 搭建步骤
* 搭建一台 Jenkins 服务器，启动 Jenkins
* 准备好集群中其他几台服务器
* 在启动的 Jenkins 网页中，添加其他服务器节点 `Dashboard > Manage Jenkins > Nodes > New node`

![18](https://fgq233.github.io/imgs/jenkins/018.png)

### 2. 添加其他服务器节点
![19](https://fgq233.github.io/imgs/jenkins/019.png)

![20](https://fgq233.github.io/imgs/jenkins/020.png)

* `Number of executors` 服务器同时可以执行构建的数量
* 用法
  * `Use this node as much as possible` 尽可能多地使用此节点
  * `Only build jobs with label expressions matching this node`  仅与标签匹配的时候使用此节点
* 启动方式，此处选择 `Launch agents via SSH`，使用 SSH 连接其他服务器
  * 主机：节点服务器ip
  * `Credentials`：节点服务器认证


### 3. 等待其他服务器节点启动成功
![21](https://fgq233.github.io/imgs/jenkins/021.png)

### 4. 项目添加其他节点构建
* 在必要的时候并发构建：勾选上之后就会自动分配在哪个节点构建，类似负载均衡的意思
* 限制项目的运行节点：勾选上之后限制具体在哪些节点进行构建

![22](https://fgq233.github.io/imgs/jenkins/022.png)

