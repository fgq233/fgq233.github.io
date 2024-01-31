### Jenkins + Gitlab  + Maven 构建、部署到 docker 容器中
### 一、 前置准备
* 测试服务器，安装 docker 环境
* 参考 [https://fgq233.github.io/md/docker/docker2](https://fgq233.github.io/md/docker/docker2)

### 二、 方式 1 
在 docker 中安装 Java 镜像，然后使用 Java 镜像运行构建完成的 jar 包

#### 1. 测试服务器
```
# 安装 java 镜像
docker pull java:8

# 运行 java 镜像
docker run \
  --name SpringbootTest \
  --privileged=true \
  -d \
  -p 8888:8888 \
  -v /root/app/SpringBootTest-0.0.1-SNAPSHOT.jar:/test.jar \
  java:8  \
  java -jar /test.jar
```

#### 2. Jenkins 构建前置步骤
* 停止容器
* 删除构建的 jar 包

![13](https://fgq233.github.io/imgs/jenkins/013.png)


#### 3. Jenkins 构建后置步骤
* 传输 jar 到测试服务器
* 启动容器

![14](https://fgq233.github.io/imgs/jenkins/014.png)

