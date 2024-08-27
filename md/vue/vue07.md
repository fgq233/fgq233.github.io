### Vue 组件生命周期

Vue 组件生命周期分为 3 个阶段 [~](https://fgq233.github.io/imgs/vue/lifecycle.png)
 
* 创建阶段
  * `beforeCreate`  
  * `created`   
  * `beforeMount` 
  * `mounted`
* 运行阶段
  * `beforeUpdate`
  * `updated`
* 销毁阶段
  * `beforeDestroy`
  * `destroyed`
 

```
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    };
  },
  beforeCreate() {
    console.log('beforeCreate: 组件实例被创建之前');
  },
  created() {
    console.log('created: 组件实例创建完成');
  },
  beforeMount() {
    console.log('beforeMount: 组件挂载到DOM之前');
  },
  mounted() {
    console.log('mounted: 组件挂载到DOM之后');
  },
  beforeUpdate() {
    console.log('beforeUpdate: 组件数据更新之前');
  },
  updated() {
    console.log('updated: 组件数据更新之后');
  },
  beforeDestroy() {
    console.log('beforeDestroy: 组件实例销毁之前');
  },
  destroyed() {
    console.log('destroyed: 组件实例销毁之后');
  }
};
</script>
```



![](https://fgq233.github.io/imgs/vue/lifecycle2.png)


