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


### 3. 其他服务器节点启动成功
![21](https://fgq233.github.io/imgs/jenkins/021.png)

