### JS 函数定义
* 函数实际上是对象，每个函数都是 Function 类型的实例
* 因为函数是对象，所以函数名就是指向函数对象的指针

### 一、函数定义
#### 1. 函数定义
```js
// 函数式声明
function sum (num1, num2) {
    return num1 + num2;
}
// 函数表达式
let sum = function(num1, num2) {
    return num1 + num2;
};
// 函数表达式：箭头函数(ES6)
let sum = (num1, num2) => {
    return num1 + num2;
};
// 函数表达式：构造函数（不推荐）
let sum = new Function("num1", "num2", "return num1 + num2"); 
```

#### 2.注意事项
* JavaScript 引擎在任何代码执行之前，会先读取**函数声明**，并在执行上下文中生成函数定义
* 函数表达式必须等到代码执行到它那一行，才会在执行上下文中生成函数定义

```js
// 正常执行
console.log(sum(10, 10));
function sum(num1, num2) {
    return num1 + num2;
}

// 报错
console.log(sum(10, 10));
let sum = function(num1, num2) {
    return num1 + num2;
}
```


### 二、、函数中的 this
#### 1. 标准函数中
在**标准函数**中，this 引用的是把函数当成方法调用的上下文对象

```js
window.color = 'red';
let o = {
    color: 'blue'
};
function sayColor() {
    console.log(this.color);
}
sayColor();     // 'red'
o.sayColor = sayColor;
o.sayColor();   // 'blue'
```
注意：函数名只是保存指针的变量，因此全局定义的 sayColor()函数和 o.sayColor()是同一个函数，
只不过执行的上下文不同

#### 2. 箭头函数中
在**箭头函数**中，this 引用的是定义箭头函数的上下文

```js
window.color = 'red';
let o = {
    color: 'blue'
};
let sayColor = () => console.log(this.color);
sayColor();     // 'red'
o.sayColor = sayColor;
o.sayColor();   // 'red'
```

