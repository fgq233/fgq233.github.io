### Stream 流
### 一、案例
#### 1. 数据准备
```
@Data
@EqualsAndHashCode
@AllArgsConstructor
public class Person implements Comparable<Person> {
    private Integer id;
    private String name;
    private Integer age;
    private List<Book> books;

    @Override
    public int compareTo(Person p) {
        return this.getAge() - p.getAge();
    }
}

@Data
@EqualsAndHashCode
@AllArgsConstructor
public class Book {
    private String name;
    private String category;
}

List<Book> books1 = Arrays.asList(new Book("三国演义", "文学"), new Book("水浒传", "文学"), new Book("西游记", "文学"), new Book("红楼梦", "文学"));
List<Book> books2 = Arrays.asList(new Book("哈姆雷特", "文学"), new Book("语文书", "教育"), new Book("相对论", "知识"));
List<Book> books3 = Arrays.asList(new Book("物种起源", "科学"), new Book("数学书", "教育"), new Book("英语书", "教育"));
List<Person> list = Arrays.asList(
        new Person(1, "张三", 24, books1),
        new Person(2, "李四", 18, books2),
        new Person(3, "王五", 32, books3),
        new Person(3, "王五", 32, books3)
);
```



### 二、中间操作
#### 1. 过滤 filter()
对流中元素进行过滤，符合过滤条件的才能继续留在流中

```
list.stream().filter(person -> person.getAge() > 20).forEach(System.out::println);
```

#### 2. 去重 distinct()
根据对象`equals()`方法对流中元素进行去重

```
list.stream().distinct().forEach(System.out::println);
```


#### 3. 跳过 skip()、截取 limit()
* `skip()` 跳过流中前n个元素，返回剩下的元素
* `limit()` 截取流中前n个元素

```
list.stream().skip(2).forEach(System.out::println);
list.stream().limit(1).forEach(System.out::println);
```

#### 4. 排序 sorted()
对流中元素进行排序
* 无参：需要类实现`Comparable`接口
* 带参：传入`Comparator`接口实现

```
list.stream().sorted().forEach(System.out::println);
list.stream().sorted(Comparator.comparingInt(Person::getAge)).forEach(System.out::println);
```

#### 4. 转换 map()、flatMap()
对流中元素进行转换
* `map()`      对流中每个元素进行转换，转换成一个任意新的元素
* `flatMap()`  对流中每个元素进行转换，转换为一个新的流，然后把所有新的流合并成一个流
* 区别
  * 元素转换后的结果，`map()`可以是任意类型，而`flatMap()`必须为流
  * `flatMap()` 可以将 `List<Person>` 所有 `Person` 的成员变量 `List<Book> books` 聚合成一个集合


```
List<String> nameList = list.stream().map(Person::getName).collect(Collectors.toList());

List<Book> allBookList = list.stream().flatMap(person -> person.getBooks().stream()).collect(Collectors.toList());

List<String> allCategoryList = list.stream().flatMap(person -> person.getBooks().stream())
        .flatMap(book -> Arrays.stream(book.getCategory().split(",")))
        .distinct().collect(Collectors.toList());
```



### 三、终端操作
#### 1. 遍历 forEach()
```
list.stream().forEach(System.out::println);
```

#### 2. 统计 count()、min()、max()
* `count()`  获取流中元素个数
* `min()`    获取流中元素的最小值，返回的是`Optional`
* `max()`    获取流中元素的最小值，返回的是`Optional`

```
long count = list.stream().count();
Optional<Person> min = list.stream().min(Comparator.comparingInt(Person::getAge));
Optional<Person> max = list.stream().max(Comparator.comparingInt(Person::getAge));
```

#### 3. 查找 findAny()、findFirst()
* `findAny()`    获取流中任意一个元素，返回的是`Optional`
* `findFirst()`  获取流中第一个元素，返回的是`Optional`

