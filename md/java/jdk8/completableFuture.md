###  CompletableFuture 
* CompletableFuture是Java 8的一个类，用于处理异步操作和并发编程

### 一、功能特点
#### 1. 执行任务
* 提供 runAsync()、supplyAsync()方法，接受Runnable、Supplier实例，提交任务到线程池中进行异步处理，避免阻塞主线程
* runAsync() 用于执行没有返回值的任务，而supplyAsync()方法用于执行有返回值的任务

#### 2. 结果处理、异常处理
* 结果处理：可以使用thenApply()、thenAccept()等方法对结果进行处理
* 异常处理：使用exceptionally()、handle()方法，可以捕获并处理异步任务执行过程中的异常

#### 3. 链式操作、组合操作
* 链式操作：通过thenApply()、thenAccept()、thenRun()等方法，可以将多个CompletableFuture串联起来形成一个操作链
* 组合操作：提供了allOf()、anyOf()方法，用于组合多个异步任务，allOf()方法等待所有任务完成，anyOf()方法则等待任何一个任务完成

#### 4. 超时控制
使用completeOnTimeout()、completeOnCancel()方法，可以设置任务的超时时间，若任务在指定的时间内未完成，可以执行相应操作，避免无限期的等待


### 二、常用API
#### 1. 执行任务
```java
// 执行异步任务，无返回值
public static CompletableFuture<Void> runAsync(Runnable runnable)
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)

// 执行异步任务，有返回值
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```


#### 2. 结果处理
```java
// 不关心上一个任务执行结果，执行下一个任务
public CompletableFuture<Void> thenRun(Runnable action)
public CompletableFuture<Void> thenRunAsync(Runnable action)

// 在任务完成后，执行消费操作
public CompletableFuture<Void> thenAccept(Consumer<? super T> action)
public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action)

// 在任务完成后，转换结果为新的CompletableFuture，新的CompletableFuture有返回结果
public <U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn)
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn)
```

* thenRun()、thenRunAsync() 区别
  * 如果执行第一个任务的时候，传入了一个自定义线程池 Executor
  * 调用thenRun()执行第二个任务时，则第二个任务和第一个任务是共用同一个线程池
  * 调用thenRunAsync()执行第二个任务时，则第一个任务使用的是你自己传入的线程池，第二个任务使用的是ForkJoin线程池
* 后续 thenAccept、thenApply 也是这个区别


#### 3. 任务完成/异常处理
```java
// 异步任务执行完成后，执行的回调方法，该回调方法无返回值，返回的 CompletableFuture 结果是第一个任务的结果
public CompletableFuture<T> whenComplete(BiConsumer<? super T, ? super Throwable> action)

// 异步任务执行完成后，执行的回调方法，该回调方法有返回值，返回的 CompletableFuture 结果是回调方法的结果
public <U> CompletableFuture<U> handle(BiFunction<? super T, Throwable, ? extends U> fn)

// 处理异步任务执行过程中发生的异常，并返回新的CompletableFuture 
public CompletableFuture<T> exceptionally(Function<Throwable, ? extends T> fn) 
```


#### 4. 获取结果
```java
public T get() throws InterruptedException, ExecutionException
public T get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException

public T join()
```

* 相同：都是阻塞等待，并获取异步任务的结果
* 区别
  * get()抛出检查时异常，程序必须处理,join()抛出运行时异常，程序可不做处理
  * get()可以传递参数，在一定时间内阻塞获取结果
  * join()更适合流式编程

#### 5.1. 组合操作 - ALL、ANY
```java 
// 等待所有任务完成，返回表示完成的CompletableFuture，若任意一个任务异常，返回的CompletableFuture执行get方法会抛出异常
public static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)

// 等待任意一个任务完成，返回第一个完成的CompletableFuture，若执行的任务异常，返回的CompletableFuture执行get方法会抛出异常
public static CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs)
```


#### 5.2. 组合操作 - AND
```
public <U,V> CompletableFuture<V> thenCombine(CompletionStage<? extends U> other, BiFunction<? super T,? super U,? extends V> fn)
public <U> CompletableFuture<Void> thenAcceptBoth(CompletionStage<? extends U> other, BiConsumer<? super T, ? super U> action) 
public CompletableFuture<Void> runAfterBoth(CompletionStage<?> other, Runnable action)
```

* AND组合：这3者都是将两个CompletableFuture组合起来，只有这两个都正常执行完了，才会执行参数2
* 区别
  * thenCombine()  会将两个任务的执行结果作为方法入参，传递到参数2，参数2有返回值
  * thenAcceptBoth()  会将两个任务的执行结果作为方法入参，传递到参数2，参数2无返回值
  * runAfterBoth()  不会把执行结果当做方法入参，且没有返回值


#### 5.3. 组合操作 - OR
```
public <U> CompletableFuture<U> applyToEither(CompletionStage<? extends T> other, Function<? super T, U> fn)
public CompletableFuture<Void> acceptEither(CompletionStage<? extends T> other, Consumer<? super T> action)
public CompletableFuture<Void> runAfterEither(CompletionStage<?> other, Runnable action)
```

* OR组合：这3者都是将两个CompletableFuture组合起来，只要其中一个执行完了，就会执行参数2
* 区别
  * applyToEither()  会将已经执行完成的任务，作为方法入参，传递到参数2，参数2有返回值
  * acceptEither()  会将已经执行完成的任务，作为方法入参，传递到参数2，参数2无返回值
  * runAfterEither()  不会将已经执行完成的任务，作为方法入参，参数2无返回值



### 三、核心组件
* 状态管理：使用 volatile 修饰的整型变量 state 来表示 CompletableFuture 的状态
  *  NEW：初始状态，表示任务还未开始
  *  COMPLETING：任务正在完成中，此时不允许其他线程修改状态
  *  NOR MAL：任务正常完成
  *  EXCEPTIONAL：任务异常完成
  *  CANCELLED：任务被取消
* 结果存储：使用 volatile 修饰的 Object 类型变量 result 来存储异步任务的结果或异常
* 依赖管理：CompletableFuture 内部可能维护多个依赖它的 CompletableFuture，当自身状态变化时，需要通知这些依赖进行相应的处理
*   线程池：CompletableFuture 默认使用 ForkJoinPool.commonPool() 作为执行异步任务的线程池，也可以自定义线程池


### 四、注意事项
*  异常处理：异步任务中抛出的异常不会被主线程捕获，需要使用 exceptionally()方法处理
*  线程池选择：CompletableFuture默认使用ForkJoinPool，但在高并发场景下，可能需要自定义线程池以避免资源耗尽
*  阻塞问题：get()、join()方法会阻塞当前线程，直到异步任务完成，在使用时要小心，可以添加超时时间，避免造成性能问题
*  取消操作：CompletableFuture支持取消操作，但取消并不保证一定会成功
