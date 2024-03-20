# ZooKeeper Java API


### 一、Curator
* Curator 是 ZooKeeper 的Java客户端库，对 ZooKeeper 原生 Java API的封装，使用起来更加简便
* 官网：[http://curator.apache.org](http://curator.apache.org)

 
 
### 二、Curator 使用
#### 1. 依赖
```
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-framework</artifactId>
    <version>4.2.0</version>
</dependency>

<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>4.2.0</version>
</dependency>
```

#### 2.  客户端初始化
```
// 重试策略
RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);
// 客户端创建
CuratorFramework client = CuratorFrameworkFactory.builder()
        .connectString("127.0.0.1:2181")
        .sessionTimeoutMs(60 * 1000)     // 会话超时60s
        .connectionTimeoutMs(15 * 1000)  // 连接超时30s
        .retryPolicy(retryPolicy)
        //.namespace("fgq")               // 命名空间，生成的节点会自动在前面带上
        .build();
// 开启连接
client.start();
```


#### 3.  客户端关闭
```
client.close();
```


### 三、Curator 增删改查
#### 1. 增
```
// 基本创建：如果创建节点时没有指定数据，则默认将当前客户端的ip作为数据存储
String path = client.create().forPath("/app1");

// 创建时设置数据 
String path = client.create().forPath("/app2", "fgq666".getBytes());

// 创建时设置节点的类型  withMode
String path = client.create().withMode(CreateMode.EPHEMERAL).forPath("/app3");

// 创建多级节点，creatingParentsIfNeeded() 如果父节点不存在，则创建父节点
String path = client.create().creatingParentsIfNeeded().forPath("/app4/p1");
```

#### 2. 查
```
// 查询节点数据
byte[] data = client.getData().forPath("/app1");

// 查询子节点
List<String> path = client.getChildren().forPath("/");

// 查询节点状态信息 Stat
Stat status = new Stat();
client.getData().storingStatIn(status).forPath("/app1");
```

#### 3. 改
```
// 修改节点数据
client.setData().forPath("/app1", "fgq666".getBytes());

// 根据版本修改
Stat status = new Stat();
client.getData().storingStatIn(status).forPath("/app1");
client.setData().withVersion(status.getVersion()).forPath("/app1", "fgq88888888".getBytes());
```


#### 4. 删
```
// 删除单个节点
client.delete().forPath("/app1");

// 删除带有子节点的节点
client.delete().deletingChildrenIfNeeded().forPath("/app4");

// 必须成功的删除:为了防止网络抖动，其本质就是重试
client.delete().guaranteed().forPath("/app2");

// 带回调的删除
client.delete().guaranteed().inBackground(new BackgroundCallback() {

    @Override
    public void processResult(CuratorFramework client, CuratorEvent event) throws Exception {
        System.out.println(event);
    }
}).forPath("/app1");
```


### 四、Watcher 监听事件
#### 1. 发布/订阅功能
* ZK 中引入了Watcher 机制来实现了发布/订阅功能
* ZK 允许用户在指定节点上注册一些Watcher，并且在一些特定事件触发的时候，
ZK 服务端会将事件通知到监听的客户端上去，该机制是 ZK 实现分布式协调服务的重要特性
* Curator引入了 Cache 来实现对 ZK 服务端事件的监听
    * `NodeCache` : 监听某一个特定的节点
    * `PathChildrenCache` : 监控一个ZNode的所有子节点 
    * `TreeCache` : 可以监控整个树上的所有节点，类似于 `NodeCache` 和 `PathChildrenCache` 的组合
    
#### 2. NodeCache
```
//1. 创建 NodeCache 对象
final NodeCache nodeCache = new NodeCache(client, "/app1");
//2. 注册监听
nodeCache.getListenable().addListener(new NodeCacheListener() {
    @Override
    public void nodeChanged() throws Exception {
        System.out.println("节点变化了~");
        //获取修改节点后的数据
        byte[] data = nodeCache.getCurrentData().getData();
        System.out.println(new String(data));
    }
});

//3. 开启监听.如果设置为true，则开启监听时，加载缓冲数据
nodeCache.start(true);
```


#### 3. PathChildrenCache
```
//1.创建 PathChildrenCache 对象
PathChildrenCache pathChildrenCache = new PathChildrenCache(client, "/app2", true);

//2. 注册监听
pathChildrenCache.getListenable().addListener(new PathChildrenCacheListener() {
    @Override
    public void childEvent(CuratorFramework client, PathChildrenCacheEvent event) throws Exception {
        System.out.println("子节点变化了~");
        System.out.println(event);
        // 根据 type 判断事件类型
        PathChildrenCacheEvent.Type type = event.getType();
        if (type.equals(PathChildrenCacheEvent.Type.CHILD_ADDED)) {
            System.out.println("新增了节点");
        } else if (type.equals(PathChildrenCacheEvent.Type.CHILD_UPDATED)) {
            System.out.println("节点数据更新了");
            byte[] data = event.getData().getData();
            System.out.println(new String(data));
        } else if (type.equals(PathChildrenCacheEvent.Type.CHILD_REMOVED)) {
            System.out.println("删除了节点");
        }
    }
});
//3. 开启监听
pathChildrenCache.start();
```
    
    
#### 4. TreeCache
```
//1. 创建 TreeCache 对象
TreeCache treeCache = new TreeCache(client, "/app2");

//2. 注册监听
treeCache.getListenable().addListener(new TreeCacheListener() {
    @Override
    public void childEvent(CuratorFramework client, TreeCacheEvent event) throws Exception {
        System.out.println("节点变化了");
        System.out.println(event);
        // 根据 type 判断事件类型
        TreeCacheEvent.Type type = event.getType();
        if (type.equals(TreeCacheEvent.Type.NODE_ADDED)) {
            System.out.println("新增了节点");
        } else if (type.equals(TreeCacheEvent.Type.NODE_UPDATED)) {
            System.out.println("节点数据更新了");
            byte[] data = event.getData().getData();
            System.out.println(new String(data));
        } else if (type.equals(TreeCacheEvent.Type.NODE_REMOVED)) {
            System.out.println("删除了节点");
        }
    }
});

//3. 开启
treeCache.start();
```

高版本中 `CuratorCache` 替代了 `TreeCache`
