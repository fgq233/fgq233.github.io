### Seata 集群搭建
#### 1. 模拟集群
启动两台seata服务节点：

| 节点名称 | ip地址    | 端口号 | 集群名称 |
| -------- | --------- | ------ | -------- |
| seata1    | 127.0.0.1 | 8091   | AAA       |
| seata2    | 127.0.0.1 | 8092   | BBB       |

* 复制二份seata服务，registry.con中 集群名称分别配置为AAA、BBB
* 启动二台seata服务，端口分别是8091，8092 `seata-server.bat -p 8092`

```
registry {
  type = "nacos"

  nacos {
    application = "seata-server"
    serverAddr = "127.0.0.1:8848"
    group = "SEATA_GROUP"
    namespace = ""
    cluster = "AAA"         # 集群名称
    username = "nacos"
    password = "nacos"
  }
}

config {
  type = "nacos"
  nacos {
    serverAddr = "127.0.0.1:8848"
    namespace = ""
    group = "SEATA_GROUP"
    username = "nacos"
    password = "nacos"
    dataId = "seataServer.properties"   # 在nacos配置中心的dataId
  }
}
```



#### 2.  将事务组映射配置到nacos
在 seataServer.properties 新增事务组映射关系

```
service.vgroupMapping.seata-demo=AAA
```

#### 3.  微服务读取nacos配置

* 修改每一个微服务的application.yml文件，添加seata.config配置，用来动态读取 seataServer.properties文件
* 最终yml为：


```
seata:
  registry:                             # 注册中心，参考registry.conf的registry
    type: nacos
    nacos:
      application: seata-server
      server-addr: 127.0.0.1:8848
      group : "SEATA_GROUP"
      namespace: ""
      cluster: AAA
      username: "nacos"
      password: "nacos"
  config:                               # 配置中心，参考registry.conf的config
    type: nacos
    nacos:
      server-addr: 127.0.0.1:8848
      group : "SEATA_GROUP"
      namespace: ""
      username: "nacos"
      password: "nacos"
  tx-service-group: my-service-group    # 事务分组配置
```

#### 4  重启所有微服务

重启微服务，现在微服务连接的集群都统一由 nacos的 seataServer.properties来决定了

 
 