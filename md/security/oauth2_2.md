### OAuth2 授权码模式、密码模式
使用 Spring Security 实现 OAuth2 入门案例

### 一、创建认证服务、资源服务
#### 1. 创建聚合项目
* 子模块 oauth2-server 服务作为`认证服务器`来使用
* 子模块 oauth2-source 服务作为`资源服务器`来使用

#### 2. pom.xml 相关依赖
```
<!-- oauth2 包含 spring security -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-oauth2</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 二、认证服务
#### 1. application.yml 配置
```
server:
  port: 9001
spring:
  application:
    name: oauth2-server
```

#### 2. 实现 SpringSecurity 认证功能
参考[SpringSecurity 认证](https://fgq233.github.io/md/security/springsecurity2)

* 实现 `UserDetailsService` 接口，用于加载用户信息
* 自定义 `SpringSecurity` 配置，放行认证相关路径、表单登录相关路径

```
@Service
public class UserService implements UserDetailsService {

    private List<User> userList;

    private void initData() {
        String password = new BCryptPasswordEncoder().encode("123456");
        userList = new ArrayList<>();
        userList.add(new User("fgq1", password, AuthorityUtils.commaSeparatedStringToAuthorityList("admin")));
        userList.add(new User("fgq2", password, AuthorityUtils.commaSeparatedStringToAuthorityList("client")));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        initData();
        List<User> list = userList.stream().filter(user -> user.getUsername().equals(username)).collect(Collectors.toList());
        if (!CollectionUtils.isEmpty(list)) {
            return list.get(0);
        }
        return null;
    }
}

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf()
                .disable()
                .authorizeRequests()
                .antMatchers("/oauth/**", "/login/**", "/logout/**")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .formLogin()
                .permitAll();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```


#### 3. OAuth2 认证服务器配置
```
@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()                             
                .withClient("admin")            
                .secret(passwordEncoder.encode("admin123456"))  
                .accessTokenValiditySeconds(3600)       
                .refreshTokenValiditySeconds(864000)    
                .redirectUris("http://www.baidu.com")   
                .scopes("all")                          
                .autoApprove(false)                       
                .authorizedGrantTypes("authorization_code", "password", "refresh_token"); // 授权模式
    }
}
```

客户端可以配置多个，用 `and()` 连接

* `@EnableAuthorizationServer` 开启认证服务器配置
* `inMemory()` 客户端信息存储在内存中
* `withClient()` 客户端的 `client_id`
* `secret()` 客户端的 `client_secret`
* `accessTokenValiditySeconds()` 访问`token`的有效期
* `refreshTokenValiditySeconds()` 刷新`token`的有效期
* `redirectUris()` 重定向地址`redirect_uri`，用于授权成功后跳转
* `scopes()` 申请的权限范围
* `autoApprove()` false 跳转到授权页面，true直接重定向并返回授权码
* `authorizedGrantTypes()` 授权模式
    * `authorization_code`：授权码模式
    * `password`：密码模式
    * `implicit`：简化模式
    * `client_credentials`：客户端凭证模式
    * `refresh_token`：刷新toke，通过以上授权获得的 refresh_token 来获取新的 access_token



### 三、资源服务
#### 1. application.yml 配置
```
server:
  port: 9002
spring:
  application:
    name: oauth2-source
security:
  oauth2:
    client:
      client-id: admin
      client-secret: admin123456
      access-token-uri: http://127.0.0.1:9001/oauth/token
      user-authorization-uri: http://127.0.0.1:9001/oauth/authorize
    resource:
      token-info-uri: http://127.0.0.1:9001/oauth/check_token
```





#### 2. OAuth2 资源服务器配置
```
/**
 * 资源服务器配置
 */
