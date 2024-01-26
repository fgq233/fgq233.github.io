### Docker 自定义镜像
### 一、Dockerfile 
#### 1. 镜像结构
镜像是分层结构，每一层称为一个Layer
* BaseImage层：包含基本的系统函数库、环境变量、文件系统
* Entrypoint：入口，是镜像中应用启动的命令
* 其它：在BaseImage基础上添加依赖、安装程序、完成整个应用的安装和配置

自定义镜像只需告诉Docker下列信息，之后Docker会帮助我们构建镜像：
* 镜像的组成
* 需要哪些BaseImage
* 需要拷贝什么文件
* 需要安装什么依赖
* 启动脚本是什么


#### 2. Dockerfile
一个文本文件，包含多个**指令(Instruction)**， 用指令来说明要执行什么操作来构建镜像，每一个指令都会形成一层Layer


#### 3. Dockerfile 中常用指令

| 指令         | 作用                                             | 示例                                      |
|------------|:-----------------------------------------------|:----------------------------------------|
| FROM       | 指定基础镜像，必须在第一行，表明当前镜像时基于哪个镜像的                   | FROM java:8                             |
| ENV        | 设置环境变量，可在后面指令中通过$引用                            | ENV JAVA_DIR=/usr/local                 |
| RUN        | 执行Linux的shell命令，在bulid镜像时运行                    | RUN cd $JAVA_DIR、RUN yum -y install vim |
| EXPOSE     | 当前容器对外暴露的端口                                    | EXPOSE 8080                             |
| MAINTAINER | 镜像维护者信息                                        | MAINTAINER fgq                          |
| WORKDIR    | 指定在创建容器后，宿主机登录进来的默认工作目录                        | WORKDIR $JAVA_DIR                       |
| USER       | 镜像以什么用户执行，默认root                               |                                         |
| VOLUME     | 容器的数据卷                                         ||
| ADD        | 将宿主机文件拷贝到镜像指定目录，会自动处理URL和解压tar压缩包              | ADD ./jdk8.tar.gz $JAVA_DIR/            |
| COPY       | 将宿主机文件拷贝到镜像指定目录                                | COPY ./jdk8.tar.gz $JAVA_DIR/           |
| CMD        | 容器 docker run启动后要做的事                           |  |
| ENTRYPOINT | 容器 docker run启动后要做的事 |      |


#### 3. CMD、ENTRYPOINT区别
* CMD 
  * Dockerfile中可以有多个 CMD 指令，但是只有最后一个生效
  * CMD 指令会被docker run后面的命令覆盖，如：`docker run -it -p 8080:8080 tomcat8 /bin/bash` 只会启动容器，但是tomcat没有启动，因为默认`CMD ["catalina.sh","run"]` 没有生效
* ENTRYPOINT 
  * 类似 CMD，但是ENTRYPOINT不会被 docker run后面的命令覆盖
  * ENTRYPOINT 可以与CMD一起使用，一般是变参使用 CMD，固定参数使用 ENTRYPOINT
  * 指定 ENTRYPOINT后， CMD含义就发生变化，不再是直接运行其命令，而是将CMD内容作为参数传递给ENTRYPOINT指令


```
FROM nginx

ENTRYPOINT ["nginx", "-c"]
CMD ["/etc/nginx/nginx.conf"]
```


| 指令       | 按照Dockerfile编写执行      | 传参运行                                            |
|----------|:----------------------|:------------------------------------------------|
| Docker命令 | docker run nginx:test | docker run nginx:test -c /etc/conf/mynginx.conf |
| 衍生出的实际命令 | nginx -c  /etc/nginx/nginx.conf            | nginx -c /etc/nginx/mynginx.conf                |



### 二、制作一个SpringBoot项目的镜像
#### 1. SpringBoot项目打包
将项目打包为一个jar包： demo.jar

#### 2. 创建目录、将jar包上传至该目录
```
mkdir -p /usr/local/demo
cd /usr/local/demo
```

#### 3. jar包所在目录编辑Dockerfile
```
vim Dockerfile
```

#### 4. Dockerfile 内容
```
# 基础镜像
FROM java:8

# 作者
MAINTAINER fgq

# 宿主机文件拷贝到容器
COPY ./demo.jar /tmp/demo.jar

# 暴露端口
EXPOSE 8080

# 运行jar包
ENTRYPOINT java -jar /tmp/demo.jar
```


#### 5.制作镜像
```
# .不能去除，表示基于当前目录构建
docker build -t demo:1.0 . 
```


#### 6.运行容器
```
docker run --name demoX -p 8080:8080 -d demo:1.0
```
