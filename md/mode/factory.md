### 工厂模式

* 工厂模式有三种类型：简单工厂、工厂方法、抽象工厂
* 在GoF的【设计模式】一书中，不将第一个视为设计模式，而是一种常用的编程习惯

### 一、简单工厂模式
#### 1. 抽象产品
```java
public interface Shape {
    void draw();
}
```

#### 2. 具体产品
```java
public class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("画圆");
    }
}

public class Square implements Shape {
    @Override
    public void draw() {
        System.out.println("画正方形");
    }
}
```

#### 3. 工厂类
```java
public class ShapeFactory {
    public static Shape createShape(String shapeType) {
        if ("circle".equalsIgnoreCase(shapeType)) {
            return new Circle();
        } else if ("square".equalsIgnoreCase(shapeType)) {
            return new Square();
        }
        return null;
    }
}
```

#### 4. 使用
```java
public class Test {
    public static void main(String[] args) {
        Shape circle = ShapeFactory.createShape("circle");
        Shape square = ShapeFactory.createShape("square");
        circle.draw();
        square.draw();
    }
}
```

* 特点：一个工厂类来创建所有具体对象
* 优点：实现简单
* 缺点：如果新增一个具体角色的话，需要修改工厂类，不符合开闭原则





### 二、工厂方法模式
#### 1. 抽象产品(同上)
#### 2. 具体产品(同上)
#### 3. 抽象工厂
```java
public abstract class ShapeFactory {
    public abstract Shape createShape();
}
```

#### 4. 具体产品工厂
```java
public class CircleFactory extends ShapeFactory {
    @Override
    public Shape createShape() {
        return new Circle();
    }
}

public class SquareFactory extends ShapeFactory {
    @Override
    public Shape createShape() {
        return new Square();
    }
}
```

#### 5. 使用
```java
public class Test {
    public static void main(String[] args) {
        ShapeFactory factory1 = new CircleFactory();
        ShapeFactory factory2 = new SquareFactory();
        Shape cicle = factory1.createShape();
        Shape square = factory2.createShape();
        circle.draw();
        square.draw();
    }
}
```

* 特点：一个产品抽象类、一个抽象工厂类、多个具体工厂类
* 优点
    * 符合开闭原则：增加⼀个新的产品，只需要实现其具体产品类、具体产品工厂类
    * 符合单⼀职责原则，每个⼯⼚只负责⽣产对应的产品
* 缺点：类的个数容易过多，增加复杂度






### 三、抽象工厂模式
#### 1.1 抽象产品、具体产品1
```java
public interface Keyboard {
    void print();
}

public class DellKeyboard implements Keyboard {
    @Override
    public void print() {
      System.out.println("戴尔制造-键盘");
    }
}
public class HPKeyboard implements Keyboard {
    @Override
    public void print() {
      System.out.println("HP制造-键盘");
    }
}
```

#### 1.2 抽象产品、具体产品2
```java
public interface Monitor {
    void show();
}

public class DellMonitor implements Monitor {
    @Override
    public void show() {
      System.out.println("戴尔制造-显示器");
    }
}
public class HPMonitor implements Monitor {
    @Override
    public void show() {
      System.out.println("HP制造-显示器");
    }
}
```

#### 3. 抽象工厂
```java
public interface IFactory {
    Keyboard createKeyboard();
    Monitor createMonitor();
}
```

#### 4. 具体产品工厂
```java
// Dell工厂，负责Dell系列产品
public class DellFactory implements IFactory {
    @Override
    public Keyboard createKeyboard() {
      return new DellKeyboard();
    }

    @Override
    public Monitor createMonitor() {
      return new DellMonitor();
    }
}
// HP工厂，负责HP系列产品
public class HPFactory implements IFactory {
    @Override
    public Keyboard createKeyboard() {
      return new HPKeyboard();
    }

    @Override
    public Monitor createMonitor() {
      return new HPMonitor();
    }
}
```

#### 5. 使用
```java
public class Test {
    public static void main(String[] args) {
      IFactory factory1 = new DellFactory();
      IFactory factory2 = new HPFactory();
    }
}
```

* 特点
  * 基于工厂方法模式的拓展
  * 多个产品抽象类、一个抽象工厂类、多个具体工厂类
  * 具体工厂类负责实现一组产品的实现，当一个产品组只有一个产品，就退化为工厂方法模式
* 优点：增加⼀个新的产品组比较方便，只需要创建新产品组的 --- 具体产品、实现工厂类
* 缺点：单独新增一个产品比较麻烦