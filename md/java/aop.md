###  AOP  
Aspect Oriented Programming，面向切面编程，是通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术

### 一、介绍
#### 1. AOP 作用
* 在程序运行期间，在不修改源码的情况下对方法进行功能增强
* 减少重复代码，提高开发效率，便于后期维护

#### 2. 底层实现
* 底层：AOP的底层是通过动态代理技术实现的
* 过程：在运行期间，通过动态代理技术动态地生成代理对象，代理对象方法执行时进行功能增强的介入，再去调用目标对象的方法

#### 3. 动态代理技术
常用的动态代理技术有两种
* 基于接口的 `JDK` 代理
* 基于父类的 `Cglib` 代理

区别：
* `JDK`动态代理只需要 JDK 环境，`Cglib`动态代理需要安装 `Cglib` 库
* `JDK`动态代理只能针对 **接口实现类** 生成代理实例，而不能针对普通类，它是面向接口的；
`Cglib`动态代理是针对类代理，主要是对目标类生成一个子类，并覆盖其中方法实现增强， 
但是因为采用的是继承，所以对于 `final` 类或方法，是无法代理的


#### 4. Spring 中如何选取 JDK 或 CGLIB 
* 目标对象实现了接口，默认情况下会采用 `JDK` 的动态代理实现 `AOP`
* 目标对象实现了接口，也可以强制使用 `Cglib` 实现 `AOP`
* 目标对象没有实现接口，必须采用 `Cglib`，Spring 会自动在 `JDK` 动态代理和 `Cglib` 动态代理之间转换

### 二、JDK 动态代理
实现步骤
* 定义目标接口、实现类
* 定义增强类
* 生成代理对象，增强目标接口
* 使用代理对象调用方法

#### 1. 目标接口、实现类
```java
public interface ITarget {
    void call();
}

public class Target implements ITarget{
    @Override
    public void call() {
        System.out.println("目标方法 Runnig...");
    }
}
```

#### 2. 增强类
```java
public class Enhance {

    public void before() {
        System.out.println("前置增强方法 Runnig...");
    }

    public void after() {
        System.out.println("后置增强方法 Runnig...");
    }
}
```

#### 3. 生成代理对象、增强
```java
public class TestProxy {

    public static void main(String[] args) {
        // 目标对象
        final Target target = new Target();
        // 增强对象
        final Enhance enhance = new Enhance();
        // 代理对象
        ITarget proxy = (ITarget) Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                new InvocationHandler() {
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        enhance.before();
                        Object invoke = method.invoke(target, args);
                        enhance.after();
                        return invoke;
                    }
                }
        );
        // 代理对象调用方法
        proxy.call();
    }
}
```


### 三、Cglib 动态代理
实现步骤
* 定义目标类
* 定义增强类
* 生成代理对象，增强目标类
* 使用代理对象调用方法

#### 1. 目标类
```java
public class Target {
    public void call() {
        System.out.println("目标方法 Runnig...");
    }
}
```

#### 2. 增强类
```java
public class Enhance {

    public void before() {
        System.out.println("前置增强方法 Runnig...");
    }

    public void after() {
        System.out.println("后置增强方法 Runnig...");
    }
}
```

#### 3. 生成代理对象、增强
```java
public class X {

    public static void main(String[] args) {
        // 目标对象
        final Target target = new Target();

        // 增强对象
        final Enhance enhance = new Enhance();

        // 1.创建增强器
        Enhancer enhancer = new Enhancer();
        // 2.设置父类(即目标类)
        enhancer.setSuperclass(Target.class);
        // 3.设置回调，进行增强
        enhancer.setCallback(new MethodInterceptor() {
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                enhance.before();
                Object invoke = method.invoke(target, objects);
                enhance.after();
                return invoke;
            }
        });
        // 4. 代理对象
        Target proxy = (Target) enhancer.create();

        // 代理对象调用方法
        proxy.call();
    }
}
```
