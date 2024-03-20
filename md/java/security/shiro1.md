###  Shiro 基本概念
Apache Shiro是一个Java安全框架，实现了认证、授权、加密、会话管理等功能

#### 1. 架构图
![shiro](https://fgq233.github.io/imgs/security/shiro1.png)

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
认证器，负责主体 `Subject` 认证
  
 ```
public interface Authenticator {
    AuthenticationInfo authenticate(AuthenticationToken var1) throws AuthenticationException;
}
```

#### 5. Authorizer
授权器，认证通过后，可以对用户进行授权

```
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
```
 
 
 
#### 6. Realm
* Realm：是认证、授权的数据来源
    * 认证：从数据源获取`身份认证`信息返回
    * 授权：从数据源获取`角色、权限`信息返回
* Realm 可以有1个或多个，可以是JDBC实现、LDAP实现、内存实现等

![shiro](https://fgq233.github.io/imgs/security/shiro3.png)

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

