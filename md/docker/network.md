### docker network
#### 1. docker network 作用
* 容器之间的互联、通信以及端口映射
* 容器IP变动时候可以通过服务名直接网络通信

#### 2. 查看 docker network 所有命令
```
docker network --help
```

* `docker network connect`     连接一个网络
* `docker network create`      创建一个网络
* `docker network disconnect`  断开和网络连接
* `docker network inspect`     查看网络具体信息
* `docker network ls`          查看网络
* `docker network prune`       删除无用网络
* `docker network rm`          删除网络



#### 2. docker network ls 查看网络模式
```
# 默认网络模式

NETWORK ID     NAME      DRIVER    SCOPE
00add3873772   bridge    bridge    local
84fb4788119f   host      host      local
9e5570703f0e   none      null      local
```

* `bridge`     为每一个容器分配、设置IP，并将容器连接到 docker0网桥（**虚拟网桥,默认为该模式**）
* `host`     容器直接使用宿主机的IP、端口
* `none`     容器有独立的 network namespace，但没有具体设置（**基本不用**）
* `container`     新创建的容器不会创建自己的网卡和配置自己的IP，而是和一个指定的容器共享IP、端口范围
* 自定义网络，本身维护好了主机名与IP对应关系，在容器内部使用IP、域名可以各自ping通（**一个docker中有多个容器时使用**）
  * `docker network create fgq`
  * `docker run -d -p 80:80 --network fgq --name ng nginx:latest `



