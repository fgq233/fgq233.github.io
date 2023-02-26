### vue-router 导航守卫
* 导航守卫用于控制路由的访问权限，最常见的是登录后才能访问其他页面，否则跳转到登录页
* 导航守卫分为3个级别：全局的，单个路由独享的，组件级的
  

#### 一、 全局前置守卫  beforeEach
* 每次发生路由跳转前，都会触发全局前置守卫
* 守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中

```
const router = new VueRouter({ ... })

// const router = createRouter({ ... }) vue-router 4.X 写法

router.beforeEach((to, from, next) => {
  // ...
})
```

* `to`: 即将要进入的目标路由对象
* `from`: 当前导航正要离开的路由
* `next()`: 放行方法，确保在任何给定的导航守卫中都被严格调用一次
  * `next()` 放行 
  * `next(false)`  取消导航，停留在当前页面
  * `next('/')` 或者 `next({ path: '/' })`  当前的导航被取消，然后进行一个新的导航
  
```
// 用户未能验证身份时重定向到 /login 的示例

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```


 
 
#### 二、 全局解析守卫 beforeResolve 
* 和`router.beforeEach` 类似，因为它在每次导航时都会触发
* 但是确保在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被正确调用

```
// 确保用户可以访问自定义 meta 属性 requiresCamera 的路由

router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

#### 三、 全局后置钩子 afterEach
和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身

```
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

#### 四、 路由独享的守卫 beforeEnter
在路由配置上定义 beforeEnter 守卫，只在进入路由时触发，不会在 params、query 或 hash 改变时触发  

```
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from, next) => {
      // ...
    }
  }
]
```


#### 五、 组件内的守卫 
可以在组件内直接定义路由导航守卫

* `beforeRouteEnter`
  * 在渲染该组件的对应路由被验证前调用
  * 不能获取组件实例 `this`，因为当守卫执行前，组件实例还没被创建
  
* `beforeRouteUpdate` 
  * 在当前路由改变，但是该组件被复用时调用
  * 例如：对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
  * 可以访问组件实例 `this`
 
* `beforeRouteLeave`
  * 导航离开该组件的对应路由时调用
  * 可以访问组件实例 `this`
  
```
const Foo = {
  template: `...`,
  beforeRouteEnter(to, from, next) {},
  beforeRouteUpdate(to, from, next) {},
  beforeRouteLeave(to, from, next) {}
}
```


#### 六、 完整的导航解析流程
* 导航被触发
* 在失活的组件里调用 `beforeRouteLeave` 守卫
* 调用全局的 `beforeEach` 守卫
* 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)
* 在路由配置里调用 `beforeEnter`
* 解析异步路由组件
* 在被激活的组件里调用 `beforeRouteEnter`
* 调用全局的 `beforeResolve` 守卫 (2.5+)
* 导航被确认
* 调用全局的 `afterEach` 钩子
* 触发 `DOM` 更新
* 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入