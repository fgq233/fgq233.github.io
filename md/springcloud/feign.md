### Feign远程调用
* Feign是一个声明式的http客户端，其作用就是帮助我们优雅的实现http请求的发送
* Feign内部集成了ribbon，实现了负载均衡

### 一、使用步骤
#### 1. 引入server依赖
```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### 2. 启动类添加 @EnableFeignClients 注解
#### 3. 编写 Feign 客户端
```
@FeignClient(value = "userservice")
public interface UserClient {

    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```

主要是基于SpringMVC的注解来声明远程调用的信息：
* 服务名称、请求方式、请求路径、请求参数、返回值类型

@FeignClient 注解的常用属性
* value：服务名称
* name：服务名称，与 value 作用相同
* path：请求接口的统一前缀，相当于Controller类上@RequestMapping("/user")
* url：请求地址，设置了url，name会不生效
* configuration：Feign配置，可以自定义Feign的Encoder、Decoder、LogLevel、Contract
* fallback: 定义容错的处理类
* fallbackFactory: 定义容错处理工厂类，当远程调用失败或超时时，会调用对应接口的容错逻辑

```
工厂类熔断：
@Component
public class Hysitx implements FallbackFactory<UserClient> {
    
    @Override
    public UserClient errReturn(Throwable throwable) {
       
        return new UserClient() {
            @Override
            public User findById(Long id) {
                System.out.println("接口调用失败");
                return null;
            }
        };
    }
    
}

普通类熔断：
@Component
public class Hysitx implements UserClient {
    @Override
    public User findById(Long id) {
        System.out.println("接口调用失败");
        return null;
    }
}
```



#### 4. 使用 Feign 客户端远程调用
```
 @Autowired
 private UserClient userClient;

 public User queryUserById(Long userId) {
     return userClient.findById(userId);
 }
```



### 二、Feign 配置
* SpringBoot 实现了Feign 自动装配，同时支持自定义下列配置：

| 类型                   | 作用             | 说明                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| feign.Logger.Level | 修改日志级别     | 包含四种不同的级别：NONE(默认)、BASIC、HEADERS、FULL        |
| feign.codec.Decoder | 响应结果的解析器 | http远程调用的结果做解析，例如解析json字符串为java对象 |
| feign.codec.Encoder | 请求参数编码    | 将请求参数编码，便于通过http请求发送                  |
| feign.Contract      | 支持的注解格式  | 默认是SpringMVC的注解                              |
| feign.Retryer       | 失败重试机制   | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试  |

* 一般默认配置就能满足我们使用，如果要自定义时，只需要创建自定义的@Bean覆盖默认Bean即可

#### 1. 修改日志配置 - 基于配置文件
```
feign:  
  client:
    config: 
      userservice:          # 针对某个服务的配置
        loggerLevel: FULL   # 日志级别 
        
feign:  
  client:
    config: 
      default:              # 用default就是针对所有服务的配置
        loggerLevel: FULL   # 日志级别 
```

#### 2. 修改日志配置 - 基于Java 代码
* a) 定义一个类，然后定义一个Logger.Level的对象：

```
public class XFeignConfiguration  {
    @Bean
    public Logger.Level feignLogLevel(){
        return Logger.Level.BASIC; // 日志级别为BASIC
    }
}
```

* b) 全局生效：放到启动类的 @EnableFeignClients 注解中、或者在配置类上添加注解@Configuration

```
@EnableFeignClients(defaultConfiguration = XFeignConfiguration.class) 

@Configuration
public class XFeignConfiguration  {
    ...
}
```


* c) 局部生效：放到对应的 @FeignClient 注解中

``` 
@FeignClient(value = "userservice", configuration = XFeignConfiguration.class) 
```


### 三、Feign 自定义拦截器
* Feign在发起http请求前，每次都会去执行拦截器中的逻辑，我们可以在拦截器里面做一个通用处理
#### 1、自定义feign拦截器步骤
* 实现 feign.RequestInterceptor接口；
* 实现方法 apply(RequestTemplate template)；
* 设置header属性：template.header(name，values)；
* 设置param属性：template.query(name，values)；

```
public interface RequestInterceptor {
  /**
   * Called for every request. Add data using methods on the supplied {@link RequestTemplate}.
   */
  void apply(RequestTemplate template);
}
```

#### 2、示例
```
@Configuration  // 全局配置
public class BaseFeignConfig {
    /**
     * Feign请求拦截器注入
     */
    @Bean
    @ConditionalOnMissingBean(FeignRequestInterceptor.class)  # 保证只有一个同类型的Bean注入
    public RequestInterceptor feignRequestInterceptor() {
        FeignRequestInterceptor interceptor = new FeignRequestInterceptor();
        log.info("FeignRequestInterceptor [{}]", interceptor);
        return interceptor;
    }

    public static class FeignRequestInterceptor implements RequestInterceptor {
        @Override
        public void apply(RequestTemplate template) {
            // 传递Feign客户端所有请求头
            HttpServletRequest request = ((ServletRequestAttributes)
                    RequestContextHolder.getRequestAttributes()).getRequest();
            Enumeration<String> enumeration = request.getHeaderNames();
            if (enumeration != null) {
                String key;
                while (enumeration.hasMoreElements()) {
                    key = enumeration.nextElement();
                    if (key.equalsIgnoreCase("content-length") || key.equalsIgnoreCase("content-type")) {
                        continue;
                    }
                    template.header(key, request.getHeader(key));
                }
            }
            // 传递Feign客户端所有请求参数
            Enumeration<String> enumeration2 = request.getParameterNames();
            if (enumeration2 != null) {
                String key;
                ;
                while (enumeration2.hasMoreElements()) {
                    key = enumeration2.nextElement();
                    template.query(key, request.getParameter(key));
                }
            }
        }
    }
}
```

* 可以全局生效、局部生效，参考日志配置 


### 四、Feign 修改http请求框架
Feign底层发起http请求依赖于其它的框架，主要是：
* URLConnection：默认实现，不支持连接池
* Apache HttpClient ：支持连接池
* OkHttp：支持连接池

连接池可以因提高Feign的性能，因此可以修改默认配置的URLConnection
#### 1. 使用 HttpClient
```
<!--httpClient的依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>

feign:
  httpclient:
    enabled: true 
```

#### 2. 使用 OkHttp
```
<!--okhttp的依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
</dependency>
        
feign:
  okhttp:
    enabled: true
```

#### 3. 连接池配置
* 修改http请求框架后，支持连接池相关配置

```
feign:
  okhttp:
    enabled: true 
    max-connections: 200            # 最大连接数
    max-connections-per-route: 50   # 单个路径的最大连接数 
    ......
```
 
 
