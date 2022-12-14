### Seata-搭建与集成
### 一、Seata
#### 1. Seata 架构
Seata是一款开源的分布式事务解决方案，官网：http://seata.io

![Seata](https://fgq233.github.io/imgs/springcloud/seata2.jpg)

Seata事务管理中有三个重要的角色：

- **TC (Transaction Coordinator)** 事务协调者：维护全局和分支事务的状态，协调全局事务提交或回滚

- **TM (Transaction Manager)** 事务管理器：定义全局事务的范围、开始全局事务、提交或回滚全局事务

- **RM (Resource Manager)** 资源管理器：管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，
并驱动分支事务提交或回滚

#### 2. 四种分布式事务解决方案
Seata提供了四种不同的分布式事务解决方案：

- XA模式：强一致性分阶段事务模式，牺牲了一定的可用性，无业务侵入
- TCC模式：最终一致的分阶段事务模式，有业务侵入
- AT模式：最终一致的分阶段事务模式，无业务侵入，也是Seata的默认模式
- SAGA模式：长事务模式，有业务侵入

无论哪种方案，都离不开TC，也就是事务的协调者。

