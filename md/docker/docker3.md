### Docker 镜像、容器常用命令
![](https://fgq233.github.io/imgs/docker/docker3.png)

### 一、镜像常用命令
镜像名称一般分两部分组成：[repository]:[tag]，没有指定tag时，默认是latest，代表最新版本镜像

* docker bulid：通过`docker bulid`命令、Dockerfile文件来构建一个镜像
* docker push：推送镜像到服务
* docker pull：从镜像服务器拉去镜像
* docker images：查看已经构建的镜像
* docker rmi：删除某个构建的镜像
* docker save：将镜像保存为一个压缩包
* docker load：将压缩包加载为镜像
* docker system df：查看镜像/容器/数据卷的个数、所占空间
* `docker --help`：查看帮助
  * 查看`images`命令帮助 `docker images --help`
  * 查看`save`令帮助 `docker save --help`


### 二、容器常用命令
容器有三个状态：运行、暂停、停止

* docker run：创建并运行一个容器，处于运行状态
* docker pause：暂停容器
* docker unpause：容器从暂停状态恢复运行
* docker stop：停止容器
* docker start：启动容器
* docker restart：重启容器重启
* docker kill：强制停止容器


* docker ps：查看容器、状态
  * `docker ps` 查看运行的容器
  * `docker ps -a` 查看所有容器
* docker logs：查看容器运行日志
* docker exec：进入容器执行指令
* docker rm：删除指定容器


* docker cp 容器ID:容器内路径 目的主机路径
  * 作用：将容器内资料复制到宿主机
  * 示例：`docker cp fgq666:/usr/local/x.txt  /tmp/x.txt`
* docker export 容器ID > 文件名.tar
  * 作用：备份容器内容为tar文件
  * 示例：`docker export 05f8fb76ff48  > /tmp/xxx.tar`
* docker import 文件名.tar 新镜像名:版本号
  * 作用：从tar文件创建一个新的镜像，镜像将保存之前容器中所有文件
  * 示例：`docker import /tmp/xxx.tar my-nginx:1.0`
  * 注意：重新导入的镜像，运行时一般需要带上之前容器的`COMMAND`，查看之前容器的COMMAND使用：`docker ps --no-trunc`

### 三、镜像使用示例
```
docker pull nginx
docker images
docker save -o nginx.tar nginx:latest
docker rmi nginx:latest
docker load -i nginx.tar
```

### 四、容器使用示例
容器的使用一般需要参考官网使用文档

#### 1. 创建并运行一个容器
```
docker run -d -p 80:80 --name ng nginx:latest
```

* `-d`：后台运行容器
* `-p` ：将宿主机端口与容器端口映射，左侧是宿主机端口，右侧是容器端口
* `--name` : 给容器起一个名字，比如叫做ng
* `nginx:latest`：镜像名称

#### 2. 查看所有运行的容器、运行日志
```
docker ps
docker logs ng
```

#### 3. 进入容器内部
```
docker exec -it ng bash 
```

* `-it` : 给当前进入的容器创建一个标准输入、输出终端，允许我们与容器交互
* `ng` ：容器的名称
* `bash`：进入容器后执行的命令，bash是一个linux终端交互命令

#### 4. 容器内部操作
容器内部其实是一个简版Linux目录结构

```
cd /usr/share/nginx/html
ls

# 修改 index.html 内容
sed -i 's#Welcome to nginx#fgq运行的Nginx容器#g' index.html
sed -i 's#<head>#<head><meta charset="utf-8">#g' index.html
```


#### 5. 退出容器内部
```
exit
```

#### 6. 停止、启动容器运行
```
docker stop ng
docker start ng
```

#### 7.删除容器
```
# 不能删除运行中的
docker rm ng

# 强制删除，可以是运行中的
docker rm -f ng
```
