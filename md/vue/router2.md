### vue-router 入门
[官方文档](https://router.vuejs.org/zh/installation.html)
 
### 一、安装
```
npm install vue-router@4
or
yarn add vue-router@4
```

### 二、组件 App.vue
```
<template>
    <div id="app">
      <p>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </p>
      
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

* 使用自定义组件 `router-link` 来创建链接，这使得`Vue Router`可以在不重新加载页面的情况下更改 URL，
处理 URL 的生成以及编码
* `router-view` 将显示与 url 对应的组件，类似动态组件





### 三、Vue2.X + Vue Router 3.X
#### 1.创建路由模块
* 推荐把路由模块抽取为一个单独的 js，然后导出
* 对于模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter) 安装插件

```
import Vue from 'vue'
import VueRouter from 'vue-router'

// 1. 导入组件
import Home from '@/components/Home.vue'
import About from '@/components/About.vue'

// 2、安装插件
Vue.use(VueRouter)

// 3. 定义路由和组件对应关系
const routes = [
  { path: '/', component: Home },
  { path: '/home', component: Home },
  { path: '/about', component: About },
]

// 4. 创建路由实例对象，然后传 routes 配置
const router = new VueRouter({
  routes     
})

export default router
```



#### 2. 单页面应用入口 main.js
```
import Vue from "vue";
import App from "./App.vue";
import router from "@/router/index.js";

// 创建并挂载根实例
new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
```




### 四、Vue3.X + Vue Router 4.X
#### 1.创建路由模块 
* 4.X 的Vue Router 不再是一个类，而是一组函数
* 4.X 创建路由实例对象方式有所改变

```
import Vue from 'vue'
import { createRouter } from 'vue-router'

// 1. 导入组件
// 2. 安装插件
// 3. 定义路由和组件对应关系

// 4. 创建路由实例对象，然后传 routes 配置
const router = VueRouter.createRouter({
  routes,
})

export default router
```



#### 2. 单页面应用入口 main.js
Vue 3.X 和 Vue 2.X 创建根实例方式有所改变

```
import Vue from "vue";
import App from "./App.vue";
import router from "@/router/index.js";

const app = Vue.createApp({})
app.use(router)
app.mount('#app')
```