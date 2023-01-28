### OAuth2 入门
使用 Spring Security 实现 OAuth2 入门案例

### 一、创建认证服务器
> 创建一个 oauth2-server 模块作为认证服务器来使用

#### 1. pom.xml 相关依赖
```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-oauth2</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-security</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```


#### 2. application.yml 配置
```
server:
  port: 9001
spring:
  application:
    name: oauth2-server
```

#### 3. 实现 SpringSecurity 认证功能
参考[pringSecurity 认证](https://fgq233.github.io/md/security/springsecurity2)

* 实现 `UserDetailsService` 接口，用于加载用户信息
* 自定义 `SpringSecurity` 配置，允许认证相关路径的访问及表单登录

```
@Service
public class UserService implements UserDetailsService {

    private List<User> userList;

    @PostConstruct
    public void initData() {
        String password = new BCryptPasswordEncoder().encode("123456");
        userList = new ArrayList<>();
        userList.add(new User("fgq1", password, AuthorityUtils.commaSeparatedStringToAuthorityList("admin")));
        userList.add(new User("fgq2", password, AuthorityUtils.commaSeparatedStringToAuthorityList("client")));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
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


#### 4. OAuth2 认证服务器配置
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
                .authorizedGrantTypes("authorization_code"); 
    }
}
```

* `@EnableAuthorizationServer` 开启认证服务器配置

* `inMemory()` 客户端信息存储在内存中

* `withClient()` 客户端的 `client_id`
* `secret()` 客户端的 `client_secret`
* `accessTokenValiditySeconds()` 访问`token`的有效期
* `refreshTokenValiditySeconds()` 刷新`token`的有效期
* `redirectUris()` 重定向地址`redirect_uri`，用于授权成功后跳转
* `scopes()` 申请的权限范围
* `authorizedGrantTypes()`：授权模式
    * `authorization_code`：授权码模式
    * `password`：密码模式


#### 5. 添加测试接口
```
@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/getCurrentUser")
    public Object getCurrentUser(Authentication authentication) {
        return authentication.getPrincipal();
    }

}
```

该接口需要认证成功，才能访问

#### 6. 启动服务




### 二、OAuth2 端点
#### 1. OAuth2 默认端点 URL
* `/oauth/authorize`：授权端点
* `/oauth/token`：令牌端点
* `/oauth/confirm_access`：用户确认授权提交端点
* `/oauth/error`：授权服务错误信息端点
* `/oauth/check_token`：用于资源服务访问的令牌解析端点
* `/oauth/token_key`：提供共有密钥的端点(使用JWT 令牌)

#### 2. 测试步骤
* 通过 `GET` 请求认证服务器获取授权码  
* 通过 `POST` 请求，携带授权码，请求认证服务器获取令牌




### 三、测试
#### 1. 请求认证服务器，获取授权码 
在浏览器访问地址：`http://localhost:9001/oauth/authorize?response_type=code&client_id=admin`
* `response_type`：授权模式，授权码模式是 `code`（必选项）
* `client_id`：客户端ID `client_id`（必选项）
* `redirect_uri`：获取授权码成功后的重定向URI（可选项）
* `scope`：申请的权限范围（可选项）
* `state`：表示客户端的当前状态，可以指定任意值，认证服务器会原封不动地返回这个值（可选项）
    
  
#### 2. 认证
![SpringSecurity](https://fgq233.github.io/imgs/java/springsecurity1.png)

* 请求授权码，需要资源拥有者先认证，所以会跳转到 `SpringSecurity` 认证地址
* 类似于：网页中使用微信扫码登录，这个前置是需要用户登录自己的微信账号
* 认证后，跳转到下面授权界面，选择 `Approve` 同意授权

![oauth2](https://fgq233.github.io/imgs/java/oauth2_5.png)


#### 3. 重定向
 `https://www.baidu.com/?code=O97XsI`
 
同意授权后，自动重定向到 `redirect_uri`，并且携带授权码 `code`


#### 4. 请求认证服务器，获取令牌
在 `postman` 访问地址：`http://client:secret@localhost:9001/oauth/token`
* `grant_type`：授权模式，此处为 `authorization_code`（必选项）
* `code`：上一步获得的授权码（必选项）


 













