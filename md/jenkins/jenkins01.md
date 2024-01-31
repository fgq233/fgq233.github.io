### Gitlab、Jenkins、测试服务器搭建
#### 一、服务器准备 CentOS 7
* Gitlab 服务器：最低配置需要内存4G
* Jenkins 服务器
* 测试服务器

### 二、Gitlab服务器搭建(SSH环境)
#### 1. 服务器搭建
* 官网：`https://about.gitlab.com`
* 搭建文档：`https://gitlab.cn/install/?/version=ce`
* 开放80端口
  * `firewall-cmd --zone=public --add-port=80/tcp --permanent`
  * `firewall-cmd --reload`

#### 2. gitlab 常用命令
```
gitlab-ctl start            启动所有 gitlab 组件
gitlab-ctl stop             停止所有 gitlab 组件
gitlab-ctl restart          重启所有 gitlab 组件
gitlab-ctl status           查看服务状态
gitlab-ctl tail             查看服务日志

vim /etc/gitlab/gitlab.rb   修改默认配置文件
```

搭建完成后，`gitlab-ctl start` 启动所有 gitlab 组件

#### 3. 网页登录
* 登录地址
  * `sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-jh`
  * 搭建时替换 http://gitlab.example.com 的域名或IP就是登录地址
* 账号：`root`
* 密码：存储在 `/etc/gitlab/initial_root_password`，该文件在24h后删除，因此首次登录后需要重置密码(`fgq123456`)

#### 4. 测试 Java 项目提交到 Gitlab
* Gitlab 创建一个空白项目，复制项目https地址 `http://192.167.18.130/root/SpringBootTest.git`
* IDEA 新建项目，关联git
  * VCS - Create Git Repository 
  * 项目名 - Git - Manage Remotes，添加http地址
* 添加代码 commit、push


### 三、Jenkins服务器搭建(SSH环境)
#### 1. 服务器搭建
* 官网：`https://www.jenkins.io/zh/`
* 需要环境：JDK，参考 [Linux下安装Java8](https://fgq233.github.io/md/linux/sf01)
* 搭建文档：https://www.jenkins.io/zh/doc/book/installing/
  * 下载Jenkins WAR包，并上传到服务器，`https://mirrors.jenkins.io/war-stable/`
  * 服务器运行命令 `java -jar jenkins.war` 启动 `jenkins`
  * 浏览 http://ip:8080，登录
  * 进行设置向导进行后续操作，安装插件、创建账号
* 注意开放8080端口
  * `firewall-cmd --zone=public --add-port=9000/tcp --permanent`
  * `firewall-cmd --reload`




### 四、测试服务器
根据程序如何部署决定安装什么软件，如：JDK、Docker、K8S
