### Optional 判空
### 一、Optional 对象创建
```
# 创建空的 Optional 对象
Optional<String> optional1 = Optional.empty();

# 创建非空的 Optional 对象，传入对象为空则抛出异常
Optional<String> optional2 = Optional.of("fgq");

# 创建可空、可非空的 Optional 对象
Optional<String> optional3 = Optional.ofNullable(null);
```


### 二、Optional 常用方法
#### 1. isPresent() 判空
```
判断一个对象是否存在，存在返回 true，否则返回 false，取代了 obj != null 的作用
boolean isExist = optional.isPresent();
```

#### 2. get()  获取包裹的对象
```
获取Optional包裹的对象，如果不存在，则抛出异常
String val = optional.get();
```

#### 3. orElse()、orElseGet() 设置（获取）默认值
```
获取Optional包裹的对象，如果对象不存在，返回默认值

String val1 = optional.orElse("fgq");
String val2 = optional.orElseGet(() -> new Date().toString());
```

#### 4. filter() 过滤
```
对Optional包裹的对象进行过滤，返回一个新的 Optional 对象
Optional<String> optional2 = optional.filter(val -> val.length() > 3);
System.out.println(optional2.isPresent());
```