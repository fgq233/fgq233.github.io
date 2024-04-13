###  Flowable 分配用户
分配用户决定了每个环节的处理人

### 一、两类分配用户
![](https://fgq233.github.io/imgs/workflow/flow03.png)
![](https://fgq233.github.io/imgs/workflow/flow04.png)


* 身份存储：使用 flowable-ui 中定义好的用户、用户组
* 固定值
  * 写死的固定用户
  * 表达式
    * 值表达式
    * 方法表达式

#### 1. 值表达式
如：`${name}  ${user.name}`

#### 2. 方法表达式
调用一个方法，返回执行用户
* 不带参数：要在方法名后添加空括号`()`，防止与值表达式混淆
* 带参数：传递的参数可以是字面值，也可以是表达式，会被自动解析

```
${user.name()}                // 不带参数           
${user.getLeader('fgq')}      // 带字面值参数
${user.doSomething(myVar, execution)}  // 带表达式参数
```

user 是Spring容器中的个Bean对象


```java
@Component
public class User {

    public String name(){
        return "CCC";
    }
    
    public String getLeader(String name){
      return "CCC";
    }
}
```


### 二、测试固定用户、值表达式、方法表达式
![](https://fgq233.github.io/imgs/workflow/flow05.png)
