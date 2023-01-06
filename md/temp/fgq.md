###   ES开启 xpack 安全认证机制
* 说明：ES安装包解压后，默认是没有账号与密码，通过ip:端口就能直接访问，不安全

####  1、 ES 开启 xpack 安全认证机制
* 打开 config\elasticsearch.yml 配置文件，添加下列配置

```
# 开启 xpack 安全认证机制
xpack.security.enabled: true
```

####  2、ES 设置密码
* 在 ES 的bin 目录下运行下面命令，然后设置密码

```
elasticsearch-setup-passwords interactive           
```

注意
* 需要先启动 ES 服务
* 运行命令后，输入y进入密码设置，该命令设置的是多个工具的密码

```
[es@k8snode2 elasticsearch-7.6.2]$ ./bin/elasticsearch-setup-passwords interactive
Initiating the setup of passwords for reserved users elastic,apm_system,kibana,logstash_system,beats_system,remote_monitoring_user.
You will be prompted to enter passwords as the process progresses.
Please confirm that you would like to continue [y/N]y   先输入y进入账号、密码输入模式
 
 # 输入密码、确认密码
Enter password for [elastic]: 
Reenter password for [elastic]: 
Passwords do not match.
Try again.
Enter password for [elastic]: 
Reenter password for [elastic]: 
Enter password for [apm_system]: 
Reenter password for [apm_system]: 
Enter password for [kibana]: 
Reenter password for [kibana]: 
Enter password for [logstash_system]: 
Reenter password for [logstash_system]: 
Enter password for [beats_system]: 
Reenter password for [beats_system]: 
Enter password for [remote_monitoring_user]: 
Reenter password for [remote_monitoring_user]: 
Changed password for user [apm_system]             
Changed password for user [kibana]
Changed password for user [logstash_system]
Changed password for user [beats_system]
Changed password for user [remote_monitoring_user]
Changed password for user [elastic]
```

* 验证：设置完成后，重启ES服务，然后浏览器中运行 http://127.0.0.1:9200/，
输入ES账号、密码，若出现版本信息，则设置成功


####  3、程序中 yml 配置文件
* yml中关于 elasticsearch的配置，需要添加账号username、密码password 

```yaml
elasticsearch:
  nodes: 127.0.0.1:9200
  hostname: 192.168.0.110
  port: 9200
  schema: http
  max-connect-total: 100
  max-connect-per-route: 50
  connection-request-timeout-millis: 3000
  socket-timeout-millis: 30000
  connect-timeout-millis: 3000
  username: elastic         # 账号
  password: elastic666      # 密码
```

#### 4、java代码
* RestHighLevelClient 初始化方法

```java
@Configuration
public class EsClientConfig {

    @Value("${elasticsearch.port}")
    private Integer port;
    @Value("${elasticsearch.schema}")
    private String schema;
    @Value("${elasticsearch.hostname}")
    private String hostname;
    @Value("${elasticsearch.username}")
    private String username;
    @Value("${elasticsearch.password}")
    private String password;

    @Bean(destroyMethod = "close")
    public RestHighLevelClient getClient() {
        RestClientBuilder builder = RestClient.builder(new HttpHost(hostname, port, schema));
        // ES 需开启 xpack 安全认证机制
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
        builder.setHttpClientConfigCallback((HttpAsyncClientBuilder httpAsyncClientBuilder) -> {
            httpAsyncClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
            return httpAsyncClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
        });
        return new RestHighLevelClient(builder);
    }

}
```
