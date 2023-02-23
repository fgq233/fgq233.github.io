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
#### 1. 全局注册
通过 Vue.component 注册的组件，就是全局组件

```
// 导入单文件组件
import Counter from "./components/Counter.vue";
// 全局注册
Vue.component("Counter", Counter);
```


#### 2. 局部注册
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

#### 3. 自动化全局注册
* 对于一些通用组件，如果用到的地方很多，每个都全局注册一次太过于麻烦
* 在`webpack`工程化项目中，可以使用 `require.context` 在入口文件(`src/main.js`)全局注册这些通用的基础组件

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  './components',                // 组件目录的相对路径
  false,                         // 是否查询其子目录
  /Base[A-Z]\w+\.(vue|js)$/     // 匹配基础组件文件名的正则表达式
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 .default,否则回退到使用模块的根
    componentConfig.default || componentConfig
  )
})
```


#### 4. 组件的使用
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


#### 2. 通过 prop 向组件传递数据
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

#### 4. 注意事项
* 不要修改组件的 prop，不过可以将其赋给data数据源、或计算属性computed
```
props: ['initTitle'],
data: function () {
  return {
    title: this.initTitle
  }
},
computed: {
  lowerTitle: function () {
    return this.initTitle.trim().toLowerCase()
  }
}
```

* 一个非`prop`的`attribute`传向组件，但是该组件并没有相应`prop`，那么这些`attribute`会被添加到这个组件的**根元素**上

* 对于绝大多数`attribute`，从外部提供给组件的值会**替换**掉组件内部设置好的值，但是`class`和`style`会智能一些，
两边的值会被**合并**起来
