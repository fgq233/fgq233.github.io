#### 1、懒加载
Ribbon默认是采用懒加载，即第一次访问远程服务时才会去创建LoadBalanceClient，所以首次请求时间比较长


#### 2、饥饿加载
饥饿加载会在项目启动时就创建，降低首次访问的耗时
 

#### 3、开启饥饿加载
单个

```
ribbon:
  eager-load:
    enabled: true           # 开启饥饿加载
    clients: userservice    # 指定饥饿加载的服务名称
```

多个

```
ribbon:
  eager-load:
    enabled: true           
    clients:                
      - userservice
      - baseservice
      - xxxservice
```

