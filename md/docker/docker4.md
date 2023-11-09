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
* `-v [数据卷名称:容器内部位置]`，若数据卷不存在，则会自动创建，此方式的**宿主机目录**会由docker自己决定
* `-v [宿主机目录]:[容器内目录]`
* `-v [宿主机文件]:[容器内文件]`

数据卷挂载后，宿主机和容器内数据双向绑定
* 宿主机修改，容器内同步获得
* 容器内修改，宿主机同步获得
* 容器stop，宿主机修改，容器start后数据成功同步

#### 1. Nginx 挂载数据卷示例1
```
# 方式1：由docker自己决定宿主机目录
docker run -d -p 80:80 --name ng -v myhtml:/usr/share/nginx/html nginx:latest

# 查看数据卷信息，找到挂载点Mountpoint目录
docker volume inspect myhtml

# 进入挂载点目录
cd /var/lib/docker/volumes/myhtml/_data
ls



# 方式2：自定义宿主机目录
docker run -d -p 80:80 --name ng -v /usr/local/nginx/html:/usr/share/nginx/html nginx:latest
```



