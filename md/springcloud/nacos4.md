### Nacos 集群搭建
#### 一. 集群结构图
#### 1. 官方给出的Nacos集群图

![Nacos集群图](https://fgq233.github.io/imgs/springcloud/nacos2.png)

包含3个nacos节点，然后一个负载均衡器SLB代理3个Nacos

#### 2. 使用 Nginx 做负载均衡器

![Nacos集群图](https://fgq233.github.io/imgs/springcloud/nacos3.png)



### 二. 集群搭建步骤
* 准备多台 nacos 服务器节点
* 下载nacos安装包
* 搭建数据库，初始化nacos数据库表结构
* 配置、启动nacos
* Nginx反向代理

#### 1. 准备3台 nacos 服务器节点
* 模拟3个节点
* 注意：Nacos 2.0+版本新增了gRPC，这会导致端口偏移
* 需要的端口是8841，但是却需要额外占用9841（偏移1000）和9842（偏移1001）
* 需要的端口是8842，但是却需要额外占用9842（偏移1000）和9843（偏移1001）
* 所以如果同一台机器模拟，每个端口需要至少相差2，不然会端口冲突，启动失败

| 节点   | ip         | port |
| ------ | ----------| ---- |
| nacos1 | 127.0.0.1 | 8841 |
| nacos2 | 127.0.0.1 | 8843 |
| nacos3 | 127.0.0.1 | 8845 |


#### 2. 下载nacos安装包
参考[Nacos安装](https://fgq233.github.io/md/springcloud/nacos1)
 
#### 3. 搭建数据库，初始化nacos数据库表结构
* Nacos默认数据存储在内嵌数据库Derby中，不属于生产可用的数据库
* 官方推荐的最佳实践是使用带有主从的高可用数据库集群
* 先建库，conf目录下有初始化表结构的语句，建完库之后导入表结构
 
 
#### 4. 配置、启动nacos
将 conf 目录下 cluster.conf.example 重命名为 cluster.conf，该文件是配置nacos集群下所有节点信息

```
127.0.0.1:8841
127.0.0.1:8843
127.0.0.1:8845
```

在 application.properties 中配置 端口，mysql 数据库，同样方式再操作2次并调整端口

```
server.port=8841        
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=12345678
```

分别以集群模式启动3个nacos节点

#### 5. Nginx反向代理
下载 Nginx 安装包并解压，修改conf/nginx.conf文件，然后启动 nginx.exe，配置如下：

```
# nacos集群节点配置
upstream nacos-cluster {
    server 127.0.0.1:8841;
    server 127.0.0.1:8843;
    server 127.0.0.1:8845;
}

# Nginx反向代理配置
server {
    listen       80;          # 监听localhost的8080端口   
    server_name  localhost;     

    location /nacos {         # 路径匹配
    	proxy_pass http://nacos-cluster;     # 代理到 nacos-cluster 集群
    }
}
```

* 访问 [http://127.0.0.1/nacos](http://127.0.0.1/nacos) 成功，集群搭建完成
* 修改项目中 Nacos 地址配置

```
spring:
  cloud:
    nacos:
      server-addr: localhost:80     # Nacos地址
```

#### 6. 优化
* 给做反向代理的nginx服务器设置一个域名，后续服务器迁移，nacos的客户端也无需更改地址配置

* Nacos的各个节点应该部署到多个不同服务器，做好容灾和隔离
