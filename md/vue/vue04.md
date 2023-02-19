### Vue Cli
`Vue Cli` 是 Vue 开发的标准工具，简化了基于 webpack 创建 Vue 工程化项目的过程

[https://cli.vuejs.org](https://cli.vuejs.org)

### 一、Vue Cli创建工程化项目
#### 1. 安装 Vue Cli
Vue Cli 是 npm 上一个全局包，使用下述命令将它安装到电脑上

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```
 
#### 2. 创建项目
```
vue create my-project
# OR
vue ui
```

<details><summary>创建过程</summary>
<pre><code>① 选择项目配置，共三种：Vue3项目、Vue2项目、自定义配置
? Please pick a preset: (Use arrow keys)
  Default ([Vue 3] babel, eslint)
  Default ([Vue 2] babel, eslint)
> Manually select features
  
② 选择要安装的功能
? Please pick a preset: Manually select features
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection, and
<enter> to proceed)
 (*) Babel
 ( ) TypeScript
 ( ) Progressive Web App (PWA) Support
 ( ) Router
 ( ) Vuex
>(*) CSS Pre-processors
 ( ) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing
 
 
③ 选择Vue版本
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, CSS Pre-processors
? Choose a version of Vue.js that you want to start the project with
  3.x
> 2.x

④ 选择CSS预处理器
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, CSS Pre-processors
? Choose a version of Vue.js that you want to start the project with 2.x
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): (Use arrow keys)
  Sass/SCSS (with dart-sass)
> Less
  Stylus
  
⑤ 第②步安装的功能是单独一个配置文件，还是放在package.json中
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, CSS Pre-processors
? Choose a version of Vue.js that you want to start the project with 2.x
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Less
? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
> In dedicated config files
  In package.json

⑥ 保存当前选择，供后续第①步创建使用
Vue CLI v5.0.8
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, CSS Pre-processors
? Choose a version of Vue.js that you want to start the project with 2.x
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Less
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? Yes
? Save preset as: v2-my
</code></pre>
</details>


#### 3. 项目结构
![](https://fgq233.github.io/imgs/vue/vue1.png)

* `public` 存放单页面应用程序唯一一个 `html` 页面
* `src` 源代码目录
  * `assets` 静态资源，如：css 样式表、图片资源
  * `components` 可复用的组件
  * `main.js` 项目的入口文件，整个项目的运行，要先执行 main.js
  * `App.vue` 项目的根组件


#### 4. 启动项目
* `package.json` 中默认定义了2个`scripts`，一个用于开发阶段，一个用于正式打包
* `npm run serve` 启动
* 启动成功，通过 [http://localhost:8080](http://localhost:8080) 访问

```
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build"
},
```


### 二、vue 组件内容
* 在工程化项目中， vue 通过 main.js 把 App.vue 渲染到 index.html 的指定区域中
* 每个 .vue 文件都是一个组件，每个组件都由`template、script、style`组成

```
<template>
  <div class="test-box">
    <p> {{ count }}</p>
    <button @click="add">+1</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    add() {
      this.count += 1;
    }
  }
}
</script>

<style lang="less">
.test-box {
  background-color: yellow;
}
</style>
```
