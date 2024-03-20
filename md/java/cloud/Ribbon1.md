#### 1、Ribbon + Eureka负载均衡流程

![负载均衡流程](https://fgq233.github.io/imgs/springcloud/ribbon1.png)




#### 2、Ribbon 负载均衡原理

![负载均衡原理](https://fgq233.github.io/imgs/springcloud/ribbon2.png)

* @LoadBalanced 注解标记， 发出的 Http 请求会被 Ribbon 拦截器拦截
* 拦截请求 - 处理 - 拉取服务列表 - 负载均衡 - 得到最终请求url - 发出请求