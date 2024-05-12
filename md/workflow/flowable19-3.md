###  事务子流程


#### 1、描述
* 事件子流程不能直接启动，而是通过事件被动触发启动
* 可以在`流程级别、任何子流程级别`添加事件子流程
* 使用注意：
  * 事件子流程不能有任何入口或出口顺序流
  * 不能在事件子流程中使用空启动事件
  * 目前的限制：Flowable支持`错误、定时器、信号、消息启动事件`触发事件子流程


#### 2、XML表示
事件子流程需要将`triggeredByEvent`属性设置为true

```
<subProcess id="eventSubProcess" triggeredByEvent="true">
	...
</subProcess>
```

#### 3、流程图
边框为`虚线`

![](https://fgq233.github.io/imgs/workflow/flow36.png)


上面是使用`错误开始事件`触发事件子流程的例子
