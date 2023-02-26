### Vue 组件之间共享数据
### 一、父传子
* 父组件通过子组件的自定义属性来传值
* 结合 `v-bind` 指令可以做到动态传值

#### 1. 子组件 Son
```
<template>
  <p>﹛﹛ msg ﹜﹜</p>
</template>

<script>
export default {
  props: {
    msg
  }
}
</script>
```


#### 2. 父组件 
```
<template>
  <div id="app">
    <Son :msg="valToSon"></Son>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valToSon: 666
    }
  }
}
</script>
```


### 二、子传父
* 方式1：通过 `$emit()` 自定义事件获取
* 方式2：通过给子组件定义`ref属性`，然后拿到子组件引用，从而获取子组件的数据

#### 1. 父组件 
```
<template>
  <div id="app">
    <Son @son-event="getValBySon"></Son>
  </div>
</template>

<script>

export default {
  methods: {
    getValBySon(event) {  // 第一个参数即 $emit 抛出的值
      console.log(event)
    }
  }
}
</script>
```


#### 2. 子组件 
```
<template>
  <div>
    <button @click="send">向父组件传值</button>
  </div>
</template>

<script>
export default {
  methods: {
    send() {
      this.$emit('son-event', 666);
    }
  }
}
</script>
```


### 三、兄弟组件之间互相传递
通过 `EventBus` 来传递
#### 1. 结构
组件`Left`向组件`Right`传值

```
<template>
  <div id="app" class="box">
    <Left></Left>
    <Right></Right>
  </div>
</template>
```

#### 2. EventBus
创建`EventBus.js`，向外共享一个`vue`实例对象

```
import Vue from 'vue';

export default new Vue();
```


#### 3. 发送方：组件Left
调用 `bus.$emit(事件名称, 值)` 触发一个事件，并传出一个值

```
<template>
  <div>
    <button @click="send">向兄弟组件 Right 传值</button>
  </div>
</template>
<script>

import bus from './eventBus.js'

export default {
  methods: {
    send() {
      bus.$emit('share-event', 666);
    }
  }
}
</script>
```



#### 4. 接收方：组件Right
* 在生命周期 `created()` 方法 调用 `bus.$on(事件名称, 回调函数)` 监听事件
* 当事件触发时，该回调函数就会调用，形参为传递过来的值

```

<script>
import bus from './eventBus.js'

export default {
  created() {
    bus.$on('share-event', (val) => {
      console.log(val);;
    })
  }
}
</script>
```
