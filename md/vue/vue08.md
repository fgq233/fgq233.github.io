### Vue 自定义事件
### 一、自定义事件的触发、监听
* 父级组件可以像处理 `native DOM `事件一样通过 `v-on` 监听子组件实例的任意事件
* 子组件可以通过调用内置的的 `$emit()`方法并传入事件名称来触发一个事件

#### 1. 子组件
```
<template>
  <div>
    <button @click="send">触发事件</button>
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

#### 2. 父组件
```
<template>
  <div id="app">
    <Son @son-event="doSomeThing"></Son>
  </div>
</template>

<script>

export default {
  methods: {
    doSomeThing(event) {  // 第一个参数即 $emit 抛出的值
      console.log(event)
    }
  }
}
</script>
```

#### 3. 使用事件抛出一个值
* `$emit()` 方法可以接收2个参数，可以使用第二个参数来抛出一个值
* 父级组件监听这个事件的时候，可以通过 `$event` 访问到被抛出的这个值





### 二、自定义事件与 v-model 
自定义事件也可以用于创建支持 v-model 的自定义输入组件

#### 1.  v-model 本质
一个组件上的 `v-model` 默认会利用名为 **value** 的属性和名为 **input** 的事件
* `text、textarea` 元素使用 value 属性 和 input 事件
* `checkbox、radio` 元素使用 checked 属性 和 change 事件
* `select` 元素使用 value 属性 和 input 事件

```
<input v-model="txt">
等价于
<input v-bind:value="txt" v-on:input="txt = $event.target.value">
```


#### 2. 在自定义组件上使用 v-model
如下是一个自定义组件 `<custom-input>`，直接在上面使用 `v-model`是无效的，因为其本身没有属性和事件

```
<template>
  <div>
    <p>自定义的输入框</p>
    <input>
  </div>
</template>
```

#### 3. model选项
`model`选项可以手动指定`v-model`要利用到的`prop、event`
* ① 使用`model`选项声明`v-model`要利用的`prop、event`
* ② 在组件的`props`属性里定义`model`选项中声明的`prop`，并将其绑定到对应属性上
* ③ 在其`input`事件被触发时，将新的值通过`$emit()`自定义事件抛出

```
<template>
  <div class="right-container">
    <p>自定义的输入框</p>
    <input :value="val" @input="$emit('my-event', $event.target.value)">
  </div>
</template>

<script>

export default {
  model: {
    prop: 'txt',
    event: 'my-event'
  },
  props: ['txt']
}
</script>
```


现在在这个自定义组件上使用`v-model`就正常了： `<custom-input v-model="xxx"></custom-input>`




### 三、将原生事件绑定到组件




### 四、.sync 修饰符








