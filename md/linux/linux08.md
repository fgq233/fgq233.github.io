### 虚拟机 VMware 中固定Linux操作系统的IP

#### 1. 说明
* 虚拟机中的Linux操作系统，IP地址是通过DHCP服务获取的，重启后可能导致IP地址变更
* 虚拟机配置固定IP需要2个步骤
  * 在`VMware Workstation`中配置IP地址网关、网段
  * 在`Linux`系统中手动修改配置文件，固定IP

#### 2. VMware 配置
* 编辑 - 虚拟网络编辑器 - `Vmnet8`
* 子网IP `192.167.18.0` 表示`IP`范围为 `192.167.18.0` 到 `192.167.18.254`
* 子网掩码 `255.255.255.0`
* 网关 `192.167.18.0`

![](https://fgq233.github.io/imgs/linux/linux05.png)

![](https://fgq233.github.io/imgs/linux/linux06.png)



#### 3. VMware 配置
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