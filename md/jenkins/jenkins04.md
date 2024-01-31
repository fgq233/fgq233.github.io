### Jenkins + Gitlab  + Maven 自动构建 jar 包
### 一、新建 Item (Maven 项目)
#### 1. Item 配置 - 源码管理
* 选择git，填入gitlab项目地址
* 指定分支

![7](https://fgq233.github.io/imgs/jenkins/007.jpg)

#### 2. Item 配置 - Pre Steps
* 构建的前置步骤

#### 3. Item 配置 - Bulid
配置 pom.xml 路径配置

#### 4. Item 配置 - Post Steps
构建的后置步骤
* 选择 `Send files or execute commands over SSH`，传输文件到另外一台SSH服务器
* 选择 `Send files or execute commands over SSH`，传输文件到另外一台SSH服务器

![8](https://fgq233.github.io/imgs/jenkins/008.jpg)
![9](https://fgq233.github.io/imgs/jenkins/009.jpg)



#### 2. 构建
![10](https://fgq233.github.io/imgs/jenkins/010.jpg)

* 点击绿色按钮开始构建
* 构建时，会把Gitlab项目源码下载到 `/root/.jenkins/workspace` 目录下
* 构建过程
  * 拉取 Gitlab 项目源码
  * 根据项目 pom.xml 下载依赖
  * 打包，打好的包在 `/root/.jenkins/workspace/test/target/SpringBootTest-0.0.1-SNAPSHOT.jar`
* 手动启动测试 `java -jar SpringBootTest-0.0.1-SNAPSHOT.jar --server.port=9000`



