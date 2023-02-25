### vue-router 嵌套路由

#### 1. 概念
* 一个组件内通过 `<router-view>` 渲染路由匹配的组件
* 同样地，一个被渲染的组件内部，也可以包含自己嵌套的 `<router-view>`

```
App.vue                
+--------------------------------------------------------+   
| | <router-link to="/home">首页</router-link>         | |   
| | <router-link to="/news">新闻</router-link>         | |   
| | <router-link to="/user">我的</router-link>         | |   
+--------------------------------------------------------+    

User.vue                          
+--------------------------------------------------------+   
| | <router-link to="/user/info">我的信息</router-link>   |   
| | <router-link to="/user/logs">我的日志</router-link>   |   
+--------------------------------------------------------+    
```



#### 2. 嵌套路由规则
嵌套路由规则通过配置 `children` 配置

```
const routes = [
  { path: "/", component: Home },
  { path: "/home", component: Home },
  { path: "/news", component: Mine },
  {
    path: "/user",
    component: User,
    children: [
      { path: "", component: Info },
      { path: "info", component: Info },
      { path: "logs", component: Logs },
    ],
  }
];
```


* 当 `/user/info` 匹配成功，`Info` 将被渲染到 `User` 的 `<router-view>`
* 当 `/user/logs` 匹配成功，`Logs` 将被渲染到 `User` 的 `<router-view>`
* 如果 children 数组中，某个路由规则的 path 值为空字符串，则这条路由规则，叫做**默认子路由**

