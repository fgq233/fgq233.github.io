### vue-router 重定向和别名

### 一、重定向
#### 1. 使用
```
// 从 /home 重定向到 /
const routes = [{ path: '/home', redirect: '/' }]

// 重定向的目标是一个命名的路由
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]

// 重定向的目标是一个方法，/search/666 重定向到 /search?id=666
const routes = [
  {
    path: '/search/:uid',
    redirect: to => {       
      return { path: '/search', query: { id: to.params.uid } }
    },
  }
]
```

* 使用 `redirect` 配置重定向地址

* 重定向可以省略 `component` 配置，因为它从来没有被直接访问过，所以没有组件要渲染，除非有嵌套路由

* 如果一个路由记录有 `children` 和 `redirect` 属性，它也应该有 component 属性

* 如果重定向的目标是一个方法
   * 该方法接收目标路由 `$route` 作为参数
   * return 重定向的字符串路径或者一个路径对象



#### 2. 相对重定向
```
const routes = [
  {
    path: '/users/:id/posts',
    redirect: to => {
      return 'profile'
    },
  },
]

或

const routes = [
  {
    path: '/users/:id/posts',
    redirect: to => {
      return { path: 'profile'}
    },
  },
]
```

* 相对位置不以`/`开头
* 上述规则，将把 `/users/123/posts` 重定向到 `/users/123/profile`



### 二、别名
#### 1. 使用
* 重定向：当用户访问 /home 时，地址栏 URL 将会被替换成 /，然后匹配路由为 /

* 别名：为 path 设置别名，地址栏 URL 不变，但访问的组件为 path 匹配的组件
  * 如下：/ 和 /home 都返回 Homepage

```
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```


#### 2. 别名 + 嵌套路径
```
const routes = [
  {
    path: '/users',
    component: Users,
    children: [
      { path: '', component: UserList, alias: ['/people', 'list'] },
    ],
  },
]
```

下面 3 个 URL 都返回 UserList
* /users
* /users/list
* /people
 `