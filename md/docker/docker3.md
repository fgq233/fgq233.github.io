### Docker 镜像、容器常用命令
![](https://fgq233.github.io/imgs/docker/docker3.png)

### 一、镜像常用命令
* 镜像名称一般分两部分组成：[repository]:[tag]
* 在没有指定tag时，默认是latest，代表最新版本的镜像

#### 1. docker bulid
* docker bulid：通过`docker bulid`命令、Dockerfile文件来构建一个镜像
* docker push：推送镜像到服务
* docker pull：从镜像服务器拉去镜像
* docker images：查看已经构建的镜像
* docker rmi：删除某个构建的镜像
* docker save：将镜像保存为一个压缩包
* docker --help：查看帮助
  * 查看`images`命令帮助 `docker images --help`
  * 查看`save`令帮助 `docker save --help`


### 二、容器常用命令
容器有三个状态：运行、暂停、停止

* docker run：创建并运行一个容器，处于运行状态
* docker pause：让一个运行的容器暂停
* docker unpause：让一个容器从暂停状态恢复运行
* docker stop：停止一个运行的容器
* docker start：让一个停止的容器再次运行


* docker ps：查看容器、状态
  * `docker ps` 查看运行的容器
  * `docker ps -a` 查看所有容器
* docker logs：查看容器运行日志
* docker exec：进入容器执行指令
* docker rm：删除指定容器




### 三、容器使用示例
```
docker pull nginx
docker images
docker save -o nginx.tar nginx:latest
docker rmi nginx:latest
docker load -i nginx.tar
```

### 四、镜像使用示例
容器的使用一般需要参考官网使用文档

#### 1. 创建并运行一个容器
```
docker run -d -p 80:80 --name fgq-ng nginx:latest
```

* `-d`：后台运行容器
* `-p` ：将宿主机端口与容器端口映射，左侧是宿主机端口，右侧是容器端口
* `--name` : 给容器起一个名字，比如叫做fgq-ng
* `nginx:latest`：镜像名称

#### 2. 查看所有运行的容器、运行日志
```
docker ps
docker logs fgq-ng
```

#### 3. 进入容器内部
```
docker exec -it fgq-ng bash 
```

* `-it` : 给当前进入的容器创建一个标准输入、输出终端，允许我们与容器交互
* `fgq-ng` ：容器的名称
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
docker stop fgq-ng
docker start fgq-ng
```

#### 7.删除容器
```
# 不能删除运行中的
docker rm fgq-ng

# 强制删除，可以是运行中的
docker rm -f fgq-ng
```