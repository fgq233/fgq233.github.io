### Vmvare 克隆后冲突问题解决
### 一、 IP 冲突
#### 1. 打开eth0的配置文件 vim /etc/sysconfig/network-scripts/ifcfg-ens33
```
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="static"
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

IPADDR="192.167.18.129"
NETMASK="255.255.255.0"
GATEWAY="192.167.18.2"
DNS="192.167.18.2"
ZONE=public
```

* 删除 UUID 一行
* 修改 IPADDR


#### 2. 删掉 70-persistent-net.rules文件,此文件删除重启后会自动生成
```
rm -rf /etc/udev/rules.d/70-persistent-ipoib.rules
```

#### 3. 重启
```
reboot -f
```


### 二、 主机名冲突
#### 1. hostnamectl 查看主机名
```
hostnamectl
```

#### 2. 设置新主机名
```
hostnamectl set-hostname "New-CentOS7"
```

#### 3. 设置新主机名
```
hostnamectl set-hostname "New-CentOS7"
```
