###  Shiro 过滤器
### 一、Shiro 中常用的过滤器
#### 1. DefaultFilter
`Shiro` 内置了很多过滤器，主要是认证、授权相关的，参考 `org.apache.shiro.web.filter.mgt.DefaultFilter` 
中的枚举过滤器

```
public enum DefaultFilter {
    anon(AnonymousFilter.class),
    authc(FormAuthenticationFilter.class),
    authcBasic(BasicHttpAuthenticationFilter.class),
    authcBearer(BearerHttpAuthenticationFilter.class),
    logout(LogoutFilter.class),
    noSessionCreation(NoSessionCreationFilter.class),
    perms(PermissionsAuthorizationFilter.class),
    port(PortFilter.class),
    rest(HttpMethodPermissionFilter.class),
    roles(RolesAuthorizationFilter.class),
    ssl(SslFilter.class),
    user(UserFilter.class),
    invalidRequest(InvalidRequestFilter.class);
    ......
}
```

#### 2. 认证相关
* `authc `：基于表单的过滤器，即需要登录认证才能访问，不然会跳转至配置的 loginUrl 
* `anon  `：匿名过滤器，即不需要登录认证即可访问，一般用于静态资源、登录页过滤 
* `logout`：退出过滤器，配置认证退出成功后重定向的地址  
* `user  `：用户过滤器，需要`已经登录认证`或`记住我` 的用户才能访问   


#### 3. 授权相关
* `roles`：角色授权过滤器，验证用户是否拥有**所有角色**  
* `perms`：权限授权过滤器，验证用户是否拥有**所有权限** 
* `ssl  `：SSL过滤器，只有请求协议是https才能通过 
* `port `：端口过滤器 
* `rest `：reset风格过滤器 

 
### 二、配置过滤器
#### 1、配置过滤规则
通常我们会创建 ShiroConfig 配置类，然后在里面配置过滤规则

```
/**
 * 过滤器链  (顺序从上到下,优先级依次降低)
 */
private Map<String, String> filterChainMap() {
    Map<String, String> map = new LinkedHashMap<>();
    // 静态资源不拦截
    map.put("/static/**", "anon");
    // 登录链接、异常链接不拦截
    map.put("/login", "anon");
    map.put("/error", "anon");
    // 其他链接都是需要登录的
    map.put("/**", "authc");
    return map;
}

/**
 * 自定义的过滤器
 */
private Map<String, Filter> customfilters() {
    Map<String, Filter> map = new HashMap<>();
    map.put("roles-or", new RolesOrFilter());
    return map;
}

/**
 * shiro过滤器管理
 */
@Bean
public ShiroFilterFactoryBean shiroFilterFactoryBean() {
    ShiroFilterFactoryBean shiroFilter = new ShiroFilterFactoryBean();
    // 设置安全管理器
    shiroFilter.setSecurityManager(defaultWebSecurityManager());

    // 默认的登陆访问url
    shiroFilter.setLoginUrl("/login");
    // 登陆成功后跳转的url
    shiroFilter.setSuccessUrl("/");
    // 没有权限跳转的url
    shiroFilter.setUnauthorizedUrl("/error");

    // 添加自定义的过滤器
    shiroFilter.setFilters(customfilters());
    // 过滤器链
    shiroFilter.setFilterChainDefinitionMap(filterChainMap());
    return shiroFilter;
}
```


#### 2、自定义过滤器
Shiro 默认的过滤器不一定满足需求，有时候需要我们自定义过滤器
* roles(RolesAuthorizationFilter.class)，默认`角色权限过滤器`需要满足定义的`所有角色`才能访问
* /admin/order= roles["admin, root"] ，只有当放问该接口同时具备admin和root两种角色时，才可以被访问
    
```java
public class RolesAuthorizationFilter extends AuthorizationFilter {
    public RolesAuthorizationFilter() {
    }

    public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws IOException {
        Subject subject = this.getSubject(request, response);
        String[] rolesArray = (String[])mappedValue;
        if (rolesArray != null && rolesArray.length != 0) {
            Set<String> roles = CollectionUtils.asSet(rolesArray);
            return subject.hasAllRoles(roles);
        } else {
            return true;
        }
    }
}
```

自定义过滤器
* 继承想要重写的过滤器，然后重写 `isAccessAllowed()` 方法
* 参考1，将自定义的 `Filter` 设置进 `ShiroFilterFactoryBean`

```java 
public class RolesOrFilter extends RolesAuthorizationFilter {

    public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws IOException {
        Subject subject = getSubject(request, response);
        String[] rolesArray = (String[]) mappedValue;
        if (rolesArray == null || rolesArray.length == 0) {
            return true;
        }
        Set<String> roles = CollectionUtils.asSet(rolesArray);
        for (String role : roles) {
            boolean flag = subject.hasRole(role);
            if (flag) {
                return flag;
            }
        }
        return false;
    }

}
```


 
