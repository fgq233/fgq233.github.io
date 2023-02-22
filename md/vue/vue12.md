### Vue 自定义指令
自定义指令分为 2 类
* 私有自定义指令：定义在组件内部，仅能在组件内使用
* 全局自定义指令：定义在vue实例上，全局可用

### 一、私有自定义指令
在 vue 组件中，可以在 directiives 节点下声明私有自定义指令

### 1. 声明私有自定义指令
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
        if (binding.value) {
          el.style.backgroundColor = binding.value;
        } else {
          el.style.backgroundColor = 'yellow';
        }
      }
    }
  }
}
</script>
```

* 指令名: bg，通过 v-bg 指令使用
* `bind` 方法，当指令第一次绑定到元素上，触发 `bind` 方法
  * 形参 `el`，表示当前指令锁绑定到的 DOM 对象
  * 形参 `binding`，使用指令时绑定的值

![](https://fgq233.github.io/imgs/vue/vue5.png)


### 2. 使用自定义指令
`<p v-bg>666</p>`