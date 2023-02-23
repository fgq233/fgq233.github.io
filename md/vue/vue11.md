### Vue 动态组件
### 一、动态组件
```
<template>
  <div id="app" class="box">
    <component :is="comName"></component>

    <button @click="toggleComponent('Left')">切换为Left组件</button>
    <button @click="toggleComponent('Right')">切换为Right组件</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      comName: 'Left'
    }
  },
  methods: {
    toggleComponent(val) {
      this.comName = val;
    }
  }
}
</script>
```

* 给`<component>`组件定义一个`is`属性，该属性是要渲染的组件的名字`name`
* 使用`v-bind`指令动态绑定该属性，当属性值变更时，组件会动态切换


### 二、keep-alive
* 默认情况下，动态组件每次切换组件都是`销毁旧的`组件，`创建新的`组件
* 有时候我们需要缓存组件，不需要每次都重新创建，这样会丢失原来的数据，可以通过`keep-alive`来实现

### 1. 使用
```
<template>
  <div id="app" class="box">
    <keep-alive>
      <component :is="comName"></component>
    </keep-alive>

    <button @click="toggleComponent('Left')">切换为Left组件</button>
    <button @click="toggleComponent('Right')">切换为Right组件</button>
  </div>
</template>
```

直接使用`keep-alive`把动态组件包裹起来，这样就实现了组件的缓存

![](https://fgq233.github.io/imgs/vue/vue4.png)


### 2. 生命周期方法
* `activated()`  组件激活
  * 组件首次创建会执行该方法
  * 当组件从缓存中激活，也会执行该方法
  
* `deactivated()` 组件缓存


#### 3. includes、exclude属性
* `includes` 指定哪个组件需要被缓存，多个以逗号隔开
* `exclude` 指定哪个组件不需要被缓存，多个以逗号隔开
* 注意：这2个属性不要同时使用

```
<keep-alive include="Left,Right">
  <component :is="comName"></component>
</keep-alive>

<keep-alive exclude="Left">
  <component :is="comName"></component>
</keep-alive>
```