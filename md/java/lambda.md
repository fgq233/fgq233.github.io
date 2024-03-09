### Lambda 表达式
* Lambda 表达式是 JDK8 中的语法糖，主要是对某些`匿名内部类`进行简化，是函数式编程思想的重要体现
* Lambda 本质上是一种简洁、可传递的匿名函数
  * 具备`参数列表、方法体、返回类型`，甚至能够抛出异常
  * 是匿名的，`没有具体的函数名称`
* **当匿名内部类是一个接口，且只有一个抽象方法，则可以简化写成 Lambda 表达式形式**



### 一、语法
```
(parameters) -> expression  
参数列表 -> 表达式

(parameters) ->{ statements}
参数列表 -> {表达式集合}
```

#### 2. 可省略的规则
* 参数类型可省略
* 参数列表只有一个参数，则可省略：`参数括号()`
* 方法体只有一句代码，则可省略：`return关键字`、`花括号{}`、`结尾分号;`


#### 3. 示例
```
无参数,返回值 5  
() -> 5  
  
一个参数,返回其2倍的值  
x -> 2 * x  
  
二个参数,返回和  
(x, y) -> x + y  
  
一个参数,在控制台打印(返回值为void)  
s -> System.out.print(s)
```

#### 4. 双冒号写法
* 双冒号操作符实际是Lambda表达式的一种简写

```
List<String> list = Arrays.asList("A", "b", "c");

list.forEach(s -> System.out.println(s));
list.forEach(System.out::println);

list.stream().map(s -> s.length()).forEach(System.out::println);
list.stream().map(String::length).forEach(System.out::println);

list.stream().map(s -> s.toUpperCase()).forEach(System.out::println);
list.stream().map(String::toUpperCase).forEach(System.out::println);
```



| 类型            | 语法          | 示例                                  |
|:--------------|-------------|-------------------------------------|
| 实例方法引用      | 对象::实例方法名   | `System.out::println、String::length、Person::getAge` |
| 静态方法引用        | 类名::静态方法名   | `Integer::parseInt`                   |
| 父类实例方法引用      | super::方法名  | `super::methodname`                   |
| 构造方法引用       | 类名::new     | `ArrayList::new`                      |
| 数组构造方法引用      | 数组类型[]::new | `String[]:new`                        |
