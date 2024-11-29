### vm.$data、vm.$options

### 一、定义
### 1. vm.$data
* 类型：Object
* Vue 实例观察的数据对象，表示当前 data 内的数据

```js
// 获取当前状态下的data
this.$data 
```

### 2. vm.$options
* 类型：Object，只读
* 当前 Vue 实例的初始化选项

```js
// 获取初始化 data 数据的两种方式
this.$options.data.call(this);  // 【推荐】需要传入当前 this, 不然可能会指向全局 vue 对象
this.$options.data();           // 【不推荐】data数据中有用this的写法就会报错，因为data()内部的this指向不对
```

### 二、重置数据
#### 1、data 数据全部重置
```js
Object.assign(this.$data, this.$options.data.call(this))  // 推荐

Object.assign(this.$data, this.$options.data())
```

#### 2、重置 data 部分数据
```js
this.form = this.$options.data.call(this).form           // 推荐

this.form = this.$options.data().form
```
