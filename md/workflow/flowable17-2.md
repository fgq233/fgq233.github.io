###  服务任务 
服务任务是一个自动化任务，无须人为参与，用于调用Java相关逻辑，一共有3种
* `flowable:class` 指定实现了`JavaDelegate`或`ActivityBehavior`的类
* `flowable:delegateExpression` 调用解析为委托对象的表达式
* `flowable:expression` 调用`UEL`表达式

#### 一、实现JavaDelegate或ActivityBehavior的类
#### 1、指定流程执行时调用的类
```
<serviceTask id="javaService" name="Service Task" flowable:class="org.flowable.MyJavaDelegate" />
<serviceTask id="javaService" name="Service Task" flowable:class="org.flowable.MyActivityBehavior" />
```
#### 2、实现
```
public class MyJavaDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("MyJavaDelegate..." );
    }
}

public class MyActivityBehavior implements ActivityBehavior {
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("MyActivityBehavior...");
    }
}
```

#### 3、注意
* Flowable 只会为serviceTask上定义的Java类创建一个实例，所有流程实例共享同一个类实例，用于调用execute(DelegateExecution)
* 所以该类不能有任何成员变量，并需要是线程安全的，因为它可能会在不同线程中同时执行


#### 二、delegateExpression 解析为委托对象的表达式
```
<serviceTask id="serviceTask" flowable:delegateExpression="${delegateExpressionBean}" />
```

* 委托表达式中只用写 bean 的名称，不需要写方法名，引擎会自动调用其 execute 方法


#### 三、expression 调用`UEL`表达式
#### 1、方法表达式
```
<serviceTask id="javaService" name="Service Task" flowable:expression="#{printer.printMessage()}" />
<serviceTask id="javaService" name="Service Task" flowable:expression="#{printer.printMessage(execution, myVar)}" />
```

* 将在名为`printer`的对象上调用`printMessage()`方法
  * 无参
  * 带参
    * 第一个参数为`DelegateExecution`，名为`execution`，在表达式上下文中默认可用
    * 第二个参数是在当前执行实例中，名为myVar变量的值


#### 2、值表达式
```
<serviceTask id="javaService" name="Service Task" flowable:expression="#{xxBean.total}" />
```

* 会调用名为`xxBean`的`Bean`的`ready`参数的`getter`方法，实质是调用`xxBean.getReady()`
* 该对象会被解析为执行的流程变量或（如果可用的话）Spring上下文中的bean
