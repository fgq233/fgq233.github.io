### Nginx 静态资源部署
* 静态资源：在服务器真实存在、并且能直接展示的一些文件，如：`html、css、js、图片、音频、视频`等
* 动态资源：服务器端根据不同条件，返回不同的内容，如：用户数据、报表数据等


### 一、静态资源的配置指令
#### 1. listen
* 用来配置监听的端口
* 常用语法 `listen address [:port]` 或 `listen port`

```
listen  127.0.0.1：8080   监听指定的ip和端口
listen  127.0.0.1         监听指定ip的所有端口
listen  8080              监听指定的端口
listen  *.8080            监听指定的端口
```

#### 2. server_name
* 用来配置虚拟主机的服务名称
* 语法 `server_name name1...`，可以配置多个，以空格分割，配置格式有3种
  * 精确格式
  * 通配符格式，通配符只能出现在域名的首段或尾段
  * 正则表达式格式，必须以 `~` 作为开始标记
* 若都匹配上，优先级：`精确匹配 > *开始的通配符 > *结尾的通配符 > 正则表达式 > 默认的default_server`

```
server_name  127.0.0.1
server_name  www.github.com

server_name  *.github.com
server_name  www.github.*

server_name  ~^www\.(\w+)\.com
```
 
 


### 一、静态资源的配置优化
### 一、静态资源的压缩配置
### 一、静态资源的缓存处理
### 一、静态资源的访问控制
* 跨域问题
* 防盗链问题
 



 