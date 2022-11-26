### Nacos  Windows安装指南
#### 1. 下载安装包
* Nacos官网：https://nacos.io
* GitHub主页：https://github.com/alibaba/nacos
* 下载页：https://github.com/alibaba/nacos/releases
* 下载页：https://github.com/alibaba/nacos/releases

#### 2. 解压
将下载的包解压到任意非中文目录下
* bin：启动脚本
* conf：配置文件

#### 3. 端口配置
* Nacos的默认端口是8848
* 进入nacos的conf目录，修改配置文件application.properties中的端口配置server.port

#### 4. 启动
* Nacos 依赖于JDK运行，无论 windows 还是 Linux 都需要安装JDK
* Nacos 默认以集群方式启动 (MODE="cluster")
* 开发时可以单机启动，修改为standalone，或者在bin目录cmd窗口执行命令：

```
  startup.cmd -m standalone
```

#### 5. 访问
* 在浏览器输入地址：http://127.0.0.1:8848/nacos，默认的账号和密码都是nacos


#### 6. 项目中引入 Nacos 依赖
父工程：
```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.5.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```
客户端：
```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

 