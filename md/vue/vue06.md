### Vue 组件基础
### 一、 组件的定义
* 组件是可复用的 Vue 实例，与 new Vue 接收相同的选项，如 `data、computed、watch、methods` 以及`生命周期钩子`等
* 仅有的例外是 el， 这个是 Vue 实例特有的选项

#### 1. Vue.component定义
```
Vue.component('Counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me ﹛﹛ count ﹜﹜ times.</button>'
})
```
 
`Vue.component()` 接收2个参数，一个是组件名字，一个是组件的配置


#### 2. 单文件组件
* vue 是一个支持组件化开发的前端框架，可以通过新增 .`vue `文件的形式来定义一个组件 
* 每个`.vue` 组件由3部分构成
  * `template`：组件的模板结构
  * `script`：组件的 Javascript 行为，组件的`data、computed、watch、methods` 以及`生命周期钩子`就定义在其中
  * `style`：组件的样式

```
<template>
  <div class="container">
    <p> ﹛﹛ count ﹜﹜</p>
    <button @click="count++">+1</button>
  </div>
</template>

<script>
export default {
  name: 'Counter',   // 组件名字
  props: {},         // 组件的属性
  data() {           // 数据源
    return {    
      count: 0
    }
  },
  methods: {},      // 方法
  watch: {},        // 侦听器
  computed: {},     // 计算属性
  filters: {},      // 过滤器
  components: {}    // 注册的私有组件
}
</script>

<style lang="less" scoped>
.container {
  background-color: yellow
}
</style>
```


#### 3. 组件定义中注意事项
* `template`中，必须只有一个根元素
* `script` 中，数据源 `data` 必须是一个函数，不能是一个对象
* `style` 中，在单页面应用中，可以通过 `scoped` 来防止组件之间样式冲突



### 二、 组件的注册、使用
#### 1. 全局组件
通过 Vue.component 注册的组件，就是全局组件

```
// 导入单文件组件
import Counter from "./components/Counter.vue";
// 全局注册
Vue.component("Counter", Counter);
```


#### 2. 私有组件
* 在一个组件中，在`components`节点下注册的组件就是局部组件
  * 先 `import` 导入组件
  * 再在 `components` 节点下注册
* 私有组件只能在当前组件内使用

```
<script>
import Counter from '@/components/Counter.vue'

export default {
  name: 'App',
  components: {
    Counter: Counter
  }
}
</script>
```

#### 3. 组件的使用
在 `template` 中，以标签的形式使用组件

```
<template>
  <div id="app">
    <Counter></Counter>
  </div>
</template>
```


### 三、 组件的属性 props
#### 1. 自定义属性
* `props` 节点中定义的是组件的自定义属性，如下定义了一个 title 属性
* 属性中可以声明默认值 `default`、属性值的类型 `type`、必填项校验 `required`

```
export default {
  name: 'Counter',
  props: {
    title: {
      default: 0,
      type: String,
      required: true
    }
  }
}
```


#### 2. 通过 Prop 向子组件传递数据
```
<Counter title="标题"></Counter>
```

#### 3. 结合 v-bind指令 来动态传递 prop
```
<template>
  <div id="app">
    <Counter :title="counterTitle"></Counter>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counterTitle: '动态的标题'
    }
  }
}
</script>
```