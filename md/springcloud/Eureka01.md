在Eureka架构中，微服务角色分两类：
1. EurekaServer：服务端(注册中心)
    - 记录服务信息
    - 心跳监控
2. EurekaClient：客户端
    - Provider：服务提供者，启动时注册自己到EurekaServer，每隔30秒向EurekaServer发送心跳
    - consumer：服务消费者，根据服务名称从EurekaServer拉取服务列表，基于服务列表做负载均衡，选中一个微服务后发起远程调用

![eureka原理](https://fgq233.github.io/imgs/springcloud/eureka.png)