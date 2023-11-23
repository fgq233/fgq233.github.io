### 单例模式
在一个JVM中，某个类只有一个对象实例存在，并对外提供一个静态方法获取其对象实例

### 一、饿汉式
```java
public class Singleton {

    private static final Singleton instance = new Singleton();

    private Singleton() {}
    
    public static Singleton getInstance() {
        return instance;
    }
}
```

* 优点：在类加载的时候完成实例化，**线程安全**
* 缺点：没有懒加载效果，如果程序中未用到该实例，浪费内存


### 二、懒汉式
#### 1. 非同步
```java
public class Singleton {

    private static Singleton instance = null;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

* 优点：有懒加载效果
* 缺点：在多线程下，可能产生多个对象实例，**线程不安全**

#### 2. 同步
```java
public class Singleton {

    private static Singleton instance = null;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

* 优点：有懒加载效果、**线程安全**
* 缺点：效率低下


#### 3. 同步 + volatile + 双重检查(推荐)
```java
public class Singleton {

    private static volatile Singleton instance = null;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

* 优点：有懒加载效果、**线程安全**、效率相对较好(只有第一次有同步代码)


### 三、静态内部类(推荐)
```java
public class Singleton {

    private Singleton() {}
    
    private static class Inner {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return Inner.INSTANCE;
    }
}
```

* 优点：有懒加载效果、**线程安全**


### 四、枚举方式(推荐)
```java
public enum Singleton {
    INSTANCE;
}
```

* 优点：**线程安全**，同时解决了一、二、三中可以通过**反射**来创建多个对象实例的问题
* 缺点：无懒加载效果
