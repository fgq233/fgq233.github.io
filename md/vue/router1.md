### Vue 前端路由原理
 
### 一、工作原理
* ① 用户点击页面上的`路由链接`
* ② URL地址栏的`Hash值`发生变化
* ③ 前端路由`监听`到Hash地址的变化
* ④ 通过`动态组件`，前端路由把当前 Hash 地址对应的组件渲染到浏览器中


### 二、模拟前端路由
```
<template>
  <div>
    <a href="#/home">首页</a>
    <a href="#/info">资讯</a>
    <a href="#/mine">我的</a>
    
    <component :is="comName"></component>
  </div>
</template>

<script>
import Home from '@/components/Home.vue'
import Info from '@/components/Info.vue'
import Mine from '@/components/Mine.vue'

export default {
  name: 'App',
  data() {
    return {
      comName: 'Home'
    }
  },
  created() {
    window.onhashchange = () => {
      console.log('监听到了 hash 地址的变化', location.hash)
      switch (location.hash) {
        case '#/home':
          this.comName = 'Home'
          break
        case '#/info':
          this.comName = 'Info'
          break
        case '#/mine':
          this.comName = 'Mine'
          break
      }
    }
  },
  components: {
    Home,
    Movie,
    About
  }
}
</script>
```

* 当前的 App 组件一被创建，就立即监听 `window` 对象的 `onhashchange` 事件
* 点击a标签，URL地址栏的`Hash值`发生变化，替换动态组件中的组件

