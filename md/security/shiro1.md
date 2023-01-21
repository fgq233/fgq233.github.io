###  Shiro 相关概念
Apache Shiro是一个Java安全框架，实现用户身份认证，权限授权、加密、会话管理等功能

### 一、Shiro 概述
#### 1. Shiro 架构图
![shiro](https://fgq233.github.io/imgs/java/shiro1.png)

#### 2. Subject
* `Subject`：主体，可以是一个通过浏览器发出请求的用户，也可以是一个运行的程序
* `Subject`在 `Shiro` 是一个接口，接口中定义了认证、授权相关方法，
外部程序通过`Subject`进行认证、授权，而`Subject`通过 `SecurityManager` 安全管理器进行认证、授权
 
#### 3. SecurityManager
* `SecurityManager`:安全管理器，负责对所有 `Subject` 进行安全管理
* `SecurityManager` 是一个接口，继承了 `Authenticator, Authorizer, SessionManager` 
这三个接口
    * 通过 `Authenticator` 进行认证
    * 通过 `Authorizer` 进行授权
    * 通过 `SessionManager` 进行会话管理

```
public interface SecurityManager extends Authenticator, Authorizer, SessionManager {
    Subject login(Subject var1, AuthenticationToken var2) throws AuthenticationException;

    void logout(Subject var1);

    Subject createSubject(SubjectContext var1);
}
```

#### 4. Authenticator
认证器，负责主体 `Subject` 认证的
  
 ```
public interface Authenticator {
    AuthenticationInfo authenticate(AuthenticationToken var1) throws AuthenticationException;
}
```

#### 5. Authorizer
授权器，认证通过后，可以对用户进行授权、检测用户权限

<details>
<summary>Authorizer方法</summary>
<pre><code>
public interface Authorizer {
    boolean isPermitted(PrincipalCollection var1, String var2);

    boolean isPermitted(PrincipalCollection var1, Permission var2);

    boolean[] isPermitted(PrincipalCollection var1, String... var2);

    boolean[] isPermitted(PrincipalCollection var1, List<Permission> var2);

    boolean isPermittedAll(PrincipalCollection var1, String... var2);

    boolean isPermittedAll(PrincipalCollection var1, Collection<Permission> var2);

    void checkPermission(PrincipalCollection var1, String var2) throws AuthorizationException;

    void checkPermission(PrincipalCollection var1, Permission var2) throws AuthorizationException;

    void checkPermissions(PrincipalCollection var1, String... var2) throws AuthorizationException;

    void checkPermissions(PrincipalCollection var1, Collection<Permission> var2) throws AuthorizationException;

    boolean hasRole(PrincipalCollection var1, String var2);

    boolean[] hasRoles(PrincipalCollection var1, List<String> var2);

    boolean hasAllRoles(PrincipalCollection var1, Collection<String> var2);

    void checkRole(PrincipalCollection var1, String var2) throws AuthorizationException;

    void checkRoles(PrincipalCollection var1, Collection<String> var2) throws AuthorizationException;

    void checkRoles(PrincipalCollection var1, String... var2) throws AuthorizationException;
}
</code></pre>
</details> 
 
 
 
#### 6. Realm
* Realm：是认证、授权的数据来源
    * 认证：从数据源获取`身份认证`信息返回
    * 授权：从数据源获取`角色、权限`信息返回
* Realm 可以有1个或多个，可以是JDBC实现、LDAP实现、内存实现等

![shiro](https://fgq233.github.io/imgs/java/shiro3.png)

#### 7. SessionManager、SessionDAO
* `SessionManager`：会话管理器，`Shiro` 定义了一套会话管理，它不依赖web容器的session，
所以shiro可以使用在非web应用上，
也可以将分布式应用的会话集中在一点管理，
此特性可使它实现单点登录
* `SessionDAO`：会话`dao`，是对 `session` 会话操作的一套接口


#### 8. CacheManager
缓存管理器，将用户、角色、权限数据存储在缓存中，提高性能

#### 9. Cryptography
密码管理，`Shiro` 提供了一套加密/解密的组件



### 二、Shiro 认证流程
![shiro](https://fgq233.github.io/imgs/java/shiro2.png)
* `Shiro` 把用户数据封装成 `token`，`token` 一般封装着用户名，密码等信息
* `Subject` 把 `token` 交给 `SecurityManager`，`SecurityManager` 把`token`委托给认证器
`Authenticator` 进行身份验证
* 认证器 `Authenticator` 将传入的 `token`，与数据源 `Realm` 对比，验证 `token` 是否合法

#### 1. 模拟根据用户名从数据库查询密码
```
@Data
public class User {
    private String name;
    private String password;
}


@Service
public class UserService {
    public User findUserByName(String name) {
        User user = new User();
        user.setName(name);
        user.setPassword("666");
        return user;
    }
}
```

#### 2. 自定义Realm
```
public class SimpleRealm extends AuthorizingRealm {

    /**
     * 认证
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        UserService userService = new UserService();
        User user = userService.findUserByName(token.getUsername());
        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(user.getName(), user.getPassword(), this.getName());
        return info;
    }

    /**
     * 鉴权
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

}
```


#### 3. 认证测试
```
// 1、创建 SecurityManager
DefaultSecurityManager securityManager = new DefaultSecurityManager();

// 2、使用工具类让安全管理器生效
SecurityUtils.setSecurityManager(securityManager);

// 3、设置 Realm
securityManager.setRealm(new SimpleRealm());

// 4、使用工具类获得 Subject 主体
Subject subject = SecurityUtils.getSubject();

// 5、模拟请求的账户密码 token
UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken("fgq", "666");

// 6、使用Subject主体去认证(认证失败会抛出异常)
try {
    subject.login(usernamePasswordToken);
} catch (Exception e) {
    e.printStackTrace();
}

// 7、打印认证结果
System.out.println("登录结果:" + subject.isAuthenticated());
```

#### 4. 密码加密
为了安全，我们数据库中存储的密码往往是加密的串

```
@Data
public class User {
    ...略
    private String salt;   // 加密的盐
}

// 加密工具类
public class PassWordUtils {
    public static final String SHA1 = "SHA-1";
    public static final int ITERATIONS = 1024;

    public static String sha1(String input, String salt) {
        return new SimpleHash(SHA1, input, salt, ITERATIONS).toString();
    }
}

@Service
public class UserService {

    public User findUserByName(String name) {
        ...略
        String sqlt = "fgq666666";
        user.setSalt(sqlt);
        // 数据库中密码是加密的
        user.setPassword(PassWordUtils.sha1("666", sqlt));
        return user;
    }
}


public class SimpleRealm extends AuthorizingRealm {

    /**
     * 设置认证加密方式
     */
    @Override
    public void setCredentialsMatcher(CredentialsMatcher credentialsMatcher) {
        HashedCredentialsMatcher matcher = new HashedCredentialsMatcher(PassWordUtils.SHA1);
        matcher.setHashIterations(PassWordUtils.ITERATIONS);
        super.setCredentialsMatcher(matcher);
    }

    /**
     * 认证
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        ...略
        return new SimpleAuthenticationInfo(
                user.getName(),
                user.getPassword(),
                ByteSource.Util.bytes(user.getSalt()),   // 盐
                this.getName());
    }
    ...
}
```

![shiro](https://fgq233.github.io/imgs/java/shiro4.png)