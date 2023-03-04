### Nginx Windows 安装

### 一、安装
#### 1. 下载
[http://nginx.org/en/download.html](http://nginx.org/en/download.html)

#### 2. 解压
![](https://fgq233.github.io/imgs/java/nginx1.png)

* `conf` 配置文件目录
  * `mime.types` 
  * `nginx.conf`核心配置
* `html` 站点目录
  * `index.html` 默认访问成功的静态页面
  * `50x.html`   默认访问失败的静态页面
* `logs` 日志目录
  * `access.log` 访问日志
  * `error.log`  错误日志
  * `nginx.pid`  启动后的进程`pid`存储文件

#### 3. 检测
`nginx.conf`默认监听端口为80，检测：`netstat -ano|findstr 80`


#### 4. 启动Nginx
* 方式 ①，双击 `nginx.exe`
* 方式 ②，命令行运行  `nginx` 或 `start nginx`

#### 5. 检测是否启动成功
* 方式 ①，浏览器运行 [http://127.0.0.1](http://127.0.0.1`)
* 方式 ②，命令行检测 `tasklist /fi "imagename eq nginx.exe"`

#### 6. 关闭Nginx
`nginx -s stop`






### 二、Nginx 常用命令
#### 1. 常用命令
```
nginx -s stop       快速关闭Nginx，可能不保存相关信息，并迅速终止web服务
nginx -s quit       平稳关闭Nginx，保存相关信息，有安排的结束web服务
nginx -s reload     重启Nginx

nginx -c filename   为Nginx指定配置文件
nginx -t filename   测试配置文件语法的正确性

nginx -v            显示版本
nginx -V            显示版本、编译器版本、配置参数
nginx -h            查看帮助信息
```

#### 2. 启动.bat
```
@echo off
rem 如果启动前已经启动nginx并记录下pid文件，会kill指定进程
nginx -s quit

rem 测试配置文件语法的正确性
nginx -t -c conf/nginx.conf

rem 指定配置文件启动nginx
nginx -c conf/nginx.conf
```