@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/user/**").hasAuthority("admin")
                .anyRequest()
                .authenticated();

    }
}
```

`@EnableResourceServer` 开启资源服务器配置

#### 3. 添加测试接口
```
@RestController
@RequestMapping("/user")
public class UserController {

    @RequestMapping("/getCurrentUser")
    public Object getCurrentUser(Authentication authentication) {
        return authentication.getPrincipal();
    }

}
```



 
 
### 四、授权码模式
授权码模式(`authorization_code`)主要针对第三方应用，是最为复杂也最为安全的一种模式，操作步骤如下
* 请求认证服务器 9001 获取授权码
* 携带授权码，请求认证服务器 9001获取令牌
* 携带令牌，访问资源服务器 9002 的资源

#### 1. 请求认证服务器，获取授权码 
在浏览器访问地址：http://localhost:9001/oauth/authorize?response_type=code&client_id=admin
* `response_type`：授权模式，授权码模式是 `code`（必选项）
* `client_id`：客户端ID `client_id`（必选项）
* `redirect_uri`：获取授权码成功后的重定向URI（可选项）
* `scope`：申请的权限范围（可选项）
* `state`：表示客户端的当前状态，可以指定任意值，认证服务器会原封不动地返回这个值（可选项）
    
  
#### 2. 认证
![SpringSecurity](https://fgq233.github.io/imgs/security/springsecurity1.png)

* 请求授权码，需要资源拥有者先认证，所以会跳转到 `SpringSecurity` 认证地址
* 类似于：网页中使用微信扫码登录，这个前置是需要用户登录自己的微信账号
* 认证后，跳转到下面授权界面，选择 `Approve`，点击 `Authorize` 同意授权

![oauth2](https://fgq233.github.io/imgs/security/oauth2_5.png)


#### 3. 重定向
* [https://www.baidu.com/?code=O97XsI]()
* 同意授权后，自动重定向到 `redirect_uri`，并且携带授权码 `code`


#### 4. 请求认证服务器，获取令牌
* 请求地址：http://localhost:9001/oauth/token
* 请求头：`Authorization : Basic YWRtaW46YWRtaW4xMjM0NTY=`
  * 值为 Basic 拼接 `client_id:client_secret 的Base64编码`
* 表单
  * `grant_type`：授权模式，此处为 `authorization_code`（必选项）
  * `code`：上一步获得的授权码（必选项，授权码只能使用一次）


![oauth2](https://fgq233.github.io/imgs/security/oauth2_9.png)
![oauth2](https://fgq233.github.io/imgs/security/oauth2_7.png)


```
{
    "access_token": "713ea91e-80d7-4d48-95d0-0be601bf0ae5",
    "token_type": "bearer",
    "refresh_token": "e42e02cc-4e99-4c2d-b2d9-14f724e9a489",
    "expires_in": 3599,
    "scope": "all"
}
```
 
 
#### 5. 使用令牌，请求资源
![oauth2](https://fgq233.github.io/imgs/security/oauth2_8.png)


使用令牌，访问：[http://localhost:9002/user/getCurrentUser](http://localhost:9002/user/getCurrentUser)，可以成功访问






### 五、密码模式
#### 1. SecurityConfig 改造
```
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    ......

    /**
     * 使用密码模式需要配置
     */
    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
```

#### 2. AuthServerConfig 改造
* 授权模式添加 `password`
* 重写 `configure(AuthorizationServerEndpointsConfigurer endpoints)` 方法

```
@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    ......

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * 使用密码模式需要配置
     */
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints.authenticationManager(authenticationManager)
                .userDetailsService(userService);   // 使用 refresh_token 模式需要
    }

}
```

#### 3. 测试
无需获取授权码，直接通过账号、密码获取令牌

* 请求地址：`http://localhost:9001/oauth/token`
* 请求头：`Authorization : Basic YWRtaW46YWRtaW4xMjM0NTY=`
  * 值为 Basic 拼接 `client_id:client_secret 的Base64编码`
* 表单
  * `grant_type`：授权模式，此处为 `password`（必选项）
  * `username`：`SpringSecurity`安全认证的用户名（必选项）
  * `password`：`SpringSecurity`安全认证的密码（必选项）
  * `scope`：`all` 权限范围（可选项）

![oauth2](https://fgq233.github.io/imgs/security/oauth2_9.png)
![oauth2](https://fgq233.github.io/imgs/security/oauth2_11.png)



```
{
    "access_token": "234b4c74-be85-4a84-8841-c1a5bc271298",
    "token_type": "bearer",
    "refresh_token": "98619c42-2652-42b5-a423-d029c1fc1a76",
    "expires_in": 3599,
    "scope": "all"
}
```


### 六、刷新 token 模式
* 刷新token(refresh_token)存在时间会比access_token更长
* 用于access_token快过期的时候，调用oauth接口获取到刷新后的token以达到token续期的目的

#### 1. 测试
* 请求地址：`http://localhost:9001/oauth/token`
* 请求头：`Authorization : Basic YWRtaW46YWRtaW4xMjM0NTY=`
  * 值为 Basic 拼接 `client_id:client_secret 的Base64编码`
* 表单
  * `grant_type`：授权模式，此处为 `refresh_token`（必选项）
  * `refresh_token`：`98619c42-2652-42b5-a423-d029c1fc1a76`安全认证的用户名（必选项，之前获取的refresh_token）

![oauth2](https://fgq233.github.io/imgs/security/oauth2_12.png)