```
Optional<Person> any = list.stream().findAny();
Optional<Person> first = list.stream().findFirst();
```


#### 4. 判断 anyMatch()、allMatch()、noneMatch()
* `anyMatch()`   流中是否存在符合匹配条件的元素，返回的是`boolean`
* `allMatch()`   流中元素是否都符合匹配条件，返回的是`boolean`
* `noneMatch()`  流中元素是否都不符合匹配条件，返回的是`boolean`


```
boolean b1 = list.stream().anyMatch(person -> person.getAge() > 20);   
boolean b2 = list.stream().allMatch(person -> person.getAge() > 20);   
boolean b3 = list.stream().noneMatch(person -> person.getAge() > 20);  
```



#### 5. 收集结果 collect()
* 将流中元素收集起来形成为一个新集合(List、Set、Map)
* `Collectors.toList()`
* `Collectors.toSet()`  可以起到集合无序、去重效果
* `Collectors.toMap()`
  * **当有重复key会抛出异常，当value为null的时候也会抛出异常**
  * 2个参数：分别为key、value，一般为了防止重复key不使用这个
  * 3个参数：第3个参数是一个lambda表达式，参数1、2分别为重复key上一个值、下一个值，根据返回值决定使用哪个

```
List<String> nameList = list.stream().map(Person::getName).collect(Collectors.toList());
Set<String> nameSet = list.stream().map(Person::getName).collect(Collectors.toSet());

// toMap() 2个参数
Map<Integer, Person> personMap = list.stream().collect(Collectors.toMap(Person::getId, Function.identity()));
Map<Integer, List<Book>> booksMap = list.stream().collect(Collectors.toMap(Person::getId, Person::getBooks));

// toMap() 3个参数
Map<Integer, Person> personMap = list.stream()
        .filter(person -> person.getId() != null)
        .collect(Collectors.toMap(Person::getId, Function.identity(), (oldVal, newVal) -> newVal));
Map<Integer, List<Book>> booksMap = list.stream()
        .filter(person -> person.getId() != null)
        .collect(Collectors.toMap(Person::getId, Person::getBooks, (oldVal, newVal) -> newVal));
        
// toMap() 分组
// 按照 id 分组，将相同id的元素放到一个val中, 如下：key为id，val为相同id的集合
Map<Integer, List<Person>> idMap = list.stream().collect(Collectors.groupingBy(Person::getId));
```

![stream](https://fgq233.github.io/imgs/java/stream.png)


#### 5. 结果归并 reduce()
传入一个初始值，然后和流中元素进行计算，计算结果再和后面元素进行计算，直到最后一个元素，类似迭代

```
// 传入初始值：求和、最大值、最小值   
Integer sum = list.stream().map(Person::getAge).reduce(0, Integer::sum);
Integer max = list.stream().map(Person::getAge).reduce(Integer.MIN_VALUE, Math::max);
Integer min = list.stream().map(Person::getAge).reduce(Integer.MAX_VALUE, Math::min);

// 不传初始值：将流中第一个元素作为初始值依次和后面元素进行计算
Optional<Integer> sum = list.stream().map(Person::getAge).reduce(Integer::sum);
Optional<Integer> max = list.stream().map(Person::getAge).reduce(Math::max);
Optional<Integer> min = list.stream().map(Person::getAge).reduce(Math::min);
```


### 四、数值流
* 采用 `reduce()` 进行数值操作会涉及到基本类型和引用类型的装箱、拆箱操作，因此效率较低
* StreamAPI提供了三种数值流：`IntStream、DoubleStream、LongStream`，当流操作为`纯数值操作`时，使用数值流能获得较高的效率
* 将普通流转换成数值流的三种方法：`mapToInt()、mapToDouble()、mapToLong()`

```
int sum = list.stream().mapToInt(Person::getAge).sum();
OptionalInt max = list.stream().mapToInt(Person::getAge).max();
OptionalInt min = list.stream().mapToInt(Person::getAge).max();
```
