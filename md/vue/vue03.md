### Vue 过滤器、计算属性、侦听器
### 一、过滤器
* Vue.js 允许自定义过滤器，常用于文本格式化  
* 过滤器可以用在两个地方：`插值表达式`和 `v-bind `指令 
* 过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符号 `|` 调用
* 注意：`Vue3` 中已经删除了过滤器 API，推荐使用`计算属性`

#### 1. 使用
```
<div id="app">
    <p :title="msg | capitalize">﹛﹛msg﹜﹜</p>
    <p>﹛﹛msg | capitalize2﹜﹜</p>
</div>

// 全局过滤器
Vue.filter('capitalize2', function (value) {
    if (!value) {
        return ''
    }
    value = value.toString();
    return value.toUpperCase();
});

var app = new Vue({
    el: '#app',
    data: {
        msg: 'vue',
    },
    filters: {      // 局部过滤器
        capitalize: function (value) {
            if (!value) {
                return ''
            }
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
})
```

* 过滤器本质就是一个JS函数
  * 局部过滤器：在Vue构造方法中通过 `filters` 节点定义，只能当前Vue实例使用
  * 全局过滤器：通过 `Vue.filter` 定义，所有Vue实例都可以使用
  
* 过滤器函数一定要有返回值

* 过滤器函数的第一个形参永远是管道符 `|` 前面的值

* 如果全局过滤器、局部过滤器的函数名一致，按照“**就近原则**”，调用的是局部过滤器


#### 2. 过滤器传参、过滤器链
```
<p>﹛﹛msg | fun(666)﹜﹜</p>

<p>﹛﹛msg | fun1 | fun2﹜﹜</p>
```

* 过滤器函数的形参列表中，从第二个参数开始，才是传递的参数
* 多个过滤器可以串联使用，如上，将 fun1 处理过的结果再交给 fun2 处理





### 二、计算属性
* 定义：在`computed` 节点下定义方法进行计算，最终得到一个属性值
  * 该属性值会成为 Vue 实例的属性
  * 方法名就是属性名
* 使用：计算属性可以在模板结构、`methods`方法中使用

#### 1. 使用
```
<div id="app">
    <p>﹛﹛ msg ﹜﹜</p>
    <p>﹛﹛ reversedMsg ﹜﹜</p>
</div>
    
var app = new Vue({
    el: '#app',
    data: {msg: 'vue'},
    computed: {
        reversedMsg: function () { 
            return this.message.split('').reverse().join('')
        }
    }
})
```

#### 2. 计算属性 VS 方法
```
<p>﹛﹛ reversedMsg() ﹜﹜</p>

var app = new Vue({
    el: '#app',
    data: {msg: 'vue'},
    methods: {
        reversedMsg(){
            return this.msg.split('').reverse().join('')
        }
    }
})
```

* 相同：可以将同一函数定义为一个方法，两种方式的最终结果是完全相同的
* 区别
    * 计算属性是基于响应式依赖进行缓存的，只在依赖发生改变时它们才会重新求值，所以多次访问计算属性会
立即返回之前的计算结果，而不会再次执行函数体
    * 方法不一样，每次调用都会执行函数体
* 注意：计算属性名、methods 下方法名不能有同名的

#### 3. 计算属性的 setter
```
computed: {
    reversedMsg: {
        get: function () {
            return this.msg.split('').reverse().join('')
        },
        set: function (newValue) {
            this.msg = newValue.toUpperCase()
        }
    }
}
```

计算属性默认只有 `getter`，不过在也可以提供一个 `setter`
* `app.reversedMsg` 调用getter
* `app.reversedMsg = 'xxx'` 调用setter






### 三、侦听器
* 通过 `watch` 节点来监听数据的变化
* 当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的

#### 1. 使用
```
<div id="app">
    <input v-model="msg">
    <input v-model="msg2">
    <input v-model="info.name">
</div>
    
var app = new Vue({
    el: '#app',
    data: {
        msg: 'vue',
        msg2: 'js',
        info: { name: 'fgq' }
    },
    watch: {
        // 方法格式侦听器
        msg: function (newVal, oldVal) {
            console.log(newVal, oldVal);
        },
        // 对象格式侦听器
        msg2: {
            handler(newVal, oldVal) {
                console.log(newVal, oldVal);
            },
            immediate: true 
        },
        info: {
            handler(newVal, oldVal) {
                console.log(newVal, oldVal);
            },
            deep: true
        }
    },
})
```

* 当数据发生变化，侦听器中方法就会调用，其中 newVal 为变化后的值， oldVal 为变化前的值

* 方法格式侦听器、对象格式侦听器区别在于后者可以定义 `immediate、deep`选项
    * `immediate`，控制侦听器主动触发一次回调
    * `deep`，在监听的属性是对象时，对象中属性发生变化不会触发侦听器，因为引用地址没有变化，
    可以通过该属性深度监听对象中每一个属性，从而触发侦听器
    

#### 2. 通过 Vue 实例定义侦听器
`vm.$watch( expOrFn, callback, [options] )`

* `expOrFn` 要监听的属性
* `callback` 触发的回调函数
* `options` 可选项

```
 var unwatch = app.$watch('info', function (newVal, oldVal) {
     console.log(newVal, oldVal);
 }, {
     immediate: true,
     deep: true
 });
 unwatch();
```

使用 Vue 实例也可以定义侦听器，该 API 会返回一个取消观察函数，用来停止侦听
 