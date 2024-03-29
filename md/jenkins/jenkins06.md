### Jenkins 触发器 + Gitlab 钩子  自动化构建项目
### 一、 触发远程构建
![11](https://fgq233.github.io/imgs/jenkins/011.png)

#### 1. Jenkins 已登录
* `JENKINS_URL/job/test/build?token=TOKEN_NAME 或者 /buildWithParameters?token=TOKEN_NAME`
* 示例：`http://192.167.18.131:8080/job/test/build?token=666666`，请求该URL会触发构建 
  * test 是项目 Item 名称
  * token 是身份验证令牌


#### 2. Jenkins 未登录
* 安装 `Build Authorization Token Root` 插件 
* 请求链接 `JENKINS_URL/buildByToken/build?job=NAME&token=SECRET` 会触发构建
* 示例：`http://192.167.18.131:8080/buildByToken/build?job=test&token=666666`
   


#### 3. Gitlab 添加 Webhooks
![12](https://fgq233.github.io/imgs/jenkins/012.png)

URL 中填入触发构建的URL，当触发来源做出勾选中的动作，即可完成自动构建


### 二、 其他自动构建触发器
#### 1. Build whenever a SNAPSHOT dependency is built
当依赖的快照构建时，执行构建job

#### 2. Build after other projects are built
在其他项目构建后，执行构建job

#### 3. Build periodically
使用 Cron 表达式定期构建

#### 4. GitHub hook trigger for GITScm polling
GitHub 项目 hook 触发时，执行构建job

#### 5. Poll SCM
使用 Cron 表达式定期检查代码是否发生变化，执行构建job
















