### Vue 指令
### 一、内容渲染指令
用来渲染 DOM 元素的文本内容
* `v-text` 会覆盖默认文本内容
* `{{` `}}` 插值表达式，解决覆盖默认文本内容问题，只能用在内容节点，不能用在属性节点
* `v-html` 把包含`html`标签的字符串渲染为页面的`html`元素


```
<div id="app">
    <p v-text="name"></p>
    <p>性别：﹛﹛sex﹜﹜</p>
    <p v-html="info"></p>
</div>

var app = new Vue({
    el: '#app',    
    data: {        
        name: 'fgq',
        sex: '男',
        info: '<h1>范老师666</h1>',
    }
})
```


### 二、属性绑定指令 v-bind
`v-bind`指令为元素属性动态绑定值，可简写为 `:`

```
<div id="app">
    <p :title="msg">简写</p>
    <p v-bind:title="msg">属性绑定指令</p>
    <p v-bind:title="'现在时间是' + msg2">表达式</p>
</div>

var app = new Vue({
    el: '#app',
    data: {
        msg: "现在时间是" + new Date().toLocaleString(),
        msg2: new Date().toLocaleString()
    }
})
```


### 三、事件绑定指令 v-on
#### 1. 用法
* `v-on`指令为元素绑定事件监听，可简写为 `@`
* 使用 `methods` 定义事件处理函数，函数中可通过`this`访问数据源中的数据
* 原生DOM对象的事件，替换为Vue绑定形式，写法需要`去掉on`
  * `onclick` 对应 `v-on:click`
  * `oninput` 对应 `v-on:input`
  * `onkeyup` 对应 `v-on:keyup`

```
<div id="app">
    <p>﹛﹛ count ﹜﹜</p>
    <button v-on:click="add">+1</button>
    <button v-on:click="add2(2)">+2</button>
    <button @click="sub">-1</button>
</div>

var app = new Vue({
    el: '#app',
    data: { count: 0 },
    methods: {      
        add: function () {
            this.count += 1;
        },
        add2(num) {   // 传参
            this.count += num;
        },
        sub() {      // 函数简写方式
            this.count -= 1;
        }
    }
})
```

#### 2. 事件对象
原生DOM事件对象 `event` 在Vue中
* 若没有传参，那么第一个参数默认就是 `event`
* 若需要传参，则可以通过Vue内置变量 `$event` 来传递事件对象

```
<div id="app">
    <p>﹛﹛ count ﹜﹜</p>
    <button v-on:click="add">+1</button>
    <button v-on:click="add2(2, $event)">+2</button>
</div>

var app = new Vue({
    el: '#app',
    data: { count: 0 },
    methods: {     
        add (events) {
            events.target.style.backgroundColor = this.count % 2 == 0 ? 'pink' : 'white';
        },
        add2(num, events) {    
            this.count += num;
            events.target.style.backgroundColor = this.count % 2 == 0 ? 'yellow' : 'blue';
        }
    }
})
```


### 四、双向数据绑定指令 v-model
`v-model`指令一般用于获取表单元素数据（`input、textarea、select`）
* Vue 数据源 data 变化，会重新渲染页面
* 页面数据变化，会修改 Vue 数据源 data 数据

```
<div id="app">
    <p>请输入内容：﹛﹛ msg ﹜﹜</p>
    <input v-model="msg">

    <select v-model="city">
        <option value="1">上海</option>
        <option value="2">北京</option>
        <option value="3">深圳</option>
    </select>
</div>

var app = new Vue({
    el: '#app',
    data: {msg: '',city: ''}
})
```



### 五、条件渲染指令
#### 1. 用法
控制 DOM 元素的显示与隐藏
* `v-if` 是通过新增元素、删除元素来显隐
* `v-show` 是通过 display: none 来控制元素显隐

```
<div id="app">
    <p v-if="seen1">现在你看到我了1</p>
    <p v-show="seen2">现在你看到我了2</p>
</div>

var app = new Vue({
    el: '#app',
    data: {seen1: true, seen2: true}
})
```

#### 2. v-if 配套指令
* `v-else-if`
* `v-else`

```
<div id="app">
    <p v-if="score === 100">S</p>
    <p v-else-if="score >= 90">A</p>
    <p v-else-if="score >= 80">B</p>
    <p v-else>X</p>
</div>

var app = new Vue({
    el: '#app',
    data: {score: 100}
})
```


### 六、循环渲染指令 v-for
* `v-for` 指令基于一个数组来渲染列表结构，需要使用 `item in items` 形式的语法
  * `items` 是待循环的数组
  * `item` 是当前数组项
* 如果要使用到当前项索引，可以使用 `(item, index) in items` 形式
* 优化：官方推荐在使用到循环指令时，绑定一个 `key` 属性，防止列表状态紊乱
  * 值为字符串或数字类型
  * 值要唯一，推荐使用业务数据id
  * 不要使用索引index，因为数组长度若变更的话，这个值不具有唯一性



```
<div id="app">
  <ol>
    <li v-for="todo in todos" :key="todo.id">﹛﹛ todo.text ﹜﹜</li>
  </ol>

  <table>
    <thead>
      <th>序号</th>
      <th>姓名</th>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in girls" :id="'tr-' + idx" :title="item.name">
        <td>﹛﹛ idx + 1 ﹜﹜</td>
        <td>﹛﹛ item.name ﹜﹜</td>
      </tr>
    </tbody>
  </table>
</div>

var app = new Vue({
  el: "#app",
  data: {
    todos: [
      { id: 1, text: "学习 JavaScript" },
      { id: 2, text: "学习 Vue" },
      { id: 3, text: "整个牛项目" },
    ],
    girls: [{ name: "小龙女" }, { name: "黄蓉" }, { name: "赵敏" }],
  }
})
```

 