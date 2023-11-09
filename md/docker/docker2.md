### Docker安装
* Docker 分为 CE 和 EE 两大版本
* CE 社区版（免费，支持周期 7 个月），EE 企业版，付费使用，支持周期 24 个月
* 官网文档：https://docs.docker.com/engine/install/

### 一、CentOS下Docker安装、卸载
#### 1. 安装 yum工具
```
yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2 --skip-broken
```


#### 2. 更新镜像源
默认镜像源安装慢，使用阿里云仓库的镜像源

```
# 设置docker镜像源
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

# CentOS7
yum makecache fast
# CentOS8
yum makecache 
```


#### 3. 安装Docker
这里安装docker-ce社区免费版本

```
yum install -y docker-ce
```


#### 4. 关闭防火墙
Docker应用需要用到各种端口，这里直接关闭防火墙

```
systemctl stop firewalld
systemctl disable firewalld
```


#### 5. Docker服务启动、停止、重启
```
# 启动docker服务
systemctl start docker  

# 停止docker服务
systemctl stop docker  

# 重启docker服务
systemctl restart docker  

# 查看docker服务状态
systemctl status docker

# 查看docker版本
docker -v
```

#### 6. 卸载Docker
```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
```


#### 7. 配置镜像加速器
* docker官方镜像仓库网速较差，一般使用国内镜像服务

* 参考阿里云镜像器：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors
