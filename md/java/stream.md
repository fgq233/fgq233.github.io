### Stream 流常用 API
* Java 8 之后，得益于Lambda 带来的函数式编程，引入了Stream 流的概念
* Stream 流的主要用于简化集合、数组操作的API

```
List<String> list = new ArrayList<>();
Collections.addAll(list, "张三", "张三丰", "赵敏", "周芷若");

```

#### 1. 遍历 forEach
```
list.stream().forEach(s -> System.out.println(s));
```

#### 2. 过滤  filter
```
list.stream().filter(s -> s.startsWith("张")).forEach( s -> System.out.println(s));
```

#### 3. 统计 count
```
long size = list.stream().filter(s -> s.startsWith("张")).count();
```

#### 4. 截取 limit
```
list.stream().limit(2).forEach(s -> System.out.println(s));
```

#### 5. 跳过 skip
```
list.stream().skip(2).forEach(s -> System.out.println(s));
```


#### 6. 合并 concat
```
Stream<String> stream = list.stream();
Stream.concat(stream, stream).forEach(s -> System.out.println(s));
```

#### 7. 加工 map
```
list.stream().map(s -> "★" + s).forEach(s -> System.out.println(s));
```

#### 8. 收集 collect
```
List<String> newList = list.stream().filter(s -> s.startsWith("张")).collect(Collectors.toList());
```
