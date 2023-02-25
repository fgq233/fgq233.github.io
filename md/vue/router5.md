### vue-router 命名路由与编程式导航

### 一、命名路由
#### 1. 路由name
除了 path 之外，还可以为任何路由提供 name，作用如下
* 让编程式导航没有硬编码的 URL
* params 的自动编码/解码
* 防止在 url 中出现打字错误
* 绕过路径排序

```
const routes = [
  {
    path: '/user',
    name: 'user',
    component: User,
  },
]   
```

#### 2. 链接到命名路由
```
<router-link :to="{ name: 'user', params: { name: 'fgq' }}">
  User
</router-link>
```


### 二、编程式导航
* 在 Vue 实例中，通过 $router 访问路由实例，因此可以调用 `this.$router.` 导航相关方法
  * `this.$router.push()`  导航到不同的位置
  * `this.$router.replace()`  替换当前位置
  * `this.$router.go()`
* 这些方法都会返回一个 `Promise`，等到导航完成后才知道是成功还是失败

#### 1. $router.push
* 会向 `history` 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，会回到之前的 URL
* 注意：如果提供了`path`，`params` 会被忽略 

```
// 字符串路径
router.push('/users/666')

// 命名路由，带路径参数 (/users/666)
router.push({ name: 'users', params: { uid: 666 } })

// 带查询参数 (/users/666?name=fgq)
router.push({ path: '/users/666', query: { name: 'fgq' } })

// 带hash (/users#team)
router.push({ path: '/users/666', hash: '#team' })
```

#### 2. $router.replace
在导航时不会向 `history` 添加新记录

```
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```

#### 3. 横跨历史 router.go()
该方法采用一个整数作为参数，表示在历史堆栈中前进或后退多少步，类似于 `window.history.go(n)`

```
// 前进一条记录，与 router.forward() 作用相同
router.go(1)

// 后退一条记录，与 router.back() 作用相同
router.go(-1)
```