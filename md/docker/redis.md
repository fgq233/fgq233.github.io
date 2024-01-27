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
mkdir -p /app/redis/data
```


#### 4. 宿主机配置文件创建 vim /app/redis/redis.conf
```
# AOF持久化
appendonly yes

# 访问密码
requirepass 123456

# 默认127.0.0.1只能本地访问
bind * -::*
```


#### 5. 启动容器并挂载数据卷
```
docker run \
  --name redisX \
  --privileged=true \
  -d \
  -p 6379:6379 \
  -v /app/redis/data:/data \
  -v /app/redis/redis.conf:/etc/redis/redis.conf \
  redis:6.2.1 redis-server /etc/redis/redis.conf
```


#### 6. 查看进程
```
docker ps
```


#### 7. 进入容器内部登录redis测试
```
docker exec -it redisX /bin/bash

redis-cli -p 6379 -a 123456

set name fgq

get name

exit
```
