### OAuth2 基于数据库存储令牌
本篇基于 [Oauth2 授权码模式、密码模式](https://fgq233.github.io/md/security/oauth2_2)

### 一、认证服务器改造
#### 1. pom.xml 添加 Redis 依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

 
#### 2、认证服务器配置
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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

    /**
     * token令牌保存策略---使用Redis存储
     */
    @Bean
    public TokenStore redisTokenStore() {
        return new RedisTokenStore(redisConnectionFactory);
    }


//    ★★★★★★★★★★★★  主要是重写3个config()方法，配置 oauth2 客户端信息、端点数据存储、安全规则   ★★★★★★★★★★★★

    /**
     * 配置客户端信息数据来源
     */
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
                .withClient("admin")
                .secret(passwordEncoder.encode("admin123456"))
                .accessTokenValiditySeconds(3600)
                .refreshTokenValiditySeconds(864000)
                .redirectUris("http://www.baidu.com")
                .autoApprove(false)
                .scopes("all")
                .authorizedGrantTypes("authorization_code", "password", "refresh_token");
    }

    /**
     * oauth2 端点数据存储配置
     */
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
                .allowedTokenEndpointRequestMethods(HttpMethod.GET, HttpMethod.POST)
                .authenticationManager(authenticationManager)            // 认证管理器(密码模式需要)
                .tokenStore(redisTokenStore());                          // token令牌保存策略
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

* 客户端信息来源于程序内存
* oauth2 令牌相关信息存储在 Redis 中
* 具体代码：[oauth2_server_redis](https://github.com/fgq233/SpringBootX/tree/main/SpringBoo-SpringSecurity-OAuth2) 

