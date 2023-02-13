### OAuth2 基于JWT格式存储令牌
本篇基于 [Oauth2 授权码模式、密码模式](https://fgq233.github.io/md/security/oauth2_2)

### 一、认证服务器
#### 1、认证服务器配置
```
/**
 * 认证服务器配置
 */
@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private AuthenticationManager authenticationManager;
    
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

在IOC容器中注入了 `JwtTokenStore、JwtAccessTokenConverter`，并设置给 oauth2 端点

#### 2、使用密码模式测试
![oauth2](https://fgq233.github.io/imgs/security/oauth2_9.png)

```
返回的令牌数据
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzQ5ODUyNzEsInVzZXJfbmFtZSI6ImZncTEiLCJhdXRob3JpdGllcyI6WyJhZG1pbiJdLCJqdGkiOiIzMDBmN2E1ZS1hNjY4LTQ2MDgtYWI2ZS02NjM2YjllMDJmMjMiLCJjbGllbnRfaWQiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdfQ.StJNcRoZVyIj681F-lwyAGsK5SBVkONeo8NFXjtDZkY",
    "token_type": "bearer",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJmZ3ExIiwic2NvcGUiOlsiYWxsIl0sImF0aSI6IjMwMGY3YTVlLWE2NjgtNDYwOC1hYjZlLTY2MzZiOWUwMmYyMyIsImV4cCI6MTY3NTg0NTY3MSwiYXV0aG9yaXRpZXMiOlsiYWRtaW4iXSwianRpIjoiYTkwZGJiZmItZjk2Yi00MDI0LThhZTYtMjk5MjIzODQzYzg3IiwiY2xpZW50X2lkIjoiYWRtaW4ifQ.NCaRC-ft5tumPuA4dNr7wFrafmJiclyjLnzlxD-2J0g",
    "expires_in": 3599,
    "scope": "all",
    "jti": "300f7a5e-a668-4608-ab6e-6636b9e02f23"
}

将 access_token 拿到 https://jwt.io 网站解析，获得的载荷 PAYLOAD 内容为：
{
  "exp": 1674985271,
  "user_name": "fgq1",
  "authorities": [
    "admin"
  ],
  "jti": "300f7a5e-a668-4608-ab6e-6636b9e02f23",
  "client_id": "admin",
  "scope": [
    "all"
  ]
}
```


### 二、JWT 增强
#### 1. JWT 增强类
项目中有时候需要扩展 `JWT` 中存储的内容，可以实现 `TokenEnhancer` 接口创建增强类 

```
/**
 * Jwt内容增强器
 */
public class JwtTokenEnhancer implements TokenEnhancer {

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        Map<String, Object> info = new HashMap<>();
        info.put("author", "fgq");
        info.put("age", "18");
        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(info);
        return accessToken;
    }
}
```

#### 2. 认证服务器配置
```
/**
 * 认证服务器配置
 */
@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private AuthenticationManager authenticationManager;

    // ......

    /**
     * token 令牌存储为 JWT 格式
     */
    @Bean
    public TokenStore jwtTokenStore() {
        return new JwtTokenStore(jwtAccessTokenConverter());
    }

    /**
     * JWT 内容增强
     */
    @Bean
    public JwtTokenEnhancer jwtTokenEnhancer() {
        return new JwtTokenEnhancer();
    }

    /**
     * token 令牌转换为JWT的转换器
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
        // token 增强链
        TokenEnhancerChain enhancerChain = new TokenEnhancerChain();
        List<TokenEnhancer> enhancerList = new ArrayList<>();
        enhancerList.add(jwtTokenEnhancer());        // JWT内容增强器
        enhancerList.add(jwtAccessTokenConverter()); // JWT转换器
        enhancerChain.setTokenEnhancers(enhancerList);
        
        endpoints
                .allowedTokenEndpointRequestMethods(HttpMethod.GET, HttpMethod.POST)
                .authenticationManager(authenticationManager)            // 认证管理器(密码模式需要)
                .tokenStore(jwtTokenStore())                            // token 令牌保存策略
                .tokenEnhancer(enhancerChain);                          // token 增强链
    }
}
```

* `JwtAccessTokenConverter、JwtTokenEnhancer` 都实现了 `TokenEnhancer`，属于 Token增强
* 将增强链设置给 oauth2 端点


#### 3、密码模式测试
* 使用密码模式测试
* 将返回的token数据中 access_token 拿到 [https://jwt.io](https://jwt.io) 网站解析，获得的载荷 PAYLOAD 内容为：

```
{
  "user_name": "fgq1",
  "author": "fgq",      // token增强内容
  "age": "18",          // token增强内容
  "scope": [
    "all"
  ],
  "exp": 1674987956,
  "authorities": [
    "admin"
  ],
  "jti": "ec7880d6-d0c6-4bf0-9257-30d86b72dae5",
  "client_id": "admin"
}
```


### 三、资源服务器解析 JWT 令牌内容
#### 1. 添加依赖
```
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.0</version>
</dependency>
```

#### 2. 新增测试接口
```
@RestController
@RequestMapping("/user")
public class UserController {
    
    @RequestMapping("/getCurrentJwtUser")
    public Object getCurrentJwtUser(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.replaceAll("bearer ", "");
        return Jwts.parser()
                .setSigningKey("test_key".getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(token)
                .getBody();
    }
}
```

#### 3. 使用 JWT 格式 Token测试接口
* 先使用授权码模式或密码模式获取JWT格式的token
* 再使用 token 请求资源服务器 [http://localhost:9002/user/getCurrentJwtUser](http://localhost:9002/user/getCurrentJwtUser)

![oauth2](https://fgq233.github.io/imgs/security/oauth2_10.png)
