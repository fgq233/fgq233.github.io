### MySQL 8.X  Windows 版本安装(解压版)

#### 1. 官网下载安装包
[https://downloads.mysql.com/archives/community/](https://downloads.mysql.com/archives/community/)


#### 2. 解压
![](https://fgq233.github.io/imgs/mysql/mysql1.png)


#### 3. 配置环境变量
* 添加系统变量 `MySQL_HOME`，值：`E:\MyDevelopTools\MySQL\mysql-8.0.25`
* `Path`系统变量中添加 `MySQL_HOME`的bin目录，值：`%MySQL_HOME%\bin`


#### 4. 添加配置文件 my.ini
![](https://fgq233.github.io/imgs/mysql/mysql2.png)


#### 5. my.ini 配置
```
[client]
port=3306

[mysql]
default-character-set=utf8

[mysqld]
port=3306
basedir=E:\MyDevelopTools\MySQL\mysql-8.0.25
datadir=E:\MyDevelopTools\MySQL\mysql-8.0.25\data
max_connections=1000
max_connect_errors=1000
default-storage-engine=INNODB
character-set-server=utf8mb4
log-error=E:\MyDevelopTools\MySQL\mysql-8.0.25\data\mysql.err
lower_case_table_names=1
```


#### 6. 初始化
* 在命令行运行下面命令，用配置文件 `my.ini` 初始化数据库
* 初始化之后，会在安装目录下生成 `datadir`，并生成 `root` 初始密码

```
mysqld --defaults-file=E:\MyDevelopTools\MySQL\mysql-8.0.25\my.ini --initialize  --user=mysql
```


#### 7. 修改 root 密码
```
# 打开cmd窗口以无密码模式启动
mysqld --console --skip-grant-tables --shared-memory

# 打开一个新的cmd窗口登录
mysql -uroot -p

# 切换数据库
use mysql

# 刷新权限
flush privileges;

# 修改 root 密码
alter user 'root'@'localhost' identified by '123456';

# 关闭登录 cmd
# 关闭启动 cmd
```


#### 8. 系统服务
```
# 将 mysqld 安装为系统服务，服务名为：mysql8
mysqld install mysql8

# 启动服务
net start mysql8

# 停止服务
net stop mysql8

# 移除 mysqld 服务
mysqld remove
```
