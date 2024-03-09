### Stream 流
* Java 8 之后，得益于Lambda 带来的函数式编程，引入了 Stream流简化集合、数组操作
* Stream流2种操作
  * 中间操作：仍然会返回一个Stream流对象，多个中间操作可以串连起来形成一个流水线
  * 终端操作：所有的中间操作完成后，若要将数据从流水线上拿下来，则需要执行终端操作
* Stream流的操作过程
  * 根据数据源创建流
  * 执行中间操作（可以有多个，它们可以串连起来形成流水线）
  * 执行终端操作，本次流结束，获得一个执行结果
* Stream流特点
  * 惰性：如果没有终端操作，那么中间操作不会执行
  * 一次性：一个流经过一个终结操作后，这个流不能再次使用
  * 不影响原始数据：流中进行的操作都不会影响原先集合中的数据


### 一、常用 API
#### 1. 创建流
```
// 1、单列集合
list.stream();
list.parallelStream();  // 用于并发处理

// 2、数组
Integer[] arr = {1, 2, 3};
Arrays.stream(arr).forEach(System.out::println);
Stream.of(arr).forEach(System.out::println);

// 3、Map，先转成单列集合，再创建
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);
map.put("李四", 20);
map.put("王五", 24);
Stream<Map.Entry<String, Integer>> stream = map.entrySet().stream();
stream.forEach(System.out::println);

// 流的合并
Stream<Person> stream1 = list1.stream();
Stream<Person> stream2 = list2.stream();
Stream<Person> stream = Stream.concat(stream1, stream2);
```


#### 2. 中间操作、终端操作

| 操作        | 类型   | 返回类型        | 参数类型/函数式接口       | 函数描述符        |
|-----------|-------|-------------|------------------|--------------|
| filter    | 中间   | `Stream<T>  ` | `Predicate <T>   ` | `T -> boolean` |
| distinct  | 中间   | `Stream<T>  ` | `----            ` | `----        ` |
| skip      | 中间   | `Stream<T>  ` | `long            ` | `----        ` |
| limit     | 中间   | `Stream<T>  ` | `long            ` | `----        ` |
| sorted    | 中间   | `Stream<T>  ` | `Comparator <T>  ` | `(T,T) -> int` |
| map       | 中间   | `Stream<R>  ` | `Function <T,R>  ` | `T -> R      ` |
| flatMap   | 中间   | `Stream<R>  ` | `Function <T,R>  ` | `T -> Stream ` |
| forEach   | 终端   | `void       ` | `Consumer<T>     ` | `T -> void   ` |
| count     | 终端   | `long       ` | `----            ` | `----        ` |
| min       | 终端   | `Optional<T>` | `Comparator <T>  ` | `(T,T) -> int` |
| max       | 终端   | `Optional<T>` | `Comparator <T>  ` | `(T,T) -> int` |
| findAny   | 终端   | `Optional<T>` | `Optional<T>     ` | `----        ` |
| findFirst | 终端   | `Optional<T>` | `Optional<T>     ` | `----        ` |
| anyMatch  | 终端   | `boolean    ` | `Predicate <T>   ` | `T -> boolean` |
| noneMatch | 终端   | `boolean    ` | `Predicate <T>   ` | `T -> boolean` |
| allMatch  | 终端   | `boolean    ` | `Predicate <T>   ` | `T -> boolean` |
| collect   | 终端   | `R          ` | `Collector<T,A,R>` | `----        ` |
| reduce    | 终端   | `Optional<T>` | `BinaryOperator  ` | `(T,T) -> T  ` |





### 二、案例
#### 1. 数据准备
```
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Person implements Comparable<Person> {

    private int id;
    private String name;
    private int age;
    private List<Book> books;

    @Override
    public int compareTo(Person p) {
        return this.getAge() - p.getAge();
    }
}

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    private String name;
    private String category;
}

List<Book> books1 = Arrays.asList(
        new Book("三国演义", "文学"),
        new Book("水浒传", "文学"),
        new Book("西游记", "文学"),
        new Book("红楼梦", "文学"));
List<Book> books2 = Arrays.asList(
        new Book("哈姆雷特", "文学"),
        new Book("物种起源", "科学,文学"),
        new Book("相对论", "知识"));
List<Book> books3 = Arrays.asList(
        new Book("语文书", "教育"),
        new Book("数学书", "教育,科学"),
        new Book("英语书", "教育"));
List<Person> list = Arrays.asList(
        new Person(1, "张三", 24, books1),
        new Person(2, "李四", 18, books2),
        new Person(3, "王五", 32, books3),
        new Person(3, "王五", 32, books3)
);
```


