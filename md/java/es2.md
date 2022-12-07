###  Elasticsearch 在 Windows下环境安装
###  一、 Elasticsearch
####  1、 下载、启动
* [elasticsearch下载](https://www.elastic.co/cn/downloads/elasticsearch)

* ES 高版本内置jdk，低版本依赖系统安装的jdk
* 解压后运行 bin\elasticsearch.bat 启动服务
* 首次启动服务会显示一些配置信息，包括默认的用户密码，默认访问端口 9200
* 启动成功后访问：[https://localhost:9200](https://localhost:9200)，会返回一个包含ES配置的json

#####  2、配置 Elasticsearch 服务
* 将 bin 目录安装到系统环境变量
* 安装服务
`elasticsearch-service.bat install`

 * 启动服务
 `elasticsearch-service.bat start`

 * 停止服务
 `elasticsearch-service.bat stop`


 * 卸载服务
 `elasticsearch-service.bat remove`

配置服务的好处是可以让 Elasticsearch 自动启动

####  3、elasticsearch.yml 其他配置
* 默认端口 `http.port`
* https协议切换为http：将xpack.security...安全机制全部设置为false
* es默认是开发者模式，绑定的是 127.0.0.1，生产模式设置  `network.host: 0.0.0.0`





###  二、 kibana
####  1、 下载、启动
* [kibana下载](https://www.elastic.co/cn/downloads/past-releases#kibana)

* 安装的 kibana 版本必须和 Elasticsearch 一致
* 解压后运行 bin\kibana.bat 启动服务
* 启动成功后访问：[http://localhost:5601](http://localhost:5601)
* 首次启动需要使用ElasticSearch的Token，可通过下面命令重新生成
```
elasticsearch-create-enrollment-token.bat --scope kibana
```

####  2、中文界面
* 修改 config\kibana.yml 文件，将 i18n.locale: “en”, 改为 i18n.locale: “zh-CN”


####  三、 IK中文分词器
####  1、 下载、安装
* [IK分词器](https://github.com/medcl/elasticsearch-analysis-ik/tags)
* 在 ES 的plugins目录下新建ik文件夹下，将ik安装包解压放进去，然后重启 ES

##### 2、 分词粒度
* IK中文分词器包含两种模式
    * ik_smart：粗粒度
    * ik_max_word：细粒度
    
####  3、 扩展字典、停止词字典
* config目录中的IkAnalyzer.cfg.xml文件可以配置扩展字典、停止词字典


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

    