### docker搭建私有仓库
#### 1. 拉取 registry 镜像
```
docker pull registry
```


#### 2. 运行容器
```
docker run -d  --name registry  --privileged=true  \
    -p 5000:5000 \
    -v /usr/local/fgq-registry:/tmp/registry \
    registry:latest
```


#### 3. 查看私有仓库镜像
```
curl -XGET http://192.167.18.129:5000/v2/_catalog
```


#### 4. 配置 docker 支持 http 推送镜像 
```
vim /etc/docker/daemon.json 

# 文件内容：
{
  "registry-mirrors": ["https://tmax29pg.mirror.aliyuncs.com"],
  "insecure-registries": ["192.167.18.129:5000"]
}
```

* 配置完需要重启docker：`systemctl restart docker`
* 重启完启动registry：`docker start registry`


#### 5. 拉取 hello-world 镜像
```
docker pull hello-world

# 将镜像修改为符合私有仓库规范的 tag
docker tag hello-world:latest 192.167.18.129:5000/hello-world:1.0
```


#### 6. 推送镜像到私有仓库
```
docker push 192.167.18.129:5000/hello-world:1.0 
```


#### 7. 验证私有仓库镜像
```
curl -XGET http://192.167.18.129:5000/v2/_catalog
```


#### 8. 测试从私有仓库拉取镜像
```
# 删除原镜像
docker rmi 192.167.18.129:5000/hello-world:1.0

# 从私有仓库拉取镜像
docker pull 192.167.18.129:5000/hello-world:1.0
```
