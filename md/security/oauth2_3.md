### OAuth2 基于数据库存储令牌
* 认证服务器配置中：`clients.inMemory()` 是把客户端信息全部存储在内存当中
* 本篇基于上一篇 [Oauth2 授权码模式、密码模式](https://fgq233.github.io/md/security/oauth2_2)

### 一、数据库
#### 1. 创建数据库、导入oauth2 相关表
* `oauth_access_token`
* `oauth_approvals`
* `oauth_client_token`
* `oauth_code`
* `oauth_refresh_token`
* `oauth_client_details` 客户端详情信息
  * `client_id`：客户端标识
  * `client_secret`：客户端密码，此处不能是明文，使用 `BCryptPasswordEncoder()` 加密即可
  * `scope`：授权范围
  * `authorized_grant_types`：授权模式
  * `web_server_redirect_uri`：重定向地址

插入2条客户端信息

```
INSERT INTO `oauth_client_details` (`client_id`, `client_secret`, `scope`, `authorized_grant_types`, `web_server_redirect_uri`) 
	VALUES ('admin', '$2a$10$fVrt8ZZAvz47Ypa2wSZEGeVI3J.uwYlPr2fWQp7B/as3L5bxXbWAS', 'all', 'authorization_code,password', 'http://www.baidu.com');
INSERT INTO `oauth_client_details` (`client_id`, `client_secret`, `scope`, `authorized_grant_types`, `web_server_redirect_uri`) 
	VALUES ('dev', '$2a$10$fVrt8ZZAvz47Ypa2wSZEGeVI3J.uwYlPr2fWQp7B/as3L5bxXbWAS', 'all', 'authorization_code', 'http://www.baidu.com');
```


#### 2. pom.xml 添加数据库驱动、JDBC依赖
```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

#### 3. application.yml 配置
```
server:
  port: 9001
spring:
  application:
    name: oauth2-server-jdbc
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/oauth2?useSSL=false&serverTimezone=UTC
    username: root
    password: 19931126
    driver-class-name: com.mysql.cj.jdbc.Driver
```
 
 
 
### 二、认证服务器配置
```
/**
 * 认证服务器配置
 */
@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private DataSource dataSource;

    
    /**
     * 客户端信息数据来源---来自数据库(oauth_client_details表)
     */
    @Bean
    public JdbcClientDetailsService jdbcClientDetailsService() {
        return new JdbcClientDetailsService(dataSource);
    }
    
    /**
     * 授权码保存策略---使用数据库存储(oauth_code表)
     */
    @Bean
    public AuthorizationCodeServices authorizationCodeServices() {
        return new JdbcAuthorizationCodeServices(dataSource);
    }

    /**
     * token令牌保存策略---使用数据库存储(oauth_access_token表)
     */
    @Bean
    public TokenStore jdbcTokenStore() {
        return new JdbcTokenStore(dataSource);
    }

    /**
     * token令牌管理
     */
    @Bean
    public AuthorizationServerTokenServices tokenServices() {
        DefaultTokenServices tokenServices = new DefaultTokenServices();
        tokenServices.setClientDetailsService(jdbcClientDetailsService());    // 客户端信息数据来源
        tokenServices.setSupportRefreshToken(true);             // 支持刷新 token
        tokenServices.setTokenStore(jdbcTokenStore());          // token保存策略
        tokenServices.setAccessTokenValiditySeconds(3600);      // token 有效期 1h
        tokenServices.setRefreshTokenValiditySeconds(864000);   // 刷新令牌有效期 24h
        return tokenServices;
    }


    
//    ★★★★★★★★★★★★  主要是重写3个config()方法，配置 oauth2 客户端信息、端点数据存储、安全规则   ★★★★★★★★★★★★

    /**
     * 配置客户端信息数据来源
     */
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.withClientDetails(jdbcClientDetailsService());
    }

    /**
     * oauth2 端点数据存储配置
     */
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints)  {
        endpoints
                .authenticationManager(authenticationManager)            // 认证管理器，密码模式需要
                .authorizationCodeServices(authorizationCodeServices())  // 授权码管理
                .tokenStore(jdbcTokenStore())                            // token存储
                .tokenServices(tokenServices());                         // token令牌管理
    }

    /**
     * oauth2 端点安全访问配置，也就是 OAuth2 自带的那几个端点 URL 安全约束
     */
    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) {
        security.tokenKeyAccess("permitAll()")          // 放行 /oauth/token_key，不用认证就可以访问
                .checkTokenAccess("isAuthenticated()")  // 开启 /oauth/check_token 安全认证，需要认证才可以访问
                .allowFormAuthenticationForClients();   // 允许表单认证
    }

}
```

其他和基于内存存储基本一致