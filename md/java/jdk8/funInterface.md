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


#### 2. Function 计算转换接口
```
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);
}
```


#### 3. Predicate 判断接口
```
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

}
```


#### 4. Supplier 生产接口
```
@FunctionalInterface
public interface Supplier<T> {

    T get();
}
```


### 二、测试
```java
public class InterfaceTest {

    public static void main(String[] args) {
        testConsumer(s -> { System.out.println(s); });
        Integer function = testFunction(s -> Integer.valueOf(s));
        boolean predicate = testPredicate(num -> num > 0, 0);
        String supplier = testSupplier(() -> "666");

        System.out.println(function);
        System.out.println(predicate);
        System.out.println(supplier);
    }
    
    public static void testConsumer(Consumer<String> consumer) {
        consumer.accept("fgq");
    }

    public static boolean testPredicate(Predicate<Integer> predicate, Integer num) {
        return predicate.test(num);
    }

    public static Integer testFunction(Function<String, Integer> function) {
        return function.apply("666");
    }

    public static String testSupplier(Supplier<String> supplier) {
        return supplier.get();
    }

}
```
