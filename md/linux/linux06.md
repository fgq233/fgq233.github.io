### Linux 软件安装、启动

### 一、软件安装
#### 1. 概念
安装软件一般有 2 种方式
* 下载安装包自行安装
  * windows 系统的 .`exe、.msi` 等文件
  * mac 系统的 `.dmg、.pkg` 等文件
  * CentOS 的 `rpm` 文件，Ubuntu 的 `.deb` 文件
  
* 系统的应用商店内安装 
  * windows 系统的 Microsoft Store商店
  * mac系统有AppStore商店
  * CentOS 的 `yum 命令`、Ubuntu的 `apt 命令`
  
  
#### 2. yum 命令
* `yum` 是RPM包软件管理器，用于自动化安装配置Linux软件，并且可以自动解决依赖问题

* 语法：`yum [-y] [install | remove | search] 软件名称`
  * `-y` 自动确认，无需手动确认安装或卸载过程
  * `install` 安装
  * `remove`  卸载
  * `search`  搜索商店是否有该软件
  
* 执行`yum` 命令需要 2 个条件
  * `root` 权限，可以`su` 切换到`root`，或使用`sudo`提权
  * 需要联网
  
  
#### 3. apt 命令
* 语法：`apt [-y] [install | remove | search] 软件名称`，只有命令换了，其他用法都一致
  
  
### 二、软件启动
#### 1. systemctl 命令
* 作用：内置或第三方软件均支持使用 `systemctl` 命令启动/停止/开机自启，被 `systemctl` 管理的软件也称为`服务`

* 语法：`systemctl [start | stop | status | enable | disable] 服务名称`
  * `start`    启动
  * `stop`     停止
  * `status`   查看状态
  * `enable`   启动开机自启
  * `disable`  关闭开机自启
  
#### 2. 常用的内置服务
* `NetworkManager`   主网络服务
* `network`      副网络服务
* `firewalld`   防火墙服务
  * `systemctl stop firewalld` 关闭防火墙
* `sshd，ssh`服务 
  
#### 3. 注册为服务
* `systemctl` 管理的是已经注册为服务的程序，一些第三方软件安装后没有自动注册，需要手动注册


