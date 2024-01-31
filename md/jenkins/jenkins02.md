### Jenkins 服务器常用软件、插件、配置
### 一、软件
#### 1. 安装git
`yum install -y git`

#### 2. 安装 Maven
* 下载地址：https://maven.apache.org/download.cgi
* 此处下载 apache-maven-3.9.6-bin.tar.gz 版本，上传到Jenkins服务器

```
# 解压
tar zxvf apache-maven-3.9.6-bin.tar.gz

# 移动 
mv apache-maven-3.9.6 /usr/local/maven

# /usr/local/maven/conf/settings.xml 配置文件中配置阿里云镜像
# 启动 
/usr/local/maven/bin/mvn
```

### 二、插件
登录Jenkins，`Dashboard > Manage Jenkins > Plugin - available`

#### 1. GitLab 插件
用于从gitlab上拉取代码、认证
* `GitLab Plugin`
* `Gitlab Authentication`
* `Gitlab API`

#### 2. maven 插件  
用于拉取依赖、打包

#### 3. Publish Over SSH 插件
用于 Jenkins 将打包后的文件传输到测试服务器

#### 4. Build Authorization Token Root 插件
用于 Jenkins 使用触发器时构建时，不用认证


### 三、配置
#### 1. 软件地址配置
登录Jenkins，`Dashboard > Manage Jenkins > Tools`
* `Git` `/usr/bin/git`
* `Maven` `/usr/local/maven`

#### 2. 添加 SSH 服务器连接
登录Jenkins，`Dashboard > Manage Jenkins > System > Publish over SSH > 点击新增`
