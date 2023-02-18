### Vue 修饰符
### 一、事件修饰符
`Vue` 提供了事件修饰符，来对事件的触发机制进行控制

* `.prevent`  替代`preventDefault()`阻止默认行为，如a标签的跳转、表单的提交
* `.stop`     替代`stopPropagation()` 阻止事件冒泡
* `.capture`   以捕获模式触发当前的事件处理函数
* `.once`   绑定的事件只触发一次
* `.self`   只有在event.target是当前元素自身时，才触发事件处理函数

```
<div id="app">
    <a href="https://cn.vuejs.org" @click="goVue">vuejs</a>
    <a href="https://cn.vuejs.org" @click.prevent="goVue2">vuejs</a>
</div>


var app = new Vue({
    el: '#app',
    methods: {      
        goVue  (events) {
            events.preventDefault();
            console.log('旧的写法');
        },
        goVue2 () {
            console.log('新的写法');
        }
    }
});
```



### 二、按键修饰符
* `@keyup` 监听键盘事件是所有的按键事件
* `Vue` 提供了按键修饰符，来监听具体键盘相关的事件
  * `.enter`  按下 Enter 键才会触发事件
  * `.esc`  按下 Esc 键才会触发事件

```
<div id="app">
    <!-- <input @keyup="keyup"> -->
    <input @keyup.enter="enter" 
           @keyup.esc="esc" 
           @keyup.f="f" @keyup.g="g" @keyup.q="q">
</div>

var app = new Vue({
    el: '#app',
    methods: {
        enter() {
            console.log('按下Enter键');
        },
        esc() {
            console.log('按下Esc键');
        },
        f() {
            console.log('按下f键');
        },
        g() {
            console.log('按下g键');
        },
        q() {
            console.log('按下q键');
        }
    }
})
```
 
 
 

### 三、v-model 专用修饰符
* `.number` 自动将用户输入值转为数值类型
* `.trim` 自动去除用户输入的首尾空白字符
* `.lazy` 在用户输入时，不立刻修改数据源`data`，等失去焦点再改变数据源`data`

```
<div id="app">
    <input v-model.number="num1">+
    <input v-model.number="num2">=
    {{num1 + num2}}
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