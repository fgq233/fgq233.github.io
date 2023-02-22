### Vue Cli创建工程化项目
`Vue Cli` 是 Vue 开发的标准工具，简化了基于 webpack 创建 Vue 工程化项目的过程

[https://cli.vuejs.org](https://cli.vuejs.org)

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

 
