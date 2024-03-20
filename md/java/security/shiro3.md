###  Shiro 授权
### 一、授权流程
![shiro](https://fgq233.github.io/imgs/security/shiro5.png)


* 主动调用 `Subject.isPermitted/hasRole`等校验权限接口，`Subject`会委托给`SecurityManager`

* `SecurityManager`接着会委托给授权器 `Authorizer`

* `Authorizer` 根据 `Realm` 进行授权

* `Realm` 重写 `doGetAuthorizationInfo()` 方法，将从数据库中查询到的角色、权限集合构成授权对象

* 鉴权：`Realm` 判断授权对象中是否包含检测的角色、权限

PS：授权前必须先通过认证



### 二、授权测试
#### 1. 模拟根据用户名查询角色、权限
```
/**
 * 模拟根据用户名查询角色
 */
public List<String> findRoleByName(String name) {
    List<String> list = new ArrayList<>();
    list.add("admin");
    list.add("dev");
    return list;
}

/**
 * 模拟根据用户名查询权限
 */
public List<String> findPermissionByName(String name) {
    List<String> list = new ArrayList<>();
    list.add("user:add");
    list.add("user:del");
    list.add("user:list");
    return list;
}
```

#### 2. 自定义Realm
```
public class SimpleRealm extends AuthorizingRealm {

    // ... 认证过程

    /**
     * 授权
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 拿到用户认证凭证信息
        String loginName = (String) principalCollection.getPrimaryPrincipal();
        // 从数据库中查询对应的角色、权限
        UserService userService = new UserService();
        List<String> permissions = userService.findPermissionByName(loginName);
        List<String> roles = userService.findRoleByName(loginName);
        // 构建授权对象
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        authorizationInfo.addRoles(roles);
        authorizationInfo.addStringPermissions(permissions);
        return authorizationInfo;
    }

}
```

* 此方法的传入的参数 `PrincipalCollection` 是一个包装对象，表示**用户认证凭证信息**
* 该对象包装了认证方法 `doGetAuthenticationInfo()`方法的返回值的第一个参数，
可以通过 `getPrimaryPrincipal()` 方法拿到此值
* 最后从数据库中拿到对应的角色和资源，构建授权对象




#### 3. 授权测试
```
DefaultSecurityManager securityManager = new DefaultSecurityManager();
SecurityUtils.setSecurityManager(securityManager);
securityManager.setRealm(new SimpleRealm2());
Subject subject = SecurityUtils.getSubject();
UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken("fgq", "666");
try {
    subject.login(usernamePasswordToken);
} catch (Exception e) {
    e.printStackTrace();
}

if (subject.isAuthenticated()) {
    // 角色检测
    System.out.println(subject.hasRole("admin"));
    try {
        subject.checkRole("superAdmin");
    } catch (Exception e) {
        e.printStackTrace();
    }
    // 权限检测
    System.out.println(subject.isPermitted("user:list"));
    try {
        subject.checkPermissions("user:add", "user:del");
        System.out.println("具有user增、删权限");
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```


* `subject.hasRole()、subject.isPermitted()`:有返回值，表示是否有角色、权限
* `subject.checkRole()、subject.checkPermissions()`：无返回值，没有角色、权限的话会抛出异常


