### 进程、IP、端口

### 一、 进程
#### 1. ps命令
* 作用：查看Linux系统中的进程信息
* 语法：`ps [-e -f]`
  * `-e` 显示出全部的进程
  * `-f` 展示进程全部信息
  
![](https://fgq233.github.io/imgs/linux/linux08.png)

#### 2. 查看指定进程
* 通过 ps命令、管道符、grep 命令查看指定进程信息
* 语法：`ps -ef | grep 关键字信息`
  * `ps -ef | grep tail` 查看带`tail`信息的进程
  * `ps -ef | grep 22` 查看带`22`信息的进程

#### 3. 杀死进程
* 语法：`kill [-9] 进程PID`，可选项`-9` 表示强制关闭进程


### 二、IP
通过 `ifconfig` 命令查看网络接口配置

#### 1. 说明
* 虚拟机中的Linux操作系统，IP地址是通过DHCP服务获取的，重启后可能导致IP地址变更
* 虚拟机配置固定IP需要2个步骤
  * 在`VMware Workstation`中配置IP地址网关、网段
  * 在`Linux`系统中手动修改配置文件，固定IP

#### 2. 虚拟机 VMware 配置
* 编辑 - 虚拟网络编辑器 - `Vmnet8`
* 子网IP `192.167.18.0` 表示`IP`范围为 `192.167.18.0` 到 `192.167.18.254`
* 子网掩码 `255.255.255.0`
* 网关 `192.167.18.0`

![](https://fgq233.github.io/imgs/linux/linux05.png)

![](https://fgq233.github.io/imgs/linux/linux06.png)



#### 3. Linux系统配置
```
# 切换到 root 用户
su

# 使用 vim编辑，内容如图
vim /etc/sysconfig/network-scripts/ifcfg-ens33

# 重启网卡
systemctl restart network 

# 检测ip
ifconfig
```

![](https://fgq233.github.io/imgs/linux/linux07.png)

### 三、端口
#### 1. 安装 net-tools 程序
`yum -y install net-tools`

#### 2. 查看本机指定端口号的占用情况
`netstat -anp | grep 端口号`