### 多线程
### 一、常用实现方式
#### 1. 实现 Runnable 接口
```
public class Test {

    public static void main(String[] args) {
        System.out.println("主线程：" + Thread.currentThread().getName());
        // 匿名内部类写法
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("子线程：" + Thread.currentThread().getName());
            }
        }).start();
        // 匿名内部类 Lamda表达式写法
        new Thread(() -> System.out.println("子线程：" + Thread.currentThread().getName())).start();
        // 外部类写法
        new Thread(new MyTask()).start();
    }


}

public class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("子线程：" + Thread.currentThread().getName());
    }
}
```

#### 2. 继承 Thread 类
```
public class Test {
    public static void main(String[] args) {
        System.out.println("主线程：" + Thread.currentThread().getName());
        MyThread myThread = new MyThread();
        myThread.start();
    }
}

public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("子线程：" + Thread.currentThread().getName());
    }
}
```


#### 3. 实现 Callable 接口 + FutureTask 包装类
```
public class Test {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("主线程：" + Thread.currentThread().getName());
        FutureTask<List<String>> futureTask = new FutureTask<>(new MyTask());
        new Thread(futureTask).start();
        //  获取返回值
        List<String> strings = futureTask.get();
        strings.stream().forEach(System.out::println);
    }
}

public class MyTask implements Callable<List<String>> {

    @Override
    public List<String> call() throws Exception {
        System.out.println("子线程：" + Thread.currentThread().getName());
        return Arrays.asList("A", "B", "C");
    }
}
```


#### 4. Executors类创建线程池
* 定长线程池 `FixedThreadPool`
* 定时线程池 `ScheduledThreadPool`
* 可缓存线程池 `CachedThreadPool`
* 单线程化线程池 `SingleThreadExecutor`
* 完全手动的 `ThreadPoolExecutor`

```
public class Test {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("主线程：" + Thread.currentThread().getName());
        // 创建固定数量线程的线程池
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        // 添加子线程(方式1、2、3创建的线程)
        for (int i = 0; i < 5; i++) {
            executorService.execute(new MyTask());
        }
        // 关闭线程池
        executorService.shutdown();
    }
}

public class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("子线程：" + Thread.currentThread().getName());
    }
}
```