### 函数式接口 @FunctionalInterface
* 只有一个抽象方法的接口称之为函数式接口
* JDK中常用的函数式接口在 `java.util.function` 包下


### 一、常见函数式接口
#### 1. Consumer 消费接口
```
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);
}
```


#### 1. Function 计算转换接口
```
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);
}
```


#### 1. Predicate 判断接口
```
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

}
```
