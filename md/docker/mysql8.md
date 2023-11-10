### Docker 中 MySQL8 安装
#### 1. 拉取镜像
```
docker pull mysql:8
```

#### 2. 查看镜像
```
docker images mysql
```

#### 3. 宿主机数据目录创建
```
mkdir -p /usr/local/mysql8/conf
mkdir -p /usr/local/mysql8/data
mkdir -p /usr/local/mysql8/log
```

#### 4. 宿主机新建MySQL配置文件my.cnf
```
# 进入配置文件目录
cd /usr/local/mysql8/conf

# 新增配置文件
vim my.cnf
```


配置文件内容：

```
[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4

[mysqld]
character-set-server=utf8mb4
max_connections=1000
max_connect_errors=100
default-storage-engine=INNODB
lower_case_table_names=1
# 设置东八区时区
default-time_zone = '+8:00'
# 解决目录权限问题
secure_file_priv=/var/lib/mysql
```

#### 5. 授权
```
chmod 777 /usr/local/mysql8/data/
chmod 777 /usr/local/mysql8/log/ 
chmod 644 /usr/local/mysql8/conf/my.cnf
```


#### 6. 启动容器并挂载数据卷
```
docker run \
  --name mysql8 \
  --privileged=true \
  -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v /usr/local/mysql8/conf/my.cnf:/etc/mysql/my.cnf  \
  -v /usr/local/mysql8/data:/var/lib/mysql \
  -v /usr/local/mysql8/log:/var/log/mysql \
  mysql:8
```

配置文件的数据卷使用下面两种方式都可以，因为宿主机和容器内数据双向绑定
* `-v /usr/local/mysql8/conf/my.cnf:/etc/mysql/my.cnf`
* `-v /usr/local/mysql8/conf:/etc/mysql`


#### 7. 查看进程
```
docker ps
```

#### 8. 进入容器内部登录mysql
```
docker exec -it mysql8 bash

mysql -uroot -p 
```