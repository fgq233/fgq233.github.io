### Redis 持久化
* Redis 是内存存储，虽然性能更高，但是一旦程序故障很容易丢失数据，所以将数据持久化到硬盘是必须的
* Redis 有 2 种持久化方案：RDB、AOF

### 一. RDB持久化 
#### 1. RDB
* Redis Database Backup file（Redis数据备份文件），也叫做Redis数据快照，这是Redis默认持久化方案
* Redis 把内存中的所有数据都记录到磁盘中，当Redis实例故障重启后，从磁盘读取快照文件，恢复数据
* RDB备份文件默认保存在当前运行目录

#### 2. 执行时机
##### 2.1 执行 save 命令时
save命令会导致主进程执行RDB，这个过程中其它所有命令都会被阻塞，所以一般只在数据迁移时可能用到
    
##### 2.2 执行 bgsave 命令时
* bgsave命令是异步执行RDB，会开启独立进程完成RDB，主进程可以持续处理用户请求，不受影响
* bgsave原理：开始时会fork主进程得到子进程，子进程共享主进程的内存数据，完成fork后读取内存数据并写入 RDB 文件，
fork采用了copy-on-write技术
  - 当主进程执行读操作时，访问共享内存
  - 当主进程执行写操作时，则会拷贝一份数据，执行写操作
  
  
##### 2.3 Redis关闭时
Redis关闭时会执行一次save命令，实现RDB持久化


##### 2.4 触发RDB条件
Redis内部有触发RDB的机制，可以在redis.conf文件中找到，格式如下：

```
# 900秒内，如果至少有1个key被修改，则执行bgsave 
# 300秒内，如果至少有10个key被修改，则执行bgsave 
# 60秒内，如果至少有10000个key被修改，则执行bgsave
save 900 1  
save 300 10  
save 60 10000 
```



### 二. AOF持久化 
#### 1. AOF
Append Only File（追加文件），Redis处理的每一个写命令都会记录在AOF文件，可以看做是命令日志文件


#### 2. AOF原理
* RDB 是将每条数据key value记录在文件中
* AOF 是将每一条命令记录在文件中，启动时执行所有命令，恢复数据
 

#### 3. 开启AOF持久化
AOF默认是关闭的，需要修改redis.conf配置文件来开启

```
# 是否开启AOF功能，默认是no
appendonly yes

# AOF文件的名称
appendfilename "appendonly.aof"
```

#### 4. AOF执行时机  
```
# always：表示每执行一次写命令，立即记录到AOF文件 (安全性最强、性能最差)
# everysec：写命令执行完先放入AOF缓冲区，然后每隔1秒将缓冲区数据写到AOF文件(默认值，最多损失1秒数据)
# no：写命令执行完先放入AOF缓冲区，由操作系统决定何时将缓冲区内容写回磁盘 (安全性最差、性能最好)
appendfsync always 
```

#### 5. AOF文件重写
* 因为是记录每一条命令，AOF文件会比RDB文件大的多，而且AOF会记录对同一个key的多次写操作，
但只有最后一次写操作才有意义

* 通过执行 `bgrewriteaof` 命令，可以让AOF文件执行重写功能，减小持久化文件大小，提升加载速度
* Redis 会在触发阈值配置时，主动去异步重写AOF文件

```
# AOF文件比上次文件增长超过多少百分比则触发重写
auto-aof-rewrite-percentage 100

# AOF文件达到 64M 以上才触发重写 
auto-aof-rewrite-min-size 64mb 
```


