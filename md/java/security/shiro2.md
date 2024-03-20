###  Shiro 认证
### 一、认证流程
![shiro](https://fgq233.github.io/imgs/security/shiro2.png)
* `Shiro` 把用户数据封装成 `token`，`token` 一般封装着用户名，密码等信息
* `Subject` 把 `token` 交给 `SecurityManager`，`SecurityManager` 把`token`委托给认证器
`Authenticator` 进行身份验证
* 认证器 `Authenticator` 将传入的 `token`，与数据源 `Realm` 对比，验证 `token` 是否合法


### 二、认证测试
#### 1. 模拟根据用户名查询用户
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
        // 模拟从数据库查询
        UserService userService = new UserService();
        User user = userService.findUserByName(token.getUsername());
        // 返回身份验证信息
        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(
                        user.getName(), 
                        user.getPassword(), 
                        this.getName());
        return info;
    }

    /**
     * 授权
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

}
```

* `SimpleAuthenticationInfo()`构造方法第一个参数为身份信息中的主身份 `Primary Principal`
* 主身份获取方式
    * `SecurityUtils.getSubject().getPrincipals().getPrimaryPrincipal()`
    *  授权方法中参数 `principalCollection.getPrimaryPrincipal()`


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




### 三、 密码加密
为了安全，我们数据库中存储的密码往往是加密的串

#### 1. Shiro 加密工具加密
```
public class PassWordUtils {
    public static final String SHA1 = "SHA-1";
    public static final int ITERATIONS = 1024;

    public static String sha1(String input, String salt) {
        return new SimpleHash(SHA1, input, salt, ITERATIONS).toString();
    }
}
```


#### 2. 模拟根据用户名查询用户
```
@Data
public class User {
    private String name;
    private String password;
    private String salt;   // 加密的盐
}

@Service
public class UserService {

    public User findUserByName(String name) {
        User user = new User();
        user.setName(name);
        String sqlt = "fgq666666";
        user.setSalt(sqlt);
        // 数据库中密码是加密的
        user.setPassword(PassWordUtils.sha1("666", sqlt));
        return user;
    }
}
```



#### 3. 自定义Realm
```
public class SimpleRealm extends AuthorizingRealm {

    /**
     * 设置认证加密匹配器
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

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }
}
```

#### 4. 源码
查看源码，发现最终认证对比的逻辑如下：

![shiro](https://fgq233.github.io/imgs/security/shiro4.png)

根据定义的匹配器 `HashedCredentialsMatcher`，
对比用户请求的`token` 和 `Realm` 中返回的认证信息`info`
