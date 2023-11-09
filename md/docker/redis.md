### Docker 中 Redis 安装
#### 1. 拉取镜像
```
docker pull redis:6.2.1
```

#### 2. 查看镜像
```
docker images redis
```

#### 3. 宿主机数据目录创建
```
mkdir -p /usr/local/redis
mkdir -p /usr/local/redis/data
```

#### 4. 下载同版本redis安装包，解压，并将配置文件上传至 /usr/local/redis
```
# 进入目录
cd /usr/local/redis

# 下载安装包至当前目录
wget http://download.redis.io/releases/redis-6.2.1.tar.gz

# 解压
tar -zxvf redis-6.2.1.tar.gz

# 复制配置文件
cp redis-6.2.1/redis.conf ./
```

#### 5. 修改配置文件内容 vim redis.conf
```
# 默认127.0.0.1只能本地访问
bind * -::*

# 后台运行设置为no，因为与 -d 冲突
daemonize no

# 访问密码
requirepass 123456
```

#### 6. 启动容器并挂载数据卷
```
docker run \
  --name redisX \
  --privileged=true \
  -d \
  -p 6379:6379 \
  -v /usr/local/redis/redis.conf:/etc/redis/redis.conf \
  -v /usr/local/redis/data:/data \
  redis:6.2.1 redis-server /etc/redis/redis.conf
```


#### 7. 查看进程
```
docker ps
```

#### 8. 进入容器内部登录redis测试
```
docker exec -it redisX /bin/bash

redis-cli -a 123456

set name fgq

get name

exit
```