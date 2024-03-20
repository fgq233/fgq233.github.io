### Redis Windows 版本安装
Redis(Remote Dictionary Server)，即远程字典服务，是一个`基于内存`的`键值对`型noSql数据库
* 键值型 key-value，key为字符串，value支持多种类型
* 单线程
* 基于内存
* 支持数据持久化
* 支持主从集群、分片集群

#### 1. 下载
* redis官方没有提供windows版本，不过 github上有第三方开发提供的 windows 版本
* windows版本：[https://github.com/tporadowski/redis/releases](https://github.com/tporadowski/redis/releases)

#### 2. 解压、启动
解压下载的安装包，将解压后目录 `Redis-5.0.14` 添加到环境变量
* 启动服务：运行 `redis-server.exe`
* 连接服务：运行 `redis-cli.exe`
    * 指定 `ip` 连接：`-h 127.0.0.1`
    * 指定 `port` 连接：`-p 6379`
    * 指定 `访问密码` 连接：`-a fgq666`


#### 3. 配置文件
* 配置文件为 `redis.windows.conf`
* 以指定配置文件启动服务
    * 相对路径：`redis-server redis.windows.conf`
    * 绝对路径：`redis-server D:\MyDevelop\Redis-5.0.14\redis.windows.conf`

``` 
# 访问密码
requirepass fgq666

# ip
bind 127.0.0.1 

# 端口
port 6379

# 默认初始化库的数量
databases 16

# RDB文件名称
dbfilename dump.rdb  

# 文件保存目录
dir ./ 

# 日志文件名，默认为空，不记录日志
logfile ""
```
 