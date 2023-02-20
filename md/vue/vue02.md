### Vue 修饰符
### 一、事件修饰符
`Vue` 提供了事件修饰符，来对事件的触发机制进行控制

* `.stop`     替代`stopPropagation()` 阻止事件冒泡
* `.prevent`  替代`preventDefault()`阻止默认行为，如a标签的跳转、表单的提交
* `.capture`  以捕获模式触发当前的事件处理函数
* `.once`     绑定的事件只触发一次
* `.self`     只有在event.target是当前元素自身时，才触发事件处理函数

```
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
```


串联使用修饰符时，顺序很重要
* 用 `v-on:click.prevent.self` 会阻止所有的点击
* 而 `v-on:click.self.prevent` 只会阻止对元素自身的点击



### 二、按键修饰符
* `@keyup` 监听键盘事件是所有的按键事件
* `Vue` 提供了按键修饰符，来监听具体按键事件
  * `.enter`  按下 Enter 键才会触发事件
  * `.esc`  按下 Esc 键才会触发事件
  * `.tab`  按下 Tab 键才会触发事件
  * `.delete `  按下删除或退格键才会触发事件

```
<div id="app">
    <!-- <input @keyup="keyup"> -->
    <input @keyup.enter="enter"  @keyup.esc="esc">
</div>

var app = new Vue({
    el: '#app',
    methods: {
        enter() {
            console.log('按下Enter键');
        },
        esc() {
            console.log('按下Esc键');
        }
    }
})
```
 
 
### 三、鼠标按钮修饰符
限制处理函数仅响应特定的鼠标按钮

* `.left`
* `.right`
* `.middle`



### 四、v-model 指令专用修饰符
* `.number` 自动将用户输入值转为数值类型
* `.trim` 自动去除用户输入的首尾空白字符
* `.lazy` 在用户输入时，不立刻修改数据源`data`，等失去焦点再改变数据源`data`

```
<div id="app">
    <input v-model.number="num1">+
    <input v-model.number="num2">=
        ﹛﹛ num1 + num2 ﹜﹜
    <br>
    <input v-model.trim="name">
    <br>
    <input v-model.lazy="msg">
</div>

var app = new Vue({
    el: '#app',
    data: { num1: 0, num2: 0, name: '', msg: '' }
})
```
  



