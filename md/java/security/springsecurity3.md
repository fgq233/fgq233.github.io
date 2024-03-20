### SpringSecurity 授权​
### 一、授权
#### 1、权限设置
在自定义返回认证对象 `UserDetails` 实现类 `User` 中，需要设置权限

```
public User(String username, String password, Collection<? extends GrantedAuthority> authorities) {
   this(username, password, true, true, true, true, authorities);
}


@Service
public class UserService implements UserDetailsService {
    // ......
    
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
            // 第三个参数为角色、权限集合
            return new User(sysUser.getUsername(), sysUser.getPassword(), authorities);
        }
        return null;
    }
}
```
    
#### 2、权限校验过滤器
* `SpringSecurity` 中，使用过滤器 `FilterSecurityInterceptor` 进行权限校验
* `FilterSecurityInterceptor` 从 `SecurityContextHolder` 中获取 `Authentication`，然后获取其中权限信息
* 最后，判断用户是否拥有某个权限
 
              
#### 3、权限校验方法 
* `hasAnyRole(String... roles)`：具有指定角色集合 `roles` 之一返回 `true`

* `hasRole(String role)`：具有指定角色 `role` 返回`true`

* `hasAnyAuthority(String... authorities)`：具有指定权限集合 `authorities` 之一返回`true`

* `hasAuthority(String authority)`：具有指定权限 `authority` 返回`true`


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
                .loginPage("/login.html")           
                .loginProcessingUrl("/myLogin")      
                .defaultSuccessUrl("/index")        
                .failureUrl("/login.html")          
                .usernameParameter("username")      
                .passwordParameter("password")      
                .permitAll()
                .and()
                .authorizeRequests()
                .antMatchers("/login.html", "/hello").permitAll()                                
                .antMatchers("/index").hasRole("admin")                      // 角色校验
                .antMatchers("/user").hasAnyAuthority("userAdd", "userDel")  // 权限校验
                .anyRequest().authenticated();        
        http.csrf().disable();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

校验失败会跳转 `403` 界面  

```
Whitelabel Error Page
This application has no explicit mapping for /error, so you are seeing this as a fallback.

Mon Jan 23 21:03:50 CST 2022
There was an unexpected error (type=Forbidden, status=403).
```
  
  
### 二、自定义无权限 403 界面
#### 1、添加无权限访问界面 noAuth.html
#### 2、SecurityConfig 设置
```
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.exceptionHandling().accessDeniedPage("/noAuth.html");
        .....
    }
}
```