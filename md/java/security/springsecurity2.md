### SpringSecurity 认证
`SpringSecurity` 负责认证的过滤器是 `UsernamePasswordAuthenticationFilter`
​
### 一、认证流程
#### 1. 流程
* 过滤器`doFilter()` 拦截到请求，使用`UsernamePasswordAuthenticationFilter` 认证

* `UsernamePasswordAuthenticationFilter`  委托给 `AuthenticationManager` 去认证

* `AuthenticationManager`  使用实现类 `ProviderManager` 管理认证

* `ProviderManager`  获取匹配的 `Provider --- DaoAuthenticationProvider` 去认证

* `DaoAuthenticationProvider`  使用 `UserDetailsService` 实现类完成具体认证逻辑

![SpringSecurity](https://fgq233.github.io/imgs/security/springsecurity2.png)


#### 2. UsernamePasswordAuthenticationFilter 认证过滤器
* `UsernamePasswordAuthenticationFilter` 继承自 `AbstractAuthenticationProcessingFilter`

```
public abstract class AbstractAuthenticationProcessingFilter extends GenericFilterBean implements ApplicationEventPublisherAware, MessageSourceAware {
   
    // ★★★★★★ 拦截请求
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)req;
        HttpServletResponse response = (HttpServletResponse)res;
        if (!this.requiresAuthentication(request, response)) {
            chain.doFilter(request, response);
        } else {
            Authentication authResult;
            try {
                // ★★★★★★ 1、UsernamePasswordAuthenticationFilter 认证，返回认证结果
                authResult = this.attemptAuthentication(request, response);
                if (authResult == null) {
                    return;
                }
                // ★★★★★★ 2、将认证结果缓存到 session
                this.sessionStrategy.onAuthentication(authResult, request, response);
            }  ......
            // ★★★★★★ 3、认证成功后的操作
            this.successfulAuthentication(request, response, chain, authResult);
        }
    }
    
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        // ★★★★★★ 4、认证成功后将认证信息存储到 SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authResult);
        // ★★★★★★ 5、记住我功能
        this.rememberMeServices.loginSuccess(request, response, authResult);
        if (this.eventPublisher != null) {
            this.eventPublisher.publishEvent(new InteractiveAuthenticationSuccessEvent(authResult, this.getClass()));
        }
        this.successHandler.onAuthenticationSuccess(request, response, authResult);
    }
}


public class UsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // ★★★★★★ 1、认证必须为 POST 请求
        if (this.postOnly && !request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        } else {
            String username = this.obtainUsername(request);
            String password = this.obtainPassword(request);
            if (username == null) {
                username = "";
            }
            if (password == null) {
                password = "";
            }
            username = username.trim();
            // ★★★★★★ 2、认证的用户名、密码封装到 token 中
            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
            this.setDetails(request, authRequest);
            // ★★★★★★ 3、使用 AuthenticationManager 认证
            return this.getAuthenticationManager().authenticate(authRequest);
        }
    }

    ......
}
```


#### 3. AuthenticationManager、ProviderManager
* `AuthenticationManager` 是一个接口，实现类为 `ProviderManager`
* `SpringSecurity` 提供了很多类型的 `Token、Provider`，不同类型 `Token` 需要不同 `Provider`去认证
    * `UsernamePasswordAuthenticationToken`
    * `TestingAuthenticationToken`
    * `RememberMeAuthenticationToken`
    * `PreAuthenticatedAuthenticationToken`

```
public interface AuthenticationManager {
    Authentication authenticate(Authentication var1) throws AuthenticationException;
}


public class ProviderManager implements AuthenticationManager, MessageSourceAware, InitializingBean {
    
    private List<AuthenticationProvider> providers;
    
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Class<? extends Authentication> toTest = authentication.getClass();
        Authentication result = null;  
        Iterator var8 = this.getProviders().iterator();

        while(var8.hasNext()) {
            AuthenticationProvider provider = (AuthenticationProvider)var8.next();
            // ★★★★★★ 根据 Token 类型获取支持的 Provider
            if (provider.supports(toTest)) {
                try {
                    // ★★★★★★ Provider 认证操作
                    result = provider.authenticate(authentication);
                    if (result != null) {
                        this.copyDetails(authentication, result);
                        break;
                    }
                } 
            }
        }
    }
}
```



#### 4. AbstractUserDetailsAuthenticationProvider、DaoAuthenticationProvider
```
public abstract class AbstractUserDetailsAuthenticationProvider implements AuthenticationProvider, InitializingBean, MessageSourceAware {

    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getPrincipal() == null ? "NONE_PROVIDED" : authentication.getName();
        boolean cacheWasUsed = true;
        // ★★★★★★ 先从缓存中认证
        UserDetails user = this.userCache.getUserFromCache(username);
        if (user == null) {
            cacheWasUsed = false;
            try {
                // ★★★★★★ 缓存中没有，再调用 retrieveUser() 方法去认证  
                // ★★★★★★ retrieveUser() 为抽象方法，看实现类 DaoAuthenticationProvider 中实现
                user = this.retrieveUser(username, (UsernamePasswordAuthenticationToken)authentication);
            } catch (UsernameNotFoundException var6) {
                this.logger.debug("User '" + username + "' not found");
                if (this.hideUserNotFoundExceptions) {
                    throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
                }
                throw var6;
            }
        }
        // ★★★★★★ 返回 UsernamePasswordAuthenticationToken
        return this.createSuccessAuthentication(principalToReturn, authentication, user);
    }

    protected abstract UserDetails retrieveUser(String var1, UsernamePasswordAuthenticationToken var2) throws AuthenticationException;
    
    protected Authentication createSuccessAuthentication(Object principal, Authentication authentication, UserDetails user) {
        UsernamePasswordAuthenticationToken result = new UsernamePasswordAuthenticationToken(principal, authentication.getCredentials(), this.authoritiesMapper.mapAuthorities(user.getAuthorities()));
        result.setDetails(authentication.getDetails());
        return result;
    }
}

 
public class DaoAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {
    private UserDetailsService userDetailsService;

    protected final UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        this.prepareTimingAttackProtection();

        try {
            // ★★★★★★ 最终认证方法
            // ★★★★★★ 返回 UserDetails，这就是 SpringSecurity 的认证后的用户对象
            UserDetails loadedUser = this.getUserDetailsService().loadUserByUsername(username);
            if (loadedUser == null) {
                throw new InternalAuthenticationServiceException("UserDetailsService returned null, which is an interface contract violation");
            } else {
                return loadedUser;
            }
        } 
    }
}
```

* 认证逻辑最终调用的就是 `UserDetailsService` 实现类中 `loadUserByUsername()` 方法
* 自定义：定义一个类实现 `UserDetailsService`，在 `loadUserByUsername()` 方法编写自己的逻辑，返回 `UserDetails` 对象



### 二、自定义认证用户名、密码的三种方式
#### 1. 方式1：yaml 配置认证的用户名、密码
```
spring:
  security:
    user:
      name: fgq
      password: 666
```

再次访问接口，使用配置的用户名、密码认证登录


#### 2. 方式2：配置类
```
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encode = encoder.encode("888");
        auth.inMemoryAuthentication().withUser("fgq").password(encode).roles("admin");
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```

#### 3. 方式3：实现 UserDetailsService
* 自定义 `UserDetailsService`实现类，在 `loadUserByUsername()` 方法返回认证成功的 `UserDetails`
* 编写 `SecurityConfig`，继承 `WebSecurityConfigurerAdapter`，注入自定义的 `UserDetailsService` 

```
@Service
public class UserService implements UserDetailsService {

    /**
     * 模拟根据用户名查询用户
     */
    public SysUser findUserByName(String username) {
        SysUser sysUser = new SysUser();
        sysUser.setId(1L);
        sysUser.setUsername(username);
        // SpringSecurity 默认要求密码要加密，此处模拟加密
        sysUser.setPassword(new BCryptPasswordEncoder().encode("666"));
        return sysUser;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser sysUser = findUserByName(username);
        if (sysUser != null) {
            List<GrantedAuthority> authorities = new ArrayList<>();
            // 模拟查询出的角色，前面要加上 ROLE_
            authorities.add(new SimpleGrantedAuthority("ROLE_admin"));
            authorities.add(new SimpleGrantedAuthority("ROLE_dev"));
            // 模拟查询出的权限
            authorities.add(new SimpleGrantedAuthority("userAdd"));
            authorities.add(new SimpleGrantedAuthority("userDel"));
            return new User(sysUser.getUsername(), sysUser.getPassword(), authorities);
        }
        // 返回 null 表示认证失败
        return null;      
    }
}
```


```
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```


### 三、自定义登陆界面
#### 1、编写登陆界面 login.html
```
<form method="post" action="/myLogin">
    用户名:<input type="text" name="username"><br/>
    密码:<input type="password" name="password"> <br/>
    <input type="submit" value="登陆">
</form>
```

#### 2、编写接口
```
@RestController
public class TestController {

    @RequestMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello SpringSecurity";
    }

    @PostMapping("/index")
    @ResponseBody
    public String index() {
        return "Index Page";
    }

}
```

#### 3、SecurityConfig 配置
```
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin()
                .loginPage("/login.html")           // 登录页面的地址
                .loginProcessingUrl("/myLogin")     // 登录表单提交的 Controller 接口地址，SpringSecurity会自动处理
                .defaultSuccessUrl("/index")        // 登录成功后---跳转的地址
                .failureUrl("/login.html")          // 登录失败后---跳转的地址
                .usernameParameter("username")      // 表单中的用户名key
                .passwordParameter("password")      // 表单中的密码key
                .permitAll()
                .and()
                .authorizeRequests()
                .antMatchers("/login.html", "/hello").permitAll()     // 不拦截的地址，即无需认证也可以访问的地址 
                .anyRequest().authenticated();      // authenticated()拦截，这里表示其他任何请求都要认证之后才能访问
        // 关闭csrf校验
        http.csrf().disable();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```

* 访问 [http://localhost:8080/hello](http://localhost:8080/hello)，没有认证也可以访问
* 访问 [http://localhost:8080/index](http://localhost:8080/index)，自动跳转到登录页
* 访问 [http://localhost:8080/login.html](http://localhost:8080/login.html)，登录成功，跳转到[http://localhost:8080/index](http://localhost:8080/index)
