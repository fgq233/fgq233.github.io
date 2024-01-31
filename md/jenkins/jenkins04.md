### Jenkins + Gitlab  + Maven 自动构建 jar 包
新建 Item (Maven 项目)
### 一、 Item 配置
#### 1. 源码管理
* 选择git，填入gitlab项目地址
* 指定分支

![7](https://fgq233.github.io/imgs/jenkins/007.jpg)

#### 2. Pre Steps
构建的前置步骤

#### 3. Bulid
配置源码中 pom.xml 路径

#### 4. Post Steps
构建的后置步骤，此处选择 `Send files or execute commands over SSH`，传输文件到另外一台SSH服务器
* `Source files` Jenkins 构建后要传输到目标服务器的文件，可以使用通配符
* `Remote directory` 要传输到目标服务器的路径
* `Exec command`     传输后在目标服务器要执行的命令

![8](https://fgq233.github.io/imgs/jenkins/008.jpg)
![9](https://fgq233.github.io/imgs/jenkins/009.jpg)


### 二、 构建
![10](https://fgq233.github.io/imgs/jenkins/010.png)

* 点击绿色按钮开始构建
* 构建时，会把Gitlab项目源码下载到 `/root/.jenkins/workspace` 目录下
* 构建过程
  * 拉取 Gitlab 项目源码
  * 根据项目 pom.xml 下载依赖
  * 打包，打好的包在 `/root/.jenkins/workspace/test/target/SpringBootTest-0.0.1-SNAPSHOT.jar`
* 执行后置步骤
  * 将打好的jar包传输到目标服务器 (`/root/app/target/SpringBootTest-0.0.1-SNAPSHOT.jar`)
  * 目标服务器运行命令，启动jar



systemctl stop firewalld
systemctl disable firewalld
