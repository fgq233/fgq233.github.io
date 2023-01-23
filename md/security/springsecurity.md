### SpringSecurity
`SpringSecurity` 是 `Spring` 家族中的一个安全管理框架，**认证、授权**是`SpringSecurity`的核心功能
​
### 一、入门
#### 1. 搭建 SpringBoot 工程项目
添加测试接口，访问 `http://localhost:8080/hello`，显示正常
   
```
@RestController
public class TestController {

    @RequestMapping("/hello")
    @ResponseBody
    public String login() {
        return "Hello SpringSecurity";
    }
}
```



#### 2. 引入 SpringSecurity 依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

* 再次访问 `http://localhost:8080/hello`






 
 