### Linux 软件安装、启动

### 一、软件安装
#### 1. Linux安装方式
* 源码安装
* `rpm`包安装（通过 .rpm 包安装）
* `yum`安装 （需要联网）


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
  
  
#### 3. rpm 命令
* 语法：`rpm [-options] 文件名`
* options选项
  *  `-a`   (查询/验证)所有软件包
  *  `-q`   查询选项
  *  `-i`   安装软件包
  *  `-e`   清除 (卸载) 软件包
  *  `-v`   提供更多的详细信息输出
  *  `-h`   软件包安装的时候列出哈希标记 (和 -v 一起使用效果更好)
  *  `--nodeps`   不验证包依赖
* 示例
  * `rpm -ivh xxx.rpm` 安装
  * `rpm -qa`  查询所有 rpm 安装的软件
  * `rpm -e xxx --nodeps` 卸载

  
  
### 二、软件启动
#### 1. systemctl 命令
* 作用：内置或第三方软件均支持使用 `systemctl` 命令启动/停止/开机自启，被 `systemctl` 管理的软件也称为`服务`

* 语法：`systemctl [start | stop | restart | status | enable | disable] 服务名称`
  * `start`    启动
  * `stop`     停止
  * `restart`  重启
  * `status`   查看状态
  * `enable`   启动开机自启
  * `disable`  关闭开机自启
  
#### 2. 常用的内置服务
* `NetworkManager`   主网络服务
* `network`      副网络服务
* `firewalld`   防火墙服务
  * `systemctl stop firewalld` 关闭防火墙
  * `firewall-cmd --query-port=3306/tcp` 查询3306端口是否开放
  * `firewall-cmd --zone=public --add-port=3306/tcp --permanent` 开放3306端口
  * `firewall-cmd --reload` 重新加载防火墙
* `sshd，ssh`服务 
  
#### 3. 注册为服务
* `systemctl` 管理的是已经注册为服务的程序，一些第三方软件安装后没有自动注册，需要手动注册


