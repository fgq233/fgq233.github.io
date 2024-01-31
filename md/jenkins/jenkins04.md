### Jenkins + Gitlab  + Maven 构建、部署
新建 Item (Maven 项目)
### 一、 Item 配置
#### 1. 源码管理
* 选择git，填入gitlab项目地址
* 指定分支

![7](https://fgq233.github.io/imgs/jenkins/007.jpg)

#### 2. Pre Steps
* 构建的前置步骤
  * 此处选择 `Send files or execute commands over SSH`
  * 判断目标服务器项目 jar 是否正在运行，是的话杀死进程，清除之前传递的文件
* `mkdir -p /root/shell`
* `vim /root/shell/test.sh`，shell脚本内容如下方所示
* `chmod 777 /root/shell/test.sh` 添加权限

```
# 获取 jar 运行的进行 pid，
# $1是运行shell脚本传的第一个参数，如： 运行 test.sh aaa bbb 中 aaa就是第一个参数
pid=`ps -ef | grep $1 | grep 'java -jar' | awk '{printf $2}'`

# 使用 -z 判断 pid 是否为空，不为空则杀死进程
if [ -z $pid ];
        then
              echo 'jar not running'
        else
              kill -9 $pid
              echo 'kill running jar......'
fi

# 删除Jenkins生成的目录
rm -rf /root/app
```

![10](https://fgq233.github.io/imgs/jenkins/010.png)


#### 3. Bulid 
构建

#### 4. Post Steps
构建的后置步骤，此处选择 `Send files or execute commands over SSH`，传输文件到另外一台SSH服务器
* `Source files` Jenkins 构建后要传输到目标服务器的文件，可以使用通配符
* `Remove prefix`    去除复制的目录前缀路径
* `Remote directory` 要传输到目标服务器的路径
* `Exec command`     传输后在目标服务器要执行的命令


![8](https://fgq233.github.io/imgs/jenkins/008.jpg)
![9](https://fgq233.github.io/imgs/jenkins/009.png)


### 二、 构建
* 点击 Item 绿色按钮开始构建
* 构建时，会把Gitlab项目源码下载到 `/root/.jenkins/workspace` 目录下
* 构建过程
  * 拉取 Gitlab 项目源码
  * 根据项目 pom.xml 下载依赖
  * 打包，打好的包在 `/root/.jenkins/workspace/test/target/SpringBootTest-0.0.1-SNAPSHOT.jar`
* 执行后置步骤
  * 将打好的jar包传输到目标服务器 (`/root/app/target/SpringBootTest-0.0.1-SNAPSHOT.jar`)
  * 目标服务器运行命令，启动jar


 