#### 2. 操作
```
// 转stream
list.stream();

// 并发处理
list.parallelStream();
```


#### 2. 中间操作
```
// 过滤filter()：对流中元素进行过滤，符合过滤条件的才能继续留在流中
list.stream().filter(person -> person.getAge() > 20).forEach(System.out::println);

// 去重distinct()：根据对象equals()方法对流中元素进行去重
list.stream().distinct().forEach(System.out::println);

// 跳过skip()：跳过流中前n个元素，返回剩下的元素
list.stream().skip(2).forEach(System.out::println);

// 截取limit()：设置流最大长度，超出部分被丢弃
list.stream().limit(2).forEach(System.out::println);

// 排序sorted()：对流中元素进行排序
// 无参：需要类实现Comparable接口    带参：传入Comparator接口实现
list.stream().sorted().forEach(System.out::println);
list.stream().sorted(Comparator.comparingInt(Person::getAge)).forEach(System.out::println);

// 转换map()：对流中元素进行计算或转换，一个元素转换成一个元素
list.stream().map(Person::getName).forEach(System.out::println);
list.stream().map(Person::getAge).map(age -> age + 10).forEach(System.out::println);

// 转换flatMap()：和map()类似，不同之处在于可以将一个元素转换成多个元素
list.stream().flatMap(person -> person.getBooks().stream()).forEach(System.out::println);

list.stream().flatMap(person -> person.getBooks().stream())
        .flatMap(book -> Arrays.stream(book.getCategory().split(",")))
        .distinct()
        .forEach(System.out::println);
```

#### 3. 终端操作
```
// 遍历 forEach()
list.stream().forEach(System.out::println);

// 统计 count()：获取流中元素个数
long count = list.stream().count();

// min()、max() 获取流中元素的最小值、最大值，返回的是 Optional
Optional<Person> min = list.stream().min(Comparator.comparingInt(Person::getAge));
Optional<Person> max = list.stream().max(Comparator.comparingInt(Person::getAge));

// 查找：任意一个元素 findAny()、第一个元素 findFirst()，返回的是 Optional
Optional<Person> any = list.stream().findAny();
Optional<Person> first = list.stream().findFirst();

// 判断 anyMatch()、allMatch()、noneMatch()
boolean b1 = list.stream().anyMatch(person -> person.getAge() > 20);    // 是否存在符合匹配条件的元素
boolean b2 = list.stream().allMatch(person -> person.getAge() > 20);    // 是否都符合匹配条件
boolean b3 = list.stream().noneMatch(person -> person.getAge() > 20);   // 是否都不符合匹配条件

// 收集 collect：将流中元素转换为一个集合(List、Set、Map)
List<String> listX = list.stream().map(Person::getName).distinct().collect(Collectors.toList());
Set<String> set = list.stream().map(Person::getName).collect(Collectors.toSet());
Map<Integer, List<Book>> map = list.stream().distinct().collect(Collectors.toMap(Person::getId, Person::getBooks));

// 结果归并 reduce()
// 传入一个初始值，然后和流中元素进行计算，计算结果再和后面元素进行计算，直到最后一个元素
// 求和、最大值、最小值   
Integer sum = list.stream().map(Person::getAge).reduce(0, Integer::sum);
Integer max = list.stream().map(Person::getAge).reduce(Integer.MIN_VALUE, Math::max);
Integer min = list.stream().map(Person::getAge).reduce(Integer.MAX_VALUE, Math::min);
// 不传初始值，将流中第一个元素作为初始值依次和后面元素进行计算
Optional<Integer> sum = list.stream().map(Person::getAge).reduce(Integer::sum);
Optional<Integer> max = list.stream().map(Person::getAge).reduce(Math::max);
Optional<Integer> min = list.stream().map(Person::getAge).reduce(Math::min);
```



#### 4. 数值流
* 采用 `reduce()` 进行数值操作会涉及到基本类型和引用类型的装箱、拆箱操作，因此效率较低
* StreamAPI提供了三种数值流：`IntStream、DoubleStream、LongStream`，当流操作为`纯数值操作`时，使用数值流能获得较高的效率
* 将普通流转换成数值流的三种方法：`mapToInt()、mapToDouble()、mapToLong()`

```
// 求和、最大值、最小值
int sum = list.stream().mapToInt(Person::getAge).sum();
OptionalInt max = list.stream().mapToInt(Person::getAge).max();
OptionalInt min = list.stream().mapToInt(Person::getAge).max();
```
