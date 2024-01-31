### Jenkins 使用 Gitlab API token 认证
* Dashboard > Manage Jenkins > Credentials 有多种配置认证方式
  * `Username with password`
  * `SSH Username with private key`
  * `GitLab API token` 安装Gitlab相关插件后出现该方式

#### 1. Gitlab 添加访问令牌
登录Gitlab界面，点击个人头像图标 - 设置 - 访问令牌来添加访问令牌
![1](https://fgq233.github.io/imgs/jenkins/001.jpg)
![2](https://fgq233.github.io/imgs/jenkins/002.jpg)
![3](https://fgq233.github.io/imgs/jenkins/003.jpg)


#### 2. Jenkins 添加 Gitlab 认证信息
登录Jenkins，点击 `Dashboard > Manage Jenkins > Credentials` 添加认证信息，将上面访问令牌填入其中

![4](https://fgq233.github.io/imgs/jenkins/004.jpg)
![5](https://fgq233.github.io/imgs/jenkins/005.jpg)

#### 3. Jenkins 集成 Gitlab
登录Jenkins，点击 `Dashboard > Manage Jenkins > Syetem`

![6](https://fgq233.github.io/imgs/jenkins/006.jpg)
