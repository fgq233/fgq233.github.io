### Jenkins 触发器 + Gitlab 钩子  自动构建项目
新建 Item (Maven 项目)
### 一、 远程构建
![11](https://fgq233.github.io/imgs/jenkins/011.png)

#### 1. Jenkins 已登录
* `JENKINS_URL/job/test/build?token=TOKEN_NAME 或者 /buildWithParameters?token=TOKEN_NAME`
* 示例：`http://192.167.18.131:8080/job/test/build?token=666666`，请求该链接会触发构建 
  * test 是项目 Item 名称
  * token 是身份验证令牌


#### 2. Jenkins 未登录
* 安装 Build Authorization Token Root 插件 
* 请求链接 `JENKINS_URL/buildByToken/build?job=NAME&token=SECRET` 会触发构建
* job 是项目 Item 名称
* token 是下面填入的
* 示例：`http://192.167.18.131:8080/job/test/build?token=666666`，在浏览器访问该链接会触发构建
  * test 是项目 Item 名称
  * token 是身份验证令牌
