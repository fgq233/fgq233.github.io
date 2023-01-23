### SpringSecurity 记住我功能
* 记住我功能：认证成功后，关闭浏览器，然后打开浏览器，还是认证成功的状态
* 退出登录后不生效

### 一、实现原理
* 基于 `cookie` 技术
* 认证成功，将 `token` 存入浏览器 `cookie`、数据库存入 `token`
* 再次访问，获取 `cookie` 中 `token`，根据 `token` 去数据库查询，查询到对应信息，则自动认证


### 二、实现
#### 1、数据库建表 persistent_logins
```
CREATE TABLE `persistent_logins` (
    `username` VARCHAR(64) NOT NULL,
    `series` VARCHAR(64) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `last_used` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`series`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
```

注意：这个表结构是固定的


#### 2、注入数据源
需要 `spring-boot-starter-jdbc` 依赖
* `JdbcTokenRepositoryImpl` 继承自 `JdbcDaoSupport` implements
* `setDataSource()` `是JdbcDaoSupport` 里面的方法
* `JdbcDaoSupport` 属于 `package org.springframework.jdbc.core.support` 包下的类

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

```
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private DataSource dataSource;

    @Bean
    public PersistentTokenRepository  persistentTokenRepository() {
        JdbcTokenRepositoryImpl repository = new JdbcTokenRepositoryImpl();
        repository.setDataSource(dataSource);
        return repository;
    }
```


#### 3、SecurityConfig 配置记住我功能
```
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.rememberMe()
                .tokenRepository(persistentTokenRepository())   // token 仓库
                .tokenValiditySeconds(24 * 60 * 60);            // 有效时长
        // ......
    }
}

```

#### 4、登录页面 login.html 配置
* 记住我 `name` 必须是 `remember-me`
* 认证成功后，浏览器会生成一个 `remember-me` 的 `Cookie`

```
记住我<input type="checkbox" name="remember-me"><br/>
```



