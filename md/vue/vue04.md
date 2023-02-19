### Vue Cli
`Vue Cli` 是 Vue 开发的标准工具，简化了基于 webpack 创建工程化 Vue 项目的过程

[https://cli.vuejs.org](https://cli.vuejs.org)

### 一、使用 
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
vue create vue2-demo03
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
