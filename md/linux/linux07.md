### Linux 系统时间、时区

#### 1. date 命令
作用：查看系统时间


#### 2. 修改时区
* `date` 默认系统时间不是东八区时区
* 使用 `root` 权限，执行如下命令，修改时区为东八区时区
  * `rm -f /etc/localtime`
  * `ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime`


#### 3. ntp 程序
* 作用1：自动联网校准系统时间
* 作用2：使用 `ntpdate` 命令手动校准

```
# 安装
yum -y install ntp
# 启动
systemctl start ntpd
# 开机自启
systemctl enable ntpd

# 手动校准：ntpdate命令 + 阿里云提供的服务网址 
ntpdate -u ntp.aliyun.com
```