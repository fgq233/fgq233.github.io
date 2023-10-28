### Docker 数据卷
**数据卷**是一个虚拟目录，指向宿主机文件系统中的某个目录

#### 一、数据卷命令
#### 1. 语法
```
docker volume [COMMAND]
```

* `docker volume`命令是数据卷操作，根据命令后跟随的command来确定下一步的操作：
  *  `create` 创建一个volume
  *  `ls` 列出所有的volume
  *  `inspect` 显示一个或多个volume的信息
  *  `prune` 删除未使用的volume
  *  `rm` 删除一个或多个指定的volume


#### 2. 示例
```
docker volume create myhtml
docker volume ls
docker volume inspect myhtml

docker volume rm myhtml
```

#### 二、挂载
在创建容器时，可以通过 `-v` 参数来挂载一个数据卷、目录、文件到某个容器目录
* `-v [数据卷名称:容器内部位置]`，若数据卷不存在，则会自动创建
* `-v [宿主机目录]:[容器内目录]`
* `-v [宿主机文件]:[容器内文件]`

#### 1. Nginx 挂载数据卷示例
```
# 创建容器时挂载数据卷
docker run -d -p 80:80 --name fgq -v myhtml:/usr/share/nginx/html nginx:latest

# 查看数据卷信息，找到挂载点Mountpoint目录
docker volume inspect myhtml

# 进入挂载点目录
cd /var/lib/docker/volumes/myhtml/_data
ls
```


#### 2. MySQL8 挂载配置文件、数据目录示例
```
# 拉取 mysql8 镜像
docker pull mysql:8

# 查看镜像
docker images

# 创建宿主机配置文件目录、数据目录、日志目录
mkdir -p /usr/local/mysql8/conf
mkdir -p /usr/local/mysql8/data

# 将 mysql8 配置文件 my.cnf 上传至conf目录

# 创建容器时挂载目录、文件
docker run \
  --name fgq-mysql \
  -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -v /usr/local/mysql8/conf:/etc/mysql/conf.d \
  -v /usr/local/mysql8/data:/var/lib/mysql \
  mysql:8
```

