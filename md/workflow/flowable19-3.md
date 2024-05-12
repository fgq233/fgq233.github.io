###  调用活动

#### 1、定义
* 调用活动是在一个流程定义中调用另一个独立的流程定义
* 通常可以定义一些通用流程作为调用子流程，供其他多个流程定义复用，这种子流程使用 `callActivity` 元素来进行调用，很方便地嵌入到主流程中
* 当流程执行到达调用活动时，会创建一个新的执行，作为到达调用活动的执行的子执行
  * 这个子执行用于执行子流程，也可用于创建并行子执行（与普通流程中行为类似）
  * 父执行将等待子流程完成，之后沿原流程继续执行


#### 2、XML表示
调用活动是一个普通活动，在`calledElement`中引用流程定义
* `flowable:calledElementType` 可以配置流程定义`id、key`
* `calledElement` 是流程定义的id值或key值，与`calledElementType`对应


```
<process id="XX1" name="XX1" isExecutable="true">
  <callActivity id="sid-XXXXX" name="另外一个流程定义" 
      calledElement="XX2" 
      flowable:calledElementType="key" 
      flowable:fallbackToDefaultTenant="false">
  </callActivity>
</process>
```

#### 3、流程图

![](https://fgq233.github.io/imgs/workflow/flow39.png)

![](https://fgq233.github.io/imgs/workflow/flow40.png)


