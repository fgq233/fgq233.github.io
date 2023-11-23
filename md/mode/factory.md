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

* 特点：一个抽象工厂类、多个具体工厂类
* 优点
    * 符合开闭原则：增加⼀个新的产品，只需要实现其具体产品类、具体产品工厂类
    * 符合单⼀职责原则，每个⼯⼚只负责⽣产对应的产品
* 缺点：类的个数容易过多，增加复杂度






### 三、抽象工厂模式
#### 1.1 抽象产品Shape(同上)
#### 1.2 具体产品Shape(同上)
#### 2.1 具体产品Color
```java
public interface Color {
    void fill();
}
```

#### 2.2 具体产品Color
```java
public class Red implements Color {
    @Override
    public void fill() {
        System.out.println("填充红色");
    }
}

public class Yellow implements Color {
    @Override
    public void fill() {
        System.out.println("填充黄色");
    }
}
```

#### 3. 抽象工厂
```java
public abstract class AbstractFactory {
    public abstract Shape createShape(String shapeType);
    public abstract Color createColor(String colorType);
}
```

#### 4. 具体产品工厂
```java
public class MixedFactory extends AbstractFactory {
    @Override
    public Shape createShape(String shapeType) {
      if ("circle".equalsIgnoreCase(shapeType)) {
        return new Circle();
      } else if ("square".equalsIgnoreCase(shapeType)) {
        return new Square();
      }
      return null;
    }

    @Override
    public Color createColor(String colorType) {
      if ("red".equalsIgnoreCase(colorType)) {
        return new Red();
      } else if ("yellow".equalsIgnoreCase(colorType)) {
        return new Yellow();
      }
      return null;
    }
}
```

#### 5. 使用
```java
public class Test {
    public static void main(String[] args) {
        ShapeFactory factory = new MixedFactory();
        Shape cicle = factory.createShape("circle");
        Color yellow = factory.createColor("yellow");
        cicle.draw();
        yellow.fill();
    }
}
```

* 特点：基于简单工厂、工厂方法模式，每一个工厂不再只负责一个产品的创建，而是负责一组产品的创建
* 优点
  * 符合开闭原则：增加⼀个新的产品，只需要实现其具体产品类、具体产品工厂类
  * 符合单⼀职责原则，每个⼯⼚只负责⽣产对应的产品
* 缺点：类的个数容易过多，增加复杂度