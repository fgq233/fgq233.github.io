### vue-router 命名视图
有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如一个布局，有 sidebar (侧导航) 和 main (主内容) 两个视图，
这个时候就可以使用命名视图

#### 1. 定义命名视图
* `router-view` 添加 `name` 即为命名视图
* 如果没有设置名字，那么默认为 `default`

```
<router-view name="LeftSidebar"></router-view>
<router-view></router-view>
<router-view name="RightSidebar"></router-view>

```

#### 2. 命名视图的路由规则
使用 `components` 配置 (带上 s)命名视图

```
const routes =  [
    {
      path: '/',
      components: {
        default: Home,
        LeftSidebar,    // LeftSidebar: LeftSidebar 的缩写
        RightSidebar,   // RightSidebar: RightSidebar 的缩写
      },
    },
  ]
```

 