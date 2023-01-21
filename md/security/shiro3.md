###  Shiro 鉴权
### 一、鉴权流程
![shiro](https://fgq233.github.io/imgs/java/shiro5.png)


* 主动调用 `Subject.isPermitted/hasRole`等校验权限接口，`Subject`会委托给`SecurityManager`

* `SecurityManager`接着会委托给授权器 `Authorizer`

* ` Authorizer` 根据 `Realm`去鉴权

* `Realm` 将用户请求的参数封装成`权限对象`，再从重写的 `doGetAuthorizationInfo()` 方法中
获取从数据库中查询到的权限集合

* `Realm` 将传入的权限对象与查出来的权限对象，进行对比，
传入的权限对象在查出来的权限对象中，则返回 `true`，否则返回 `false`

PS：鉴权前必须先通过认证



### 二、鉴权测试
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




### 二、 密码加密
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


#### 2. 模拟根据用户名从数据库查询密码
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

![shiro](https://fgq233.github.io/imgs/java/shiro4.png)

根据定义的匹配器 `HashedCredentialsMatcher`，
对比用户请求的`token` 和 `Realm` 中返回的认证信息`info`