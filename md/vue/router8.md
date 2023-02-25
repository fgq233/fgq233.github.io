### vue-router History 模式

* `vue-router` 默认 hash 模式，使用 URL 的 `hash` 来模拟一个完整的 URL，当 URL 改变时，页面不会重新加载
  * `http://localhost:8080/#/home`
  * `http://localhost:8080/#/user/666`
  
* 如果不想要很丑的 hash，可以使用路由的 `history` 模式，这种模式利用 `history.pushState API`
来完成 URL 跳转而无须重新加载页面
  * `http://localhost:8080/home`
  * `http://localhost:8080/user/666`

#### vue-router 3.X History 模式
```
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

#### vue-router 4.X History 模式
```
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})
```