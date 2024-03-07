### Optional 判空
* 为了解决空指针异常更加优雅，Java8 提供了 Optional 类库
* Optional 实际上是个容器：它可以保存对象类型T的值，或者仅仅保存null


### 一、Optional 对象创建
* of()：不允许参数是 null，参数为空则抛出异常
* ofNullable()：参数无限制
* empty()：参数固定为null

```
Optional<String> o1 = Optional.of("fgq");
Optional<String> o2 = Optional.ofNullable("fgq");
Optional<String> o3 = Optional.ofNullable(null);
Optional<String> o4 = Optional.empty();

System.out.println(o1 == o2);   // false
System.out.println(o3 == o4);   // true
```


### 二、Optional 常用方法
```
Optional<Integer> o1 = Optional.ofNullable(1);
Optional<Integer> o2 = Optional.ofNullable(null);
```

#### 1. isPresent() 判空
```
// 判断保存的值是否存在,存在返回 true,否则返回 false,取代了 obj != null 的作用
System.out.println(o1.isPresent());     // true
System.out.println(o2.isPresent());     // false
```

#### 2. ifPresent(Consumer consumer)  动态调用
```
// 若保存的值不是null，则调用Consumer对象accept()方法，否则不调用
o1.ifPresent(new Consumer<Integer>() {
    @Override
    public void accept(Integer integer) {
        System.out.println("值为：" + integer);
    }
});
o2.ifPresent(new Consumer<Integer>() {
    @Override
    public void accept(Integer integer) {
        System.out.println("值为：" + integer);
    }
});
```


#### 3. get()  获取保存的值
```
// 获取保存的值，如果不存在，则抛出异常
System.out.println(o1.get());   // 1
System.out.println(o2.get());   // 抛出异常
```

#### 4. orElse()  获取保存的值(可以设置一个默认值)
```
// 获取保存的值，若存在则将其返回，不存在返回默认值，类似Oracle的nvl()
System.out.println(o1.orElse(66));  // 1
System.out.println(o2.orElse(66));  // 66
```

#### 5. orElseGet() 获取保存的值(可以设置一个默认值)
```
// 功能与 orElse 一样，只不过 orElseGet 参数是一个对象
System.out.println(o1.orElseGet(() -> 66));  // 1
System.out.println(o2.orElseGet(() -> 66));  // 66
```

#### 6. orElseThrow() 获取保存的值
```
// 值不存在则抛出异常，存在则什么不做
o1.orElseThrow(() -> {
    throw new IllegalStateException("正常");      // 不会调用
});
try {
    o2.orElseThrow(() -> {
        throw new IllegalStateException("异常");  // 会抛出异常
    });
} catch (IllegalStateException e) {
    e.printStackTrace();
}
```


#### 7. filter() 过滤
```
// 若保存的值存在并且满足提供的断言，返回包含该值的 Optional 对象，否则返回一个空的 Optional 对象
Optional<Integer> filter1 = o1.filter((v) -> v == null);
Optional<Integer> filter2 = o1.filter((v) -> v == 1);
Optional<Integer> filter3 = o2.filter((v) -> v == null);

System.out.println(filter1.isPresent());    // false
System.out.println(filter2.isPresent());    // true
System.out.println(filter3.isPresent());    // false
```


#### 8. map() 加工
```
// 如保存的值存在，就对该值进行函数运算，返回新的 Optional (可以是任何类型)
Optional<String> s1 = o1.map((v) -> "key" + v);
Optional<String> s2 = o2.map((v) -> "key" + v);

System.out.println(s1.get());         // key1
System.out.println(s2.isPresent());   // false
```


#### 9. flatMap() 加工
```
// 功能与 map() 相似，区别在于map()的返回值可以是任何类型，而flatMap()必须是 Optional
Optional<Optional<String>> ss1 = o1.map((a) -> Optional.of("key" + a));
Optional<String> s2 = o1.flatMap((a) -> Optional.of("key" + a));

System.out.println(ss1.get().get());    // key1
System.out.println(s2.get());           // key1
```
