### 适配器模式

适配器模式将一个类的接口转换成另一种接口，让原本不兼容的类可以使用

### 一、角色

* 客户端：客户端与服务中接口不兼容， 因此无法直接调用其功能
* 服务(被适配者)：包含客户端需要使用的接口
* 适配器： 一个同时与客户端和服务交互的类，适配器接受客户端通过适配器接口发起的调用，并将其转换为适用于被封装服务对象的调用

### 二、手机充电案例

* 客户端：手机，需要进行充电
* 服务：家庭 220V 电压的插口
* 适配器：手机充电器，将220V电压转化为手机可以充电的 5V，供客户端使用

#### 1. 服务(被适配者)

```java
public class Voltage220V {

    public int out220V() {
        return 220;
    }

}
```

#### 2. 适配器转换接口

```java
public interface IV5 {
    int out5V();
}
```

#### 3. 适配器

```java
// 类适配器；继承被适配者，实现转换接口
public class Adapter1 extends Service220V implements IService5V {

    @Override
    public int out5V() {
        int source = out220V();
        return source / 44;
    }
}

// 对象适配器；传入被适配者实例，实现转换接口
public class Adapter2 implements IService5V {
    private Service220V service220V;

    public Adapter2(Service220V service220V) {
        this.service220V = service220V;
    }

    @Override
    public int out5V() {
        int target = 0;
        if (service220V != null) {
            int source = service220V.out220V();
            target = source / 44;
        }
        return target;
    }
}
```

#### 4. 客户端
```java
public class Phone {

    public void charge(IService5V service5V) {
        if (service5V.out5V() == 5) {
            System.out.println("5V充电中");
        } else {
            System.out.println("电压不匹配，无法充电");
        }
    }
}
```

#### 5. 测试

```java
public class Test {

    public static void main(String[] args) {
        Phone phone = new Phone();
        phone.charge(new Adapter1());
        phone.charge(new Adapter2(new Service220V()));
    }
}
```
