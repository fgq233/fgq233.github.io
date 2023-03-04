### Nginx 制作下载站点

![](https://fgq233.github.io/imgs/java/nginx5.png)


### 一、下载站点
* `Nginx` 使用的是`ngx_http_autoindex_module`模块来实现下载站点，
* 该模块处理以斜杠 `/` 结尾的请求，并生成目录列表
* 该模块默认是关闭的，需要手动开启


 
#### 1. 资源
![](https://fgq233.github.io/imgs/java/nginx5.png)

#### 2. server 指令
* 用来指定后端服务器的名称和一些参数，可以使用域名、IP、端口
* 语法 `server name [paramerters]`


 