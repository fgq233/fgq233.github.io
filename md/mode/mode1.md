### 单例模式
* 在一个JVM中，某个对象只有一个实例存在

#### 1. 饿汉模式
```java
public class Singleton {

    private static Singleton instance = new Singleton();

    private Singleton() {}
    
    public static Singleton getInstance() {
        return instance;
    }
}
```

饿汉模式在类加载的时候立刻实例化，线程安全


#### 2. 懒汉模式
* 单线程下

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

* 多线程下

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
