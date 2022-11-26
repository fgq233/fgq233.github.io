#### 一、IRule接口
Ribbon中负载均衡规则是一个叫做IRule的接口来定义的，其每个子接口都是一种负载均衡策略：

![IRule接口](https://fgq233.github.io/imgs/springcloud/ribbon3.png)


| 内置负载均衡规则类 |  策略描述 |
| :-----|  :----- |
| RoundRobinRule |  简单轮询服务列表来选择服务器。它是Ribbon默认的负载均衡规则 |
| ZoneAvoidanceRule |  以区域可用的服务器为基础进行服务器的选择。使用Zone对服务器进行分类，这个Zone可以理解为一个机房、一个机架等，而后再对Zone内的多个服务做轮询 |
| WeightedResponseTimeRule |  为每一个服务器赋予一个权重值。服务器响应时间越长，这个服务器的权重就越小，这个规则会随机选择服务器，这个权重值会影响服务器的选择 |
| BestAvailableRule |  忽略那些短路的服务器，并选择并发数较低的服务器 |
| RandomRule |  随机选择一个可用的服务器 |
| RetryRule |  重试机制的选择逻辑 |
| AvailabilityFilteringRule |  过滤短路、并发过高的服务器 |



#### 二、修改Ribbon负载均衡策略
##### 1、代码方式，在Application类中，定义一个新的IRule

```
    @Bean
    public IRule randomRule() {
        return new RandomRule();
    }
```

##### 2、配置方式，yml配置

```
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule  # 负载均衡策略类
```

* 两种方式策略范围不一样，1针对所有远程服务，2针对配置的某个远程服务