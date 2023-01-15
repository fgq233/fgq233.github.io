### Redis 哨兵集群 
Redis 主从集群中当 master 中断服务后，需要人工将一个从服务器升级为主服务器继续提供服务，
为此，Redis提供了哨兵机制来实现自动化的系统监控和故障恢复功能


### 一. 哨兵集群 
#### 1. 哨兵Sentinel的作用

* 监控：Sentinel 会不断检查 master和slave 是否正常运行
* 自动故障恢复：master故障时，Sentinel会将一个slave提升为master(当故障实例恢复后也以新的master为主)
* 通知：Sentinel充当Redis客户端的服务发现来源，当集群发生故障转移时，会将最新信息推送给Redis的客户端

![Redis哨兵集群](https://fgq233.github.io/imgs/springcloud/redis3.png)


#### 2. 哨兵的工作步骤
* 哨兵监控：每个Sentinel（哨兵）进程以每秒钟一次的频率向集群中的Master、Slave以及其他哨兵发送一个 PING 命令

* 主观下线：如果一个实例（instance）距离最后一次有效回复 PING 命令的时间超过 down-after-milliseconds 
选项所指定的值，则这个实例会被 Sentinel（哨兵）进程标记为主观下线（SDOWN）

* 客观下线：超过指定数量（quorum）的sentinel都认为该实例主观下线，则该实例客观下线（ODOWN）


* 选举新master：一旦 master 客观下线，哨兵会从slave选举新master
  * sentinel给选好的slave节点发送 `slaveof no one` 命令，让该节点成为master
  * sentinel给所有其它slave发送 `slaveof ip port` 命令，让这些slave成为新master的从节点，开始从新的master上同步数据
  * 最后，sentinel将故障节点标记为slave，当故障节点恢复后会自动成为新的master的slave节点


### 二. 搭建 Sentinel哨兵集群
略


### 三. Spring Boot 集成哨兵集群 
* 在Sentinel集群监管下的Redis主从集群，其节点会因为自动故障转移而发生变化，
Redis的客户端必须感知变化及时更新连接信息
* RedisTemplate 底层利用 lettuce 实现了节点的感知和自动切换

#### 1. 引入依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

#### 2. yml配置Redis地址
```yaml
spring:
  redis:
    sentinel:
      master: mymaster
      nodes:
        - 192.168.150.101:27001
        - 192.168.150.101:27002
        - 192.168.150.101:27003
```

注意：这里配置的是 哨兵Sentinel集群地址


#### 3. 配置读写分离策略
在启动类中添加一个新的bean：

```
@Bean
public LettuceClientConfigurationBuilderCustomizer clientConfigurationBuilderCustomizer(){
    return clientConfigurationBuilder -> clientConfigurationBuilder.readFrom(ReadFrom.REPLICA_PREFERRED);
}
```


这个bean中配置的就是读写策略，包括四种：

- MASTER：从主节点读取
- MASTER_PREFERRED：优先从master节点读取，master不可用才读取replica
- REPLICA：从slave（replica）节点读取
- REPLICA _PREFERRED：优先从slave（replica）节点读取，所有的slave都不可用才读取master



