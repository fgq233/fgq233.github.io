### Vue 使用ref引用DOM元素

### 一、$refs 对象
#### 1. $refs 对象
* `ref` 辅助开发者在不依赖于 jQuery 的情况下，获取`DOM元素`或`组件`的引用
* 每个 `vue` 组件实例上，都包含一个 `$refs` 对象，存储着对应 DOM 元素或组件的引用（`默认是一个空对象`）

![](https://fgq233.github.io/imgs/vue/vue2.png)


#### 2. ref使用
```
<template>
  <div id="app">
    <Son ref="sonRef"></Son>
    <input ref="inputRef">
    <button @click="refTest"></button>
  </div>
</template>

<script>

export default {
  methods: {
    refTest() {
      console.log(this);
      console.log(this.$refs.sonRef.sonVal);
      console.log(this.$refs.inputRef);
    }
  }
}
</script>
```

此时 
![](https://fgq233.github.io/imgs/vue/vue3.png)