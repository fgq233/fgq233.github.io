###  Elasticsearch 在Windows下搭建环境
###  一、 Elasticsearch
####  1、 下载、启动
* 下载地址：[https://www.elastic.co/cn/downloads/elasticsearch](https://www.elastic.co/cn/downloads/elasticsearch)

* ES 高版本内置jdk，低版本依赖系统安装的jdk
* 解压后运行 bin 目录下 elasticsearch.bat 启动服务
* 首次启动服务会显示一些配置信息，包括默认的用户密码，默认访问端口 9200
* 启动成功后访问：[http://localhost:9200](http://localhost:9200)，会返回一个包含ES配置的json

####  2、配置 Elasticsearch 服务
* 先将 bin 目录安装到系统环境变量

```
# 安装服务
elasticsearch-service.bat install

# 启动服务
elasticsearch-service.bat start

# 停止服务
elasticsearch-service.bat stop

# 卸载服务
elasticsearch-service.bat remove
```


####  3、elasticsearch.yml 常用配置
```
# 节点名称
node.name: node-1

# 端口
http.port: 9200

# ip设置
network.host: 0.0.0.0
discovery.seed_hosts: ["127.0.0.1"]
cluster.initial_master_nodes: ["node-1"]
```

设置ip后必须开启下列设置之一
* 集群主机列表 `discovery.seed_hosts: ["127.0.0.1"]`
* 初始化的主节点 `cluster.initial_master_nodes: ["node-1"]`
* 基于配置文件配置集群主机列表 `discovery.seed_providers`




###  二、 kibana
####  1、 下载、启动
* 下载地址：[https://www.elastic.co/cn/downloads/past-releases#kibana](https://www.elastic.co/cn/downloads/past-releases#kibana)

* 安装的 kibana 版本必须和 Elasticsearch 一致
* 解压后运行 bin 目录下 kibana.bat 启动服务
* 启动成功后访问：[http://localhost:5601](http://localhost:5601)


####  2、kibana.yml 常用设置
```
# 中文界面
i18n.locale: "zh-CN"

# ES的IP(当 ES 和 kibana 不在同一台服务器，或者端口不是默认端口，需要该设置)
elasticsearch.hosts: ["http://127.0.0.1:9200"]
```

###  三、 IK中文分词器
####  1、 下载、安装
* 下载地址：[https://github.com/medcl/elasticsearch-analysis-ik/tags](https://github.com/medcl/elasticsearch-analysis-ik/tags)
* 在 ES 的plugins目录下新建ik文件夹下，将ik安装包解压放进去，然后重启 ES

#### 2、 分词粒度
IK中文分词器包含两种模式
* ik_smart：粗粒度
* ik_max_word：细粒度
    
####  3、 扩展字典、停止词字典
* config目录中的IkAnalyzer.cfg.xml文件可以配置扩展字典、停止词字典
* 扩展字典、停止词字典可以配置成远程http接口地址，这样可以让词库热更新


```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
	<comment>IK Analyzer 扩展配置</comment>
	<!--扩展字典 -->
	<entry key="ext_dict">ext.dic</entry>
	 <!--扩展停止词字典-->
	<entry key="ext_stopwords">stop.dic</entry>
	
	<!--远程扩展字典 -->
	<!-- <entry key="remote_ext_dict">words_location</entry> -->
	<!--远程扩展停止词字典-->
	<!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

###  四、 ES开启 xpack(单机版)
####  1、 ES 开启 xpack、SSL传输
配置 elasticsearch.yml

```
# 开启 xpack 安全认证机制
xpack.security.enabled: true

# 启用SSL传输
xpack.security.transport.ssl.enabled: true
```

####  2、ES 设置密码
```
# 手动生成(推荐)
bin/elasticsearch-setup-passwords interactive 

# 自动生成     
bin/elasticsearch-setup-passwords auto                  # 
```

* 需要先启动 ES，然后才能设置密码
* 设置过一次就不能再执行了，按照下面步骤重新设置
  * 注释掉  `xpack.security.enabled: true`, 重启 ES 服务
  * 查询`GET /_cat/indices`，有个索引 `.security-7`，,删除此索引 `DELETE /.security-7` 回到无密码状态
  * 从步骤 1 开始重新设置


####  3、配置kibana.yml
```
# kibanna 账号密码
elasticsearch.username: "kibana"
elasticsearch.password: "elastic666"

# 去除 kibana 启动时的 warning
xpack.reporting.encryptionKey: "a_random_string"
xpack.security.encryptionKey: "something_at_least_32_characters"
xpack.encryptedSavedObjects.encryptionKey: "something_at_least_32_characters"
```

* 启动后，访问ES需要输入elastic用户的密码，这个账号是全局管理权限
* 如果需要创建kibana的只读用户，可以通过管理–用户–新建用户，对用户进行角色授权即可
* 用户名和密码可以采用密文的方式，如下将用户名密码添加到`data/kibana.keystore`，然后把配置文件中明文用户名密码设置去掉：

```
bin/kibana-keystore --allow-root create
bin/kibana-keystore --allow-root add elasticsearch.username  # 输入kibana
bin/kibana-keystore --allow-root add elasticsearch.password  # 输入密码
```



###  四、 ES开启 xpack(集群版)
####  1、 ES 生成 CA 证书
```
bin/elasticsearch-certutil ca                                   #生成 CA 证书
bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12       #使用证书生成p12秘钥    
```

* 期间会提示输入密码，直接一路回车即可，不需要给秘钥再添加密码
* 最终在安装目录下生成文件：elastic-stack-ca.p12
* 将文件复制到config目录下、以及集群中其它所有节点config目录下


####  2、 ES 开启 xpack、SSL传输
```
# 开启 xpack 安全认证机制
xpack.security.enabled: true

# 开启SSL传输
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-stack-ca.p12
xpack.security.transport.ssl.truststore.path: elastic-stack-ca.p12
```


####  3、ES 设置密码(同上)
####  4、配置kibana.yml(同上)


###  五、 ES开启 https
elasticsearch.yml 中添加配置

```
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.verification_mode: certificate
xpack.security.http.ssl.keystore.path: elastic-stack-ca.p12             
xpack.security.http.ssl.truststore.path: elastic-stack-ca.p12
```
