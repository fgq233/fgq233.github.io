### 原型模式
原型模式是一种创建型模式，使用场景：对象的复制

### 一、原型模式-浅拷贝
#### 1. 浅拷贝

* 成员变量为`基本数据类型`，进行值传递
* 成员变量为`引用数据类型`，进行引用传递(内存地址传递)
* 特点：拷贝后的引用类型成员变量是同一个实例，修改后会影响所有克隆的实例

```java

@Data
public class Sheep implements Cloneable {
    private String name;
    private int age;
    private Cat cat;

    public Sheep(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

@Data
public class Cat implements Cloneable {
    private String name;

    public Cat(String name) {
        this.name = name;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

#### 2. 使用

```java
public class Test {

    public static void main(String[] args) throws CloneNotSupportedException {
        Sheep sheep = new Sheep("羊", 6);
        sheep.setCat(new Cat("猫"));

        Sheep sheep2 = (Sheep) sheep.clone();
        System.out.println(sheep2);             // Sheep(name=羊, age=6, cat=Cat(name=猫))
        System.out.println(sheep == sheep2);    // false
        System.out.println(sheep.getCat() == sheep2.getCat());  // true
    }
}
```

### 二、原型模式-深拷贝
* 成员变量为`基本数据类型`，进行值传递
* 成员变量为`引用数据类型`，为其申请存储空间，然后复制其基本数据类型、引用类型(也会申请内存空间、然后复制)
* 实现方式：重写 clone 方法、对象序列化......

```java

@Data
public class Sheep implements Cloneable {
    private String name;
    private int age;
    private Cat cat;

    public Sheep(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Sheep clone = (Sheep) super.clone();
        clone.cat = (Cat) cat.clone();
        return clone;
    }
}
```

* 特点
  * 每有一个引用类型成员变量，都要在clone()方法里进行处理
  * 若该成员变量也有引用类型成员变量，也要在其clone方法里处理

