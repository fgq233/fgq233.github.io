### Docker 自定义镜像
#### 1. 镜像结构
镜像是分层结构，每一层称为一个Layer
* BaseImage层：包含基本的系统函数库、环境变量、文件系统
* Entrypoint：入口，是镜像中应用启动的命令
* 其它：在BaseImage基础上添加依赖、安装程序、完成整个应用的安装和配置

自定义镜像只需告诉Docker：
* 镜像的组成
* 需要哪些BaseImage
* 需要拷贝什么文件
* 需要安装什么依赖
* 启动脚本是什么
之后来Docker会帮助我们构建镜像


#### 2. Dockerfile
* 一个文本文件，包含多个**指令(Instruction)**， 用指令来说明要执行什么操作来构建镜像，每一个指令都会形成一层Layer
  * `FROM`：指定基础镜像，必须在第一行，基础镜像一般是操作系统，或其他人制作好的镜像，如：openjdk:8
  * `ENV`：设置环境变量，可在后面指令中使用
  * `COPY`：拷贝本地文件到镜像指定目录
  * `RUN`：执行Linux的shell目录，一般是安装过程的命令
  * `EXPOSE`：指定容器运行时监听的端口，是给镜像使用者看的
  * `ENTRYPOINT`：镜像中应用的启动命令，容器运行时调用
  * `MAINTAINER`：可选，指定维护者信息
* 更多指令，参考：https://docs.docker.com/engine/reference/builder
  Dockerfile的第一行必须是FROM，从一个基础镜像来构建

#### 3. 根据 Dockerfile 构建一个SpringBoot项目的镜像
* 项目打包为一个jar包 demo.jar
* 创建目录，在目录中新建Dockerfile文件，内容如下
* 将 demo.jar上传至该目录
* 使用`docker build`命令构建镜像，如：`docker build -t demo:1.0 .` 注意`.`不能去除，表示基于当前目录构建
* 使用`docker run`创建容器并运行，如：`docker run --name demo -p 80:80 -d demo:1.0`


```
FROM centos:7
# 1、配置JDK的安装目录
ENV JAVA_DIR=/usr/local
# 2、拷贝jdk
COPY ./jdk8.tar.gz $JAVA_DIR/
# 3、安装JDK
RUN cd $JAVA_DIR tar -xf ./jdk8.tar.gz && mv ./jdk1.8.0_144 ./java8
# 4、配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin

# 5、拷贝java项目的包
COPY ./demo.jar /tmp/demo.jar
# 6、暴露端口
EXPOSE 8080
# 7、入口，java项目的启动命令
ENTRYPOINT java -jar /tmp/demo.jar
```


* 基于  openjdk:8 简化 Dockerfile

```
FROM openjdk:8
COPY ./demo.jar /tmp/demo.jar
EXPOSE 80
ENTRYPOINT java -jar /tmp/demo.jar
```

