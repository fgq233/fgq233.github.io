### Stream 流 
### 一、简介
* Java 8 之后，得益于Lambda 带来的函数式编程，引入了 Stream流简化集合、数组操作
* Stream流2种操作
  * 中间操作：仍然会返回一个Stream流对象，多个中间操作可以串连起来形成一个流水线
  * 终端操作：所有的中间操作完成后，若要将数据从流水线上拿下来，则需要执行终端操作
* Stream流的操作过程
  * 根据数据源创建流
  * 执行中间操作（可以有多个，它们可以串连起来形成流水线）
  * 执行终端操作，本次流结束
* Stream流特点
  * 惰性：如果没有终端操作，那么中间操作不会执行
  * 一次性：一个流经过一个终结操作后，这个流不能再次使用
  * 不影响原始数据：流中进行的操作都不会影响原先集合中的数据


### 二、创建 Stream 流
```
// 1、单列集合
list.stream();

// 2、数组
Integer[] arr = {1, 2, 3};
Stream<Integer> stream = Arrays.stream(arr);

// 3、Map，先转成单列集合，再创建
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);
map.put("李四", 20);
map.put("王五", 24);
Stream<Map.Entry<String, Integer>> stream = map.entrySet().stream();

// 流的合并
Stream<Person> stream1 = list1.stream();
Stream<Person> stream2 = list2.stream();
Stream<Person> stream = Stream.concat(stream1, stream2);

// 并行流，用于数据量较大情况下并发处理(多线程)
list.parallelStream();     
list.stream().parallel();  
```

### 三、中间操作

| 操作        | 类型   | 返回类型        | 参数类型               | 函数描述符        |
|-----------|-------|-------------|--------------------|--------------|
| filter    | 中间   | `Stream<T>  ` | `Predicate <T>   ` | `T -> boolean` |
| distinct  | 中间   | `Stream<T>  ` | `----            ` | `----        ` |
| skip      | 中间   | `Stream<T>  ` | `long            ` | `----        ` |
| limit     | 中间   | `Stream<T>  ` | `long            ` | `----        ` |
| sorted    | 中间   | `Stream<T>  ` | `Comparator <T>  ` | `(T,T) -> int` |
| map       | 中间   | `Stream<R>  ` | `Function <T,R>  ` | `T -> R      ` |
| flatMap   | 中间   | `Stream<R>  ` | `Function <T,R>  ` | `T -> Stream ` |


### 四、终端操作

| 操作        | 类型   | 返回类型        | 参数类型               | 函数描述符        |
|-----------|-------|-------------|--------------------|--------------|
| forEach   | 终端   | `void       ` | `Consumer<T>     ` | `T -> void   ` |
| count     | 终端   | `long       ` | `----            ` | `----        ` |
| min       | 终端   | `Optional<T>` | `Comparator <T>  ` | `(T,T) -> int` |
| max       | 终端   | `Optional<T>` | `Comparator <T>  ` | `(T,T) -> int` |
| findAny   | 终端   | `Optional<T>` | `----      `       | `----        ` |
| findFirst | 终端   | `Optional<T>` | `----     `        | `----        ` |
| anyMatch  | 终端   | `boolean    ` | `Predicate <T>   ` | `T -> boolean` |
| noneMatch | 终端   | `boolean    ` | `Predicate <T>   ` | `T -> boolean` |
| allMatch  | 终端   | `boolean    ` | `Predicate <T>   ` | `T -> boolean` |
| collect   | 终端   | `R          ` | `Collector<T,A,R>` | `----        ` |
| reduce    | 终端   | `Optional<T>` | `BinaryOperator  ` | `(T,T) -> T  ` |


