#### 一、IRule接口
Ribbon中负载均衡规则是一个叫做IRule的接口来定义的，其每个子接口都是一种负载均衡策略：


| 内置负载均衡规则类 |  策略描述 |
| :-----|  :----- |
| RoundRobinRule |  轮询策略，默认的策略 |
| RandomRule |  随机策略 |
| ZoneAvoidanceRule |  给服务器分区域，而后再对Zone内的多个服务做轮询 |
| WeightedResponseTimeRule |  为每个服务器加权重轮询 |
| BestAvailableRule |  过滤故障服务器，选择并发数较低的服务器 |
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

两种方式策略范围不一样，1针对所有远程服务，2针对配置的某个远程服务
