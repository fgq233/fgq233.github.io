### Vue 指令
### 一、内容渲染指令
用来渲染 DOM 元素的文本内容
* `v-text` 会覆盖默认文本内容
* `{` `{` `}` `}` 插值表达式，解决覆盖默认文本内容问题，只能用在内容节点，不能用在属性节点
* `v-html` 把包含`html`标签的字符串渲染为页面的`html`元素


```html
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

```html
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
* `v-model`指令一般用于获取表单元素数据
  * `text` 和 `textarea` 元素使用 value property 和 input 事件
  * `checkbox` 和 `radio` 使用 checked property 和 change 事件
  * `select` 字段将 value 作为 prop 并将 change 作为事件
* Vue 数据源 data 变化，会重新渲染页面，页面数据变化，又会修改 Vue 数据源

```
<div id="app">
    <p>请输入内容：﹛﹛ msg ﹜﹜</p>
    <input v-model="msg">
    
    <!-- 单行文本 -->
    <p>请输入内容：﹛﹛ msg ﹜﹜</p>
    <input v-model="msg">

    <!-- 多行文本 -->
    <textarea v-model="msg"></textarea>

    <!-- 选择框 -->
    <select v-model="city">
        <option disabled value="">请选择</option>
        <option value="1">上海</option>
        <option value="2">北京</option>
        <option value="3">深圳</option>
    </select>
    <span>﹛﹛ city ﹜﹜</span>

    <!-- 选择框(多选) -->
    <select v-model="citys" multiple>
        <option disabled value="">请选择</option>
        <option value="1">上海</option>
        <option value="2">北京</option>
        <option value="3">深圳</option>
    </select>
    <span>﹛﹛ citys ﹜﹜</span>


    <!-- 单个复选框，绑定布尔值 -->
    <input type="checkbox" id="checkbox" v-model="checked"><label for="checkbox">﹛﹛ checked ﹜﹜</label>

    <!-- 多个复选框，绑定到同一个数组 -->
    <input type="checkbox" id="c1" value="1" v-model="checkedIds"><label for="c1">A</label>
    <input type="checkbox" id="c2" value="2" v-model="checkedIds"><label for="c2">B</label>
    <input type="checkbox" id="c3" value="3" v-model="checkedIds"><label for="c3">C</label>
    <span> ﹛﹛ checkedIds ﹜﹜</span>

    <!-- 单选按钮 -->
    <input type="radio" id="r1" value="One" v-model="picked"><label for="r1">One</label>
    <input type="radio" id="r1" value="Two" v-model="picked"><label for="r2">Two</label>
    <span> ﹛﹛ picked ﹜﹜</span>
</div>

var app = new Vue({
    el: '#app',
    data: { msg: '', city: '', citys: [], checked: false, checkedIds: [], picked: '' },
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
基于一个数组来渲染一个列表，需要使用 `item in items` 或 `item of items`形式的语法
* `items` 是待循环的数组，`item` 是当前数组项
* 扩展形式
  * `(item, index) in items`        数组使用，括号内分别为：`当前项、索引`
  * `(value, key, index) in obj`    对象使用，括号内分别为：`值、键、索引`
* 优化：官方推荐在使用到循环指令时，绑定一个 `key` 属性，防止列表状态紊乱
 
#### 1. 循环数组
```
<div id="app">
  <ul>
    <li v-for="todo in todos">﹛﹛ todo.text ﹜﹜</li>
  </ul>
  
  <ul>
    <li v-for="(todo, idx) in todos" :key="todo.id" :attr="'li' + idx" :title="todo.text">
      ﹛﹛ todo.text ﹜﹜
    </li>
  </ul>
</div>

var app = new Vue({
  el: "#app",
  data: {
    todos: [
      { id: 1, text: "学习 JavaScript" },
      { id: 2, text: "学习 Vue" },
      { id: 3, text: "整个牛项目" },
    ]
  }
})
```

#### 2. 循环对象
```
<div id="app">
  <ul>
    <li v-for="val in obj">﹛﹛ val ﹜﹜</li>
  </ul>
  <ul>
    <li v-for="(val, key) in obj">﹛﹛ key ﹜﹜ : ﹛﹛ val ﹜﹜</li>
  </ul>
  <ul>
    <li v-for="(val, key, index) in obj">﹛﹛ index ﹜﹜ 、 ﹛﹛ key ﹜﹜ : ﹛﹛ val ﹜﹜</li>
  </ul>
</div>

var app = new Vue({
  el: "#app",
  data: {obj: { name: "fgq" , time: "2022" , age: "18" }}
})
```

#### 3. 循环整数
```
<div>
  <span v-for="n in 10">﹛﹛ n ﹜﹜ </span>
</div>
```


#### 4. 循环模板
```
<ul>
  <template v-for="item in items">
    <li>﹛﹛ item.msg ﹜﹜</li>
  </template>
</ul>
```


#### 5. v-for 与 v-if 一同使用
* 当处于同一节点，`v-for` 的优先级比 `v-if` 更高
* 不处于同一节点，根据先后顺序

```
<!-- 只为部分数据项渲染节点 -->
<li v-for="todo in todos" v-if="!todo.isComplete">
  ﹛﹛ todo ﹜﹜
</li>

<!-- 有条件地跳过循环的执行 -->
<ul v-if="todos.length">
  <li v-for="todo in todos">
    ﹛﹛ todo ﹜﹜
  </li>
</ul>
<p v-else>无数据!</p>
```


#### 七. 动态参数
#### 1. 使用
从 `2.6.0` 开始，可以用方括号括起来的 JavaScript 表达式作为一个指令的参数

```
<div id="app">
    <p :[attr]="msg">
        属性绑定中的动态参数
    </p>
     <button @[eventname]="getCurTime">事件绑定中的动态参数</button>
</div>

var app = new Vue({
    el: '#app',
    data: {
        attr: 'title',
        msg: new Date().toLocaleString(),
        eventname: 'click'
    },
    methods: {      
        getCurTime: function (events) {
            this.msg = new Date().toLocaleString();
        }
    }
})
```
 
#### 2. 对动态参数的值的约束
* 动态参数预期会求出一个字符串，异常情况下值为 null，这个特殊的 null 值可以被显性地用于移除绑定。
* 任何其它非字符串类型的值都将会触发一个警告


#### 3. 对动态参数表达式的约束
* 动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 里是无效的
* 解决的办法是使用没有空格或引号的表达式，或用计算属性替代这种复杂表达式

```
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```