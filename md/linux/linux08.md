### 进程、端口、IP

### 一、 进程
#### 1. ps命令
* 作用：查看Linux系统中的进程信息
* 语法：`ps [-e -f]`
  * `-e` 显示出全部的进程
  * `-f` 展示进程全部信息
  
![](https://fgq233.github.io/imgs/linux/linux08.png)

#### 2. 查看指定进程
通过 ps命令、管道符、grep 命令查看指定进程信息
* `ps -ef` 查看所有进程信息
* `ps -ef | grep mysql` 查看带`mysql`信息的进程
* `ps -ef | grep 3306` 查看带`3306`信息的进程

#### 3. 杀死进程
* 语法：`kill -9 进程的pid`
* 可选项`-9` 表示强制关闭进程





### 二、端口
#### 1. 安装 net-tools 程序
`yum -y install net-tools`

#### 2. 查看端口号的占用情况
`netstat -anp | grep 端口号`

#### 3. 查看占用端口的进程
* 查看：`fuser -v -n tcp 3306`
* 杀掉：`kill -9 pid`






### 三、IP
通过 `ifconfig` 命令查看网络接口配置

#### 1. IP 固定
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



#### 3. 网卡配置
```
# 切换到 root 用户
su

# 使用 vim编辑，内容如下
vim /etc/sysconfig/network-scripts/ifcfg-ens33

# 重启网卡
systemctl restart network 

# 检测ip
ifconfig
```



```
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="static"      # 静态分配ip
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="a553ac41-f639-44a2-a335-24bb14193d1b"
DEVICE="ens33"
ONBOOT="yes"

IPADDR=192.167.18.129  # ip地址（static设置）
NETMASK=255.255.255.0  # 子网掩码
GATEWAY=192.167.18.2   # 网关
DNS1=114.114.114.114   # DNS1 地址解析
DNS2=8.8.8.8           # DNS2 地址解析
```




