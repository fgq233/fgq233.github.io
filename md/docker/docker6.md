### Docker-Compose
Docker Compose可以基于Compose文件快速部署分布式应用，无需手动一个个创建和运行容器，类似于批量 docker run

### 一、 Docker-Compose 安装
#### 1. 下载
* 命令下载
* 如果下载速度较，可以直接将docker-compose文件上传至`/usr/local/bin/`目录

```
curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

#### 2. 文件添加可执行权限
```
chmod +x /usr/local/bin/docker-compose
```

#### 3. bash命令补全
```
curl -L https://raw.githubusercontent.com/docker/compose/1.29.1/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```

如果这里出现错误，需要修改自己的hosts文件：

```
echo "199.232.68.133 raw.githubusercontent.com" >> /etc/hosts
```


#### 4. 检测版本
```
docker-compose version
```

#### 5. 卸载
```
rm /usr/local/bin/docker-compose
```

### 二、 Compose文件
`docker-compose.yml`是一个文本文件，通过指令定义集群中的每个容器如何运行，示例：

```
version: "3.8"

services:
  nacos:
    image: nacos/nacos-server
    environment:
      MODE: standalone
    ports:
      - "8848:8848"
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - "$PWD/mysql/data:/var/lib/mysql"
      - "$PWD/mysql/conf:/etc/mysql/conf.d/"
  userservice:
    build: ./user-service
  authservice:
    build: ./auth-service
  gateway:
    build: ./gateway
    ports:
      - "80:80"
```

最后使用 `docker-compose up -d` 一键部署