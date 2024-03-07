### Stream 流
* Java 8 之后，得益于Lambda 带来的函数式编程，引入了Stream 流，用于简化集合、数组操作的API
* Stream流的特点：只能遍历一次，采用内部迭代方式
  * 若要对集合进行处理，则需我们手写处理代码，这叫做外部迭代
  * 要对流进行处理，只需告诉流需要什么结果，处理过程由流自行完成，这叫做内部迭代
* Stream 流的2种操作
  * 中间操作
     当数据源中的数据上了流水线后，这个过程对数据进行的所有操作都称为中间操作
     中间操作仍然会返回一个Stream流对象，因此多个中间操作可以串连起来形成一个流水线
  * 终端操作
     当所有的中间操作完成后，若要将数据从流水线上拿下来，则需要执行终端操作
     终端操作将返回一个执行结果，即想要的数据
* Stream流的操作过程
  * 准备一个数据源
  * 执行中间操作（可以有多个，它们可以串连起来形成流水线）
  * 执行终端操作，本次流结束，获得一个执行结果

### 一、常用 API
| 操作        | 类型   | 返回类型        | 参数类型/函数式接口       | 函数描述符        |
|-----------|-------|-------------|------------------|--------------|
| filter    | 中间   | `Stream<T>  ` | Predicate <T>    | T -> boolean |
| distinct  | 中间   | `Stream<T>  ` | ----             | ----         |
| skip      | 中间   | `Stream<T>  ` | long             | ----         |
| map       | 中间   | `Stream<R>  ` | Function <T,R>   | T -> R       |
| flatMap   | 中间   | `Stream<R>  ` | Function <T,R>   | T -> Stream  |
| limit     | 中间   | `Stream<T>  ` | long             | ----         |
| sorted    | 中间   | `Stream<T>  ` | Comparator <T>   | (T,T) -> int |
| anyMatch  | 终端   | `boolean    ` | Predicate <T>    | T -> boolean |
| noneMatch | 终端   | `boolean    ` | Predicate <T>    | T -> boolean |
| allMatch  | 终端   | `boolean    ` | Predicate <T>    | T -> boolean |
| findAny   | 终端   | `Optional<T>` | Optional<T>      | ----         |
| findFirst | 终端   | `Optional<T>` | Optional<T>      | ----         |
| forEach   | 终端   | `void       ` | Consumer<T>      | T -> void    |
| collect   | 终端   | `R          ` | Collector<T,A,R> |              |
| reduce    | 终端   | `Optional<T>` | BinaryOperator   | (T,T) -> T   |
| count     | 终端   | `long       ` | ----             | ----         |


#### 1. List 转 Stream
```
// 转stream
list.stream();

// 并发处理
list.parallelStream();
```


#### 1. 遍历 forEach
```
void forEach(Consumer<? super T> action);
void forEachOrdered(Consumer<? super T> action);

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
