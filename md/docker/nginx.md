### Docker 中 Nginx 安装
#### 1. 拉取镜像
```
docker pull nginx
```


#### 2. 查看镜像
```
docker images nginx
```


#### 3. 宿主机html目录创建
```
mkdir -p /app/nginx/html
```


#### 4. 启动容器
```
docker run \
  --name fgq-nginx \
  --privileged=true \
  -d \
  -p 80:80 \
  -v /app/nginx/html:/usr/share/nginx/html \
  nginx:latest
```


#### 5. 查看运行的容器
```
docker ps
```


#### 6. 将容器内部配置文件复制到宿主机
```
docker cp fgq-nginx:/etc/nginx/nginx.conf /app/nginx/nginx.conf
```


#### 7. 删除容器
```
docker rm -f fgq-nginx
```


#### 8. 再次启动容器(挂载2个数据卷)
```
docker run \
  --name ng \
  --privileged=true \
  -d \
  -p 80:80 \
  -v /app/nginx/html:/usr/share/nginx/html \
  -v /app/nginx/nginx.conf:/etc/nginx/nginx.conf \
  nginx:latest
```
