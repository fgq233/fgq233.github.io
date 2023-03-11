### 虚拟机 VMware Workstation中固定Linux操作系统的IP

#### 1. 说明
* 虚拟机中的Linux操作系统，IP地址是通过DHCP服务获取的，重启后可能导致IP地址变更
* 虚拟机配置固定IP需要2个步骤
  * 在`VMware Workstation`中配置IP地址网关、网段
  * 在`Linux`系统中手动修改配置文件，固定IP

#### 2. VMware 配置
![](https://fgq233.github.io/imgs/linux/linux05.png)