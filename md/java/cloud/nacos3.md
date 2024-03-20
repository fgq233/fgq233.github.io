### Nacos 配置中心
#### 一. 配置中心原理
SpringBoot中的bootstrap.yaml配置文件，会在application.yml之前被读取，所以可以将nacos地址
配置在bootstrap.yaml中，项目启动时，先读取bootstrap.yaml，拿到nacos地址，再去拉取nacos中管理的配置，
并且与本地的application.yml配置合并，最终完成项目启动

![配置中心原理](https://fgq233.github.io/imgs/springcloud/nacos1.png)


### 二. 配置中心使用步骤
#### 1. 客户端引入依赖
```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

#### 2. bootstrap.yml 配置
* bootstrap.yml支持profiles，如果配置了值，如dev，SpringBoot就会额外加载bootstrap-dev.yaml 
后合并到bootstrap.yml中，若其中有相同的配置则覆盖掉
* bootstrap.yml的 profiles 同时也是nacos 配置文件名的规则之一                       
* 三要素：`服务名称、运行环境(可省略)、文件后缀名`                           
                           
```
spring:
  application:
    name: userservice        # 服务名称
  profiles:
    active: dev              # 运行环境
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      config:
        file-extension: yaml    # 文件后缀名
```

#### 3. 在nacos 新增配置文件
* 三要素决定服务启动时读取 nacos 哪个配置文件                   
* Data ID规则：`${服务名}-${spring.profiles.active}.${file-extension}`                         
* 上述配置中，新增的配置文件 Data ID 就是 userservice-dev.yaml





### 三. 多环境共享配置、多服务共享配置、优先级
#### 1、多环境共享配置文件
服务启动时，会读取nacos多个配置文件：
* `${服务名}-${spring.profiles.active}.${file-extension}` ，如：userservice-dev.yaml
* `${服务名}.${file-extension}` ，如：userservice.yaml

第二个就是多环境共享配置，不论 `profiles`环境值是什么都会读取


#### 2、多服务共享配置
不同微服务之间可以共享配置文件，通过下面的两种方式来指定：
* 方式一：扩展配置

```
# 单个：
spring:
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      config:
        file-extension: yaml
        extension-configs: extension.yaml

# 多个  
spring:
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      config:
        file-extension: yaml
        extension-configs:
          - data-id: extension1.yaml
          - data-id: extension2.yaml
```

* 方式二：共享配置

```
# 单个
spring:
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      config:
        file-extension: yaml
        shared-configs: shared.yaml
# 多个  
spring:
  cloud:
    nacos:
      server-addr: http://127.0.0.1:8848
      config:
        file-extension: yaml
        shared-configs:
          - data-id: shared1.yaml
          - data-id: shared2.yaml
```

* `dataId、data-id` 写法都可以
* 优先级：扩展配置`extension-configs` > 共享配置`shared-configs`
* 同为扩展配置，后配的优先级更高：`extension-configs[1] > extension-configs[0]`
* 同为共享配置，后配的优先级更高：`shared-configs[1] > shared-configs[0]`

#### 3、各个配置文件优先级
* a) nacos配置：`userservice-dev.yaml`
* b) nacos多环境共享配置：`userservice.yaml`
* c) nacos多服务扩展配置：`extension.yaml`
* d) nacos多服务共享配置：`shared.yaml`
* e) 本地配置：`application.yml` 

优先级：`a > b > c > d > e`


#### 4、修改本地配置优先级
开发中，常常需要使用本地配置最高，通过下面配置来完成
```
spring:
  cloud:
    config:
      allow-override: true      # 为true时，允许nacos被本地文件覆盖
      override-none: true       # 为true时，nacos不覆盖任何本地文件
```
      

      
### 四. 配置中心热更新
* 如果要实现 nacos 配置文件修改后，服务无需重启就可以感知，有2种方式：
* 注意： `共享配置、扩展配置`要支持热更新必须添加 `refresh = true`

```
# 添加 refresh，支持热更新
extension-configs:
  - data-id: db_single.yaml
    refresh: true
```

##### 1. 在@Value注入的变量所在类上添加注解@RefreshScope
```
@RestController
@RequestMapping("/user")
@RefreshScope
public class UserController {

     @Value("${pattern.dateformat}")
     private String dateformat;
}   
```

##### 2. 使用SpringBoot读取配置文件的注解 @ConfigurationProperties
```
@Data
@Component
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {
    private String dateformat;
    private String ext;
    private String shared;
}
```


