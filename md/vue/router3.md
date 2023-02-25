### vue-router 动态路由
[官方文档](https://router.vuejs.org/zh/installation.html)
 
* 很多时候，需要将给定匹配模式的路由映射到`同一个组件`
* 例如，我们可能有一个 User 组件，它应该对所有用户进行渲染，但用户 ID 不同
* 在`Vue Router`中，可以在路径中使用一个动态字段来实现，称之为**路径参数**
 
 
### 一、动态路由
#### 1. 路由规则中定义路径参数
```
const routes = [
  { path: '/users/:uid', component: User },
]
```

* 用冒号表示路径参数 `:id`
* 现在像 `/users/fgq` 和 `/users/ym` 这样的 URL 都会映射到同一个路由
* 当一个路由被匹配时，它的相关参数将在每个组件中存储在 `this.$route` 中
  * 完整路径 `this.$route.fullPath`，如 /user/666?name=fgq
  * 路径 `this.$route.path`，如 /user
  * 路径参数 `this.$route.params`，如 {uid: 666}
  * 查询参数 `this.$route.query`，如 {name: fgq}

#### 2. User.vue
```
<template>
  <div>
    <h3> {{ $route.params.uid }} </h3>
    <button @click="showParams">打印路径参数</button>
  </div>
</template>

<script>
export default {
  methods: {
    showParams() {
      console.log(this.$route)
    }
  }
}
</script>
```

#### 3. 开启 props 传参
* 路由规则中 `props: true` 开启props 传参，组件中定义 `props` 参数接收路径参数
* 对于有命名视图的路由，需要为每个命名视图定义 props 选项

```
const routes = [
  { path: '/users/:uid', component: User, props: true},
]

const routes = [
  {
    path: '/user/:uid',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```

```
export default {
  props: ['uid']
}
```

#### 4. 多个路径参数
可以在同一个路由中设置有多个路径参数，它们会映射到 `$route.params` 上的相应字段

| 匹配模式   | 匹配路径         | `$route.params` |
| ------ | ----------| ---- |
| /users/:uid | /users/666 | { uid: '666' } |
| /users/:uid/posts/:pid | /users/666/posts/123 | { uid: '666', pid: '123' } |



#### 4. 响应路由参数的变化
* 使用带有参数的路由时需要注意的是，当用户从 /users/666 导航到 /users/888 时，
相同的组件实例将被重复使用，不过这也意味着组件的生命周期钩子不会被调用
* 要对同一个组件中参数的变化做出响应的话，可以使用侦听器监听 `$route` 对象上的任意属性

```
<script>
export default {
  created() {
    this.$watch(
      () => this.$route.params,
      (newParams, preParams) => {
        // 对路由变化做出响应...
      }
    )
  }
}
</script>
```
 
 
#### 5. 捕获所有路由(3.X版本)
```
{path: '*'}            // 会匹配所有路径

{path: '/user-*'}      // 会匹配以 /user- 开头的任意路径

{path: '/user/*'}      // 会匹配以 /user/ 开头的任意路径
```

* 常规参数只会匹配被 / 分隔的 URL 片段中的字符。如果想匹配任意路径，可以使用通配符 (*)
* 使用通配符路由时，确保路由的顺序是正确的，通常含有通配符的路由应该放在最后
* 路由 `{ path: '*' }` 通常用于客户端 404 错误
* 注意：4.X 删除了*，路由现在必须使用自定义的 regex 参数来表示所有路由`(*、/*)`
  * `pathMatch` 是参数的名称，
  * 例如：跳转到 `/not/found` 会得到`{ params: { pathMatch: ['not', 'found'] } }`

```
const routes = [
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]
```

#### 6. 匹配优先级
同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：`定义得越早，优先级就越高`


