### Docker概念
#### 1. 镜像
Docker将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，称为**镜像**

#### 2. 容器
镜像中的应用程序运行后形成的进程就是**容器**，Docker会给容器进程做隔离，避免互相干扰

#### 3. 镜像、容器的本质
* **镜像**是把一个应用在硬盘上的文件、及其运行环境、部分系统函数库文件一起打包形成的文件包，这个文件包是只读的
* **容器**是将这些文件中编写的程序、函数加载到内存中允许，形成进程，只不过要隔离起来，因此一个镜像可以启动多次，形成多个容器进程

![](https://fgq233.github.io/imgs/docker/docker1.png)


#### 4. 镜像网站 DockerHub
* [DockerHub](https://hub-stage.docker.com)是官方的Docker镜像的托管平台，这样的平台称为Docker Registry

* 国内类似于DockerHub 的公开服务
  * [网易云镜像服务](https://c.163yun.com/hub)
  * [阿里云镜像库](https://cr.console.aliyun.com/)

#### 5. Docker架构
* 使用Docker来操作镜像、容器，必须要安装Docker
* Docker是一个CS架构的程序，由两部分组成：
  *  服务端(server)：Docker守护进程，负责处理Docker指令，管理镜像、容器等
  *  客户端(client)：通过命令或RestAPI向Docker服务端发送指令，可以在本地或远程向服务端发送指令

![](https://fgq233.github.io/imgs/docker/docker2.png)

