### Vue 自定义指令
自定义指令分为 2 类
* 私有自定义指令：定义在组件内部，仅能在组件内使用
* 全局自定义指令：定义在vue实例上，全局可用

### 一、私有自定义指令
### 1. 声明、使用
在 vue 组件中，可以在 directives 节点下声明私有自定义指令

```
<template>
  <div>
    <p v-bg>666</p>
    <p v-bg="'red'">666</p>
    <p v-bg="color">666</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: 'green'
    }
  },
  directives: {
    bg: {
      bind(el, binding) {
        console.log(binding);
        el.style.backgroundColor = binding.value;
      },
      update(el, binding) {
        console.log(binding);
        el.style.backgroundColor = binding.value;
      }
    }
  }
}
</script>
```

* 指令名: bg，通过 v-bg 指令使用
* `Vue2.x` 版本
  * `bind()` 当指令第一次绑定到元素上，触发该方法
  * `update()` 每次DOM更新时，触发该方法
* `Vue3.x` 版本
  * `mouted()`  功能同 `bind()`
  * `updated()`  功能同 `update()`
* 形参 `el`，当前指令锁绑定到的 DOM 对象
* 形参 `binding`，绑定内容，可以通过 `binding.value` 拿到传过来的值

![](https://fgq233.github.io/imgs/vue/vue5.png)


#### 2. 简写
如果 `bind()` 和 `update()` 逻辑一致，则可以简写成函数格式

```
  directives: {
    bg(el, binding) {
      console.log(binding);
      el.style.backgroundColor = binding.value;
    }
  }
```


### 二、全局自定义指令
通过 `Vue.directive() `来声明

```
Vue.directive("bg", { 
  bind(el) {
    
  },
  update(el) {
   
  }
});


Vue.directive("bg", function (el) {
  
});
```