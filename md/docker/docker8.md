### 可视化工具 Portainer
[官网](https://www.portainer.io/)

### 一、 安装
#### 1. 创建 portainer 数据卷目录
```
mkdir -p /usr/local/portainer
```


#### 2. 拉取镜像
```
# 官方版本
docker pull portainer/portainer-ce

# 汉化版本(可能不支持最新版本)
docker pull 6053537/portainer-ce
```

#### 3. 运行容器
```
# 官方版本
docker run -d  --name portainer  --restart=always \
    -p 8000:8000 \
    -p 9000:9000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /usr/local/portainer:/data \
    portainer/portainer-ce:latest
    
# 汉化版本 
docker run -d  --name portainer-zh  --restart=always \
    -p 8000:8000 \
    -p 9000:9000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /usr/local/portainer:/data \
    6053537/portainer-ce:latest
```

#### 4. 访问
* 访问地址：ip:9000
* 首次访问需要设置 admin 的密码
