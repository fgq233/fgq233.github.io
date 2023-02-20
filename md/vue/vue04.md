### Class 与 Style 属性绑定
* 在将 `v-bind` 用于 `class` 和 `style` 时，Vue 做了专门的增强
* 表达式结果的类型除了字符串之外，还可以是对象或数组

### 一、Class 绑定
#### 1. 对象语法1
样式类绑定对象属性值

```
 <!-- 单个 -->
<div v-bind:class="{ cls1: v1 }"></div>

 <!-- 多个 -->
<div v-bind:class="{ cls1: v1, cls2: v2 }"></div>

 <!-- 可以与普通的 class 共存 -->
<div class="static" v-bind:class="{ cls1: v1, 'cls3': v3 }"></div>

// 数据
data: {
  v1: true,
  v2: true,
  v1: false
}

// 渲染结果
<div class="cls1"></div>
<div class="cls1 cls2"></div>
<div class="static cls1 cls2"></div>
```

#### 2. 对象语法2
直接绑定对象数据

```
<div v-bind:class="classObject"></div>

data: {
  classObject: {
    cls1: true,
    cls2: true,
    'cls3': false
  }
}
```

#### 3. 对象语法3
绑定一个返回对象的计算属性

```
<div v-bind:class="classObject"></div>

data: {
  v1: true,
  v2: true
},
computed: {
  classObject: function () {
    return {
      cls1: this.v1 && this.v2,
      'cls2': this.v2
    }
  }
}
```


#### 4. 数组语法1
可以把一个数组传给 `v-bind:class`

```
<div v-bind:class="[v1, v2]"></div>

// 数据
data: {
  v1: 'cls1',
  v2: 'cls2'
}

// 渲染结果
<div class="cls1 cls2"></div>
```

#### 5. 数组语法2
如果想根据条件切换列表中的 class，可以用三元表达式

```
<!-- 三元表达式 -->
<div v-bind:class="[v1 ? cls1 : '', cls2]"></div>

<!-- 数组中使用对象语法 -->
<div v-bind:class="[{ cls1: v1 }, cls2]"></div>
```




### 二、Style 绑定
#### 1. 对象语法1
```
<div v-bind:style="{ color: v1, fontSize: v2 + 'px' }"></div>

data: {
  v1: 'red',
  v2: 30
}
```

#### 2. 对象语法2
```
<div v-bind:style="styleObject"></div>

data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```


#### 3. 对象语法3
```
<div v-bind:style="classObject"></div>

data: {
  v1: true,
  v2: 18
},
computed: {
  classObject: function () {
    return {
      color: this.v1 ? 'red' : yellow',
      fontSize: this.v2 + 'px'
    }
  }
}
```


#### 4. 数组语法
```
<div v-bind:style="[baseStyles, highStyles]"></div>

data: {
  baseStyles: {
    color: 'red',
    
  },
  highStyles: {
      fontSize: '13px'
  }
}
```

