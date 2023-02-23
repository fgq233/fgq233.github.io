### Vue 插槽
插槽`Slot`是vue为封装组件提供的能力，将封装组件不确定的、希望用户指定的部分定义为插槽

#### 1. 声明插槽
在封装组件时，使用 `<slot></slot>` 声明插槽区域

```
<template>
  <div>
    <h3>AlertBox 组件</h3>
    <slot></slot>
  </div>
</template>
```

#### 2. 填充插槽区域内容
在 `AlertBox` 中可以添加任何内容，然后这些内容会被渲染到插槽区域

```
<template>
  <div id="app" class="box">
    <AlertBox>
      <p>666</p>
    </AlertBox>
  </div>
</template>
```

#### 3. 具名插槽
* 插槽可以定义多个，每个插槽都有一个 `name` 属性，默认值 `default`（属性值可以相同）
* 在使用组件时，若没有指定插槽`name`，则内容会填充到`name`属性为 `default` 的插槽之中
* 若填充内容没有对应 `name` 的插槽，则内容会被忽略

```
<template>
  <div>
    <slot name="x1"></slot>
    <h3>AlertBox 组件</h3>
    <slot name="x2"></slot>
  </div>
</template>
```

#### 4. v-slot指令填充到指定插槽 
```
<template>
  <div id="app">
    <AlertBox>
    
      <template v-slot:x1>
        <p>666</p>
      </template>

      <template #x2>
        <p>888</p>
      </template>
    </AlertBox>
    
  </div>
</template>
```

* 使用`<template>`标签包裹填充内容，在标签上使用`v-slot`指令将内容填充到指定插槽
* 对于具名插槽，`v-slot`指令可简写为 `#`
* `v-slot` 指令不能直接用在元素上，必须用在`<template>`标签上


#### 5. 后备内容
插槽内支持填充默认内容，当使用组件没有为插槽填充内容，则插槽里面默认的内容会生效

```
<slot name="x">666666</slot>
```


#### 6. 作用域插槽
* 在封装组件时，为插槽提供相关属性，这些属性可以在使用时接收到，这种用法叫做作用域插槽
* 作用域插槽让填充内容能够访问组件中的数据
* 如下，`obj` 为 `{ "msg": "fgq", "info": "666" }`

```
定义插槽
<slot name="x" msg="fgq" info="666"></slot>

使用1
<AlertBox>
    <template #x="obj">
      <p>﹛﹛ obj ﹜﹜</p>
      <p>﹛﹛ obj.msg ﹜﹜</p>
      <p>﹛﹛ obj.info ﹜﹜</p>
    </template>
</AlertBox>

使用2：解构赋值
<AlertBox>
  <template #x="{ msg, info }">
    <p>﹛﹛ msg ﹜﹜</p>
    <p>﹛﹛ info ﹜﹜</p>
  </template>
</AlertBox>
```


#### 7. 动态插槽名
动态指令参数也可以用在 v-slot 上，来定义动态的插槽名

```
<AlertBox>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</AlertBox>
```
