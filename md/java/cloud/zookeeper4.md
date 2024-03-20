# ZooKeeper 分布式锁


### 一、分布式锁
#### 1. ZooKeeper 分布式锁原理
* 核心思想：当客户端要获取锁，则创建节点，使用完锁，则删除该节点

* 客户端获取锁时，在lock节点下创建临时顺序节点
* 然后获取lock下面的所有子节点，客户端获取到所有的子节点之后，如果发现自己创建的子节点序号最小，
那么就认为该客户端获取到了锁，使用完锁后，将该节点删除

* 如果发现自己创建的节点并非lock所有子节点中最小的，说明自己还没有获取到锁，
此时客户端需要找到比自己小的那个节点，同时对其注册事件监听器，监听删除事件

* 如果发现比自己小的那个节点被删除，则客户端的Watcher会收到相应通知，此时再次判断自己创建的节点
是否是lock子节点中序号最小的，如果是则获取到了锁，如果不是则重复以上步骤继续获取到比自己小的一个节点
并注册监听


#### 2. 锁方案
在Curator中有五种锁方案：
* InterProcessSemaphoreMutex：分布式排它锁（非可重入锁）
* InterProcessMutex：分布式可重入排它锁
* InterProcessReadWriteLock：分布式读写锁
* InterProcessMultiLock：将多个锁作为单个实体管理的容器
* InterProcessSemaphoreV2：共享信号量

 
 
 
### 二、锁的使用步骤
#### 1. 锁初始化
```
InterProcessMutex lock = new InterProcessMutex(client, "/lock");
```

#### 2. 获取锁
```
# 参数为锁等待时间
lock.acquire(30, TimeUnit.SECONDS);
```

#### 3. 释放锁
```
lock.release();
```