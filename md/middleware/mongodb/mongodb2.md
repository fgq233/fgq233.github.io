### MongoDB 安装启动
### 一.  Windows 环境
#### 1. 下载
* 安装包地址：[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
* 图形化客户端地址：[https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

#### 2. 版本说明
MongoDB的版本命名规范如：x.y.z
* y为奇数时表示当前版本为开发版
* y为偶数时表示当前版本为稳定版
* z是修正版本号，数字越大越好

#### 3. 启动服务
* 将 bin 目录添加到环境变量
* 在根目录建一个 `data` 目录，再在 `data` 目录下 建立 `db` 目录
* 启动服务使用 `mongod` 命令，必须指定`dbpath` 参数，有2种方法指定
    * `dbpath` 参数
    * 配置文件：在根目录下新建 `conf/mongodb.conf` 配置文件，内容如下
      
```
storage:
    dbPath: D:\MyDevelop\MongoDB\mongodb-win32-x86_64-windows-5.0.14\data\db
``` 
      

打开 cmd 命令，使用 `mongod` 命令启动服务


```
方式一：
mongod --dbpath=..\data\db
mongod --dbpath=D:\MyDevelop\MongoDB\mongodb-win32-x86_64-windows-5.0.14\data\db

方式二：
mongod -f ../conf/mongodb.conf
mongod -f   D:\MyDevelop\MongoDB\mongodb-win32-x86_64-windows-5.0.14\conf\mongodb.conf
mongod --config ../conf/mongodb.conf
mongod --config D:\MyDevelop\MongoDB\mongodb-win32-x86_64-windows-5.0.14\conf\mongodb.conf
```

* 方式一、二都支持相对路径、绝对路径
* 启动成功后，默认端口为 27017，如果想改变默认启动端口，可以通过`--port`来指定

 
 
### 二.  Linux 环境
#### 1. 下载(同上)

#### 2. 上传压缩包到Linux中并解压到当前目录
```
tar -xvf mongodb-linux-x86_64-5.0.14.tgz
```

#### 3. 移动解压后的文件夹到指定的目录中
```
mv mongodb-linux-x86_64-5.0.14 /usr/local/mongodb
```
 
#### 4. 新建数据目录、日志目录
```
#数据存储目录
mkdir -p /mongodb/single/data/db

#日志存储目录
mkdir -p /mongodb/single/log
```
 
#### 5. 新建并修改配置文件
```
vi /mongodb/single/mongodb.conf
```
 
配置文件内容如下

```
systemLog:
  destination: file                        # 日志输出为文件,默认是在控制台打印
  path: "/mongodb/single/log/mongod.log"   # 日志存储路径
  logAppend: true                          # 重新启动时，将新日志附加到现有日志文件的末尾
storage:
  dbPath: "/mongodb/single/data/db"        # 存储数据的目录
  journal:
    enabled: true                          # 启用或禁用持久性日志以确保数据文件保持有效和可恢复，默认true
processManagement:
  fork: true                               # 在后台运行， 这个在windows上会报错，可通过 install 为服务来解决
net:
  bindIp: 127.0.0.1                        # 绑定的IP，默认是localhost
  port: 27017                              # 绑定的端口，默认是27017
```
 
 
 
#### 6. 启动服务
``` 
/usr/local/mongodb/bin/mongod -f /mongodb/single/mongodb.conf
```
 

### 三. Shell连接(mongo命令)
MongoDB javascript shell是一个基于javascript的解释器，是支持js程序的

#### 1. 登录
打开 cmd 命令，使用 `mongo` 命令登录

```
mongo
或
mongo --host=127.0.0.1 --port=27017
```

#### 2. 退出
```
exit
```

#### 3. help
更多参数可以通过帮助查看：`mongo --help`
