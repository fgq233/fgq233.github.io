### OAuth2 令牌存储为JWT形势
本篇基于 [Oauth2 授权码模式、密码模式](https://fgq233.github.io/md/security/oauth2_2)

### 一、认证服务器改造
#### 1. pom.xml 添加 jwt 依赖
```
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.0</version>
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

    // ...... 

    /**
     * token 令牌存储为 JWT 格式
     */
    @Bean
    public TokenStore jwtTokenStore() {
        return new JwtTokenStore(jwtAccessTokenConverter());
    }

    /**
     *  token 令牌转换为JWT的转换器
     */
    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter accessTokenConverter = new JwtAccessTokenConverter();
        // 配置JWT使用的秘钥
        accessTokenConverter.setSigningKey("test_key");
        return accessTokenConverter;
    }


    /**
     * oauth2 端点数据存储配置
     */
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
                .allowedTokenEndpointRequestMethods(HttpMethod.GET, HttpMethod.POST)
                .authenticationManager(authenticationManager)            // 认证管理器(密码模式需要)
                .tokenStore(jwtTokenStore())                            // token令牌保存策略
                .accessTokenConverter(jwtAccessTokenConverter());
    }
}
```

* 在IOC容器中注入了 `JwtTokenStore、JwtAccessTokenConverter`
* 并设置给 oauth2 端点

#### 3、密码模式测试
![oauth2](https://fgq233.github.io/imgs/java/oauth2_10.jpg)

