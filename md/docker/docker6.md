### Docker-Compose
* Docker-Compose负责容器集群的快速编排，用来快速部署分布式应用，无需手动一个个创建和运行容器
* 文档：[https://docs.docker.com/compose/]()

### 一、 docker-compose 安装
#### 1. 下载docker-compose
* 文档：[https://docs.docker.com/compose/install/]()
* 注意：docker-compose 与 Docker引擎有对应关系
* 若下载失败，可离线安装
  * [https://github.com/docker/compose/releases/]() 下载对应版本
  * 将文件重命名为 `docker-compose`，然后上传至 /usr/local/bin

```
curl -SL https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

#### 2. 添加可执行权限
```
chmod +x /usr/local/bin/docker-compose
```

#### 3. 查看版本，检测是否安装成功
```
docker-compose version
```

#### 4. 卸载
```
rm /usr/local/bin/docker-compose
```


### 二、 docker-compose容器编排
#### 1. 核心概念
* `docker-compose.yml`
* 服务 `service`：一个个容器的实例，如：redis、mysql、nginx、用户服务、订单服务
* 工程 `project`：一组关联的应用容器组成的一个完整业务单元，在`docker-compose.yml`文件中定义

#### 2. 使用步骤
* 编写各个微服务的`Dockerfile`，构建对应的镜像文件
* 使用`docker-compose.yml`定义一个完整业务单元，整理好各个容器服务
* 最后使用 `docker-compose up` 命令来启动整个微服务应用程序，完成一键部署

#### 3. docker-compose 常用命令
```
docker-compose -h       查看帮助
docker-compose up       启动所有服务
docker-compose up -d    启动所有服务并后台运行
docker-compose down     停止并删除容器、网络、数据卷、镜像
docker-compose ps       展示当前所有编排运行的容器
docker-compose top      展示当前所有编排运行的容器进程

docker-compose restart  重启服务
docker-compose start    启动服务
docker-compose stop     停止服务

docker-compose exec yml里面的服务id     进入容器内部
docker-compose exec yml里面的服务id     查看容器输出日志
docker-compose config                 检查配置
docker-compose config -q              检查有问题的配置，没问题则无任何输出
```



### 三、 一键部署
#### 1. SpringBoot 项目打包，编写Dockerfile，制作镜像
参考 [自定义镜像](https://fgq233.github.io/md/docker/docker5)

#### 2. docker中安装 MySQL8、Redis 镜像
* 参考 [mysql8](https://fgq233.github.io/md/docker/mysql8)
* 参考 [redis](https://fgq233.github.io/md/docker/redis)

#### 3. vim docker-compose.yml
```
version: "3"
services:
  redis:
    image: redis:6.2.1
    ports:
      - "6379:6379"
    volumes:
      - "/usr/local/redis/redis.conf:/etc/redis/redis.conf"
      - "/usr/local/redis/data:/data"
    networks:
      - fgq_net
    command: redis-server /etc/redis/redis.conf

  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: 123456
    volumes:
      - "/usr/local/mysql8/conf/my.cnf:/etc/mysql/my.cnf"
      - "/usr/local/mysql8/data:/var/lib/mysql"
      - "/usr/local/mysql8/log:/var/log/mysql"
    networks:
      - fgq_net

  demoService:
    image: demo:1.0
    container_name: demoX
    ports:
      - "8080:8080"
    networks:
      - fgq_net
    depends_on:
      - redis
      - mysql

networks:
  fgq_net:
```


#### 4. 检测 docker-compose.yml 是否有问题
```
docker-compose config -q           
``` 

#### 5. 一键部署
```
docker-compose up -d
```    
