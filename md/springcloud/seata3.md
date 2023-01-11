### Seata-XA、AT模式
### 一、XA模式
#### 1. XA 规范
XA 规范 是 X/Open 组织定义的分布式事务处理（DTP，Distributed Transaction Processing）标准，
描述了全局的TM与局部的RM之间的接口，几乎所有主流的数据库都对 XA 规范 提供了支持

#### 2.XA模型
XA规范实现的原理都是基于两阶段提交，Seata也是如此

一阶段：
- 事务协调者通知每个事物参与者执行本地事务
- 本地事务执行完成后报告事务执行状态给事务协调者，此时事务不提交，继续持有数据库锁

二阶段：
- 事务协调者基于一阶段的报告来判断下一步操作
  - 如果一阶段都成功，则通知所有事务参与者，提交事务
  - 如果一阶段任意一个参与者失败，则通知所有事务参与者回滚事务

![Seata的XA模式](https://fgq233.github.io/imgs/springcloud/seata4.png)


### 3. XA模式优缺点
优点
- 事务的强一致性，满足ACID原则
- 常用数据库都支持，实现简单，并且没有代码侵入

缺点
- 因为一阶段需要锁定数据库资源，等待二阶段结束才释放，性能较差
- 依赖关系型数据库实现事务


### 4. 实现XA模式
1）修改application.yml文件（每个参与事务的微服务都需要修改），开启XA模式：

```
seata:
  data-source-proxy-mode: XA
```


2）给发起全局事务的入口方法添加`@GlobalTransactional`注解

3）重启服务、测试




 
 
 
### 二、AT模式
AT模式同样是分二阶段提交的事务模型，不过缺弥补了XA模型中资源锁定周期过长的缺陷

#### 1. AT 模型
![Seata的XA模式](https://fgq233.github.io/imgs/springcloud/seata5.png)

一阶段：
* 注册分支事务
* 记录undo-log（更新前before-Image + 更新后after-Image两个数据快照）
* 执行业务sql并提交，释放数据库锁
* 报告事务状态

二阶段：
* 若成功：删除undo-log即可
* 若失败：根据undo-log恢复数据到更新前

### 3. AT与XA的区别
* XA模式一阶段不提交事务，锁定资源，AT模式一阶段直接提交，不锁定资源
* XA模式依赖数据库机制实现回滚，AT模式利用数据快照实现数据回滚
* XA模式强一致，AT模式最终一致



### 4. 实现AT模式
1）修改application.yml文件（每个参与事务的微服务都需要修改），开启AT模式：

```
seata:
  data-source-proxy-mode: AT  # 默认就是AT模式
```


2）给发起全局事务的入口方法添加 @GlobalTransactional注解

3）重启服务、测试




 
 
 



 
