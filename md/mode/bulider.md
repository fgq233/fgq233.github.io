### 建造者模式
建造者模式是一种创建型设计模式，使你能够分步骤创建复杂对象，该模式允许你使用相同的创建代码生成不同类型和形式的对象

### 一、建造者模式中4个角色
* 产品 `Product`：表示被构造的复杂对象，由具体建造者构建
* 抽象建造者 `Bulider`：定义创建产品的抽象方法和部件，用于将建造流程整理出来，但不在乎建造细节，即只声明抽象方法
* 具体建造者 `ConcreteBulider`：实现Bulider的接口，创建一个具体产品，定义并明确它所创建的表示，并提供一个检索产品的接口
* 指挥者 `Director`：需要传入Builder实例，它主要有两个作用，一是控制产品的生产过程，二是隔离产品与其生产过程


### 二、建造者模式 - 建房子
#### 1. 产品
```java
@Data
public class House {

    // 地基
    private String basic;
    // 骨架
    private String skeleton;
    // 墙壁
    private String wall;
    // 房顶
    private String roof;

}
```

#### 2. 抽象建造者
```java
public abstract class HouseBulider {

    protected House house = new House();

    public abstract void bulidBasic();

    public abstract void bulidSkeleton();

    public abstract void bulidWall();

    public abstract void bulidRoof();

    public abstract House createHouse();

}
```

#### 3. 具体建造者
```java
public class ConcreteHouseBulider extends HouseBulider {

    @Override
    public void bulidBasic() {
        System.out.println("打地基");
    }

    @Override
    public void bulidSkeleton() {
        System.out.println("搭建骨架");
    }

    @Override
    public void bulidWall() {
        System.out.println("砌墙");
    }

    @Override
    public void bulidRoof() {
        System.out.println("搭建屋顶");
    }

    @Override
    public House createHouse() {
        return house;
    }

}
```


#### 4. 指挥者
```java
public class HouseDirector {

    private HouseBulider bulider;

    public HouseDirector(HouseBulider bulider) {
        this.bulider = bulider;
    }

    public House createHouse() {
        bulider.bulidBasic();
        bulider.bulidSkeleton();
        bulider.bulidWall();
        bulider.bulidRoof();
        return bulider.createHouse();
    }
}
```

#### 5. 测试
```java
public class Test {

    public static void main(String[] args) throws CloneNotSupportedException {
        HouseBulider bulider = new ConcreteHouseBulider();
        HouseDirector director = new HouseDirector(bulider);
        House house = director.createHouse();
        System.out.println(house);
    }
}
```
