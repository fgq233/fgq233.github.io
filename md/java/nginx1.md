### Nginx Windows 安装


#### 1. 下载
[http://nginx.org/en/download.html](http://nginx.org/en/download.html)

#### 2. 解压
![](https://fgq233.github.io/imgs/java/nginx1.png)

* `conf` 配置文件目录，`nginx.conf`为核心配置
* `contrib` 配置文件目录，`nginx.conf`为核心配置
* `docs` 文档
* `html` 文档
* `temp` 文档

#### 3. 检测
`nginx.conf`中配置的默认监听端口为80，检测：`netstat -ano|findstr 8080`


#### 4. 启动
* 方式 ①，双击 `nginx.exe`
* 方式 ②，命令行运行 `start nginx`

#### 5. 检测是否启动成功
`tasklist /fi "imagename eq nginx.exe"`

![](https://fgq233.github.io/imgs/java/nginx2.png)
