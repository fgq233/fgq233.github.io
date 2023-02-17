### webpack 前端工程化
* 主要功能：前端模块化开发，代码压缩、处理浏览器端`JavaScript`兼容性
* `Vue、React `都是基于 `webpack` 进行工程化开发的

### 一、模块化项目案例
* 开发工具：`Visual Studio Code`
* 环境：`Node.js`

#### 1. 初始化 package.json
`npm init -y` 命令初始化包管理的配置文件 `package.json`

#### 2. 安装 jquery、webpack、webpack-cli
```
npm install jquery -S       
npm install webpack@5.41.1  -D
npm install webpack-cli@4.7.2 -D
```

* `-S`是`--save`缩写，依赖会放在`package.json`的`dependencies下面`
* `-D`是`--save-dev`缩写，依赖会放在`package.json`的`devDependencies`下面 

#### 3. webpack 配置 webpack.config.js
```
module.exports = {
  mode: "development"
};
```

* 根目录下新增配置文件 `webpack.config.js`
* `mode` 是构建模式
  * `development`  测试模式，打包快，不压缩代码
  * `production`   生产模式，打包慢，压缩代码


#### 4. package.json 配置 scripts
* 在 `package.json` 文件的 `scripts` 节点下，新增 `start` 命令
* 之后可通过 `npm run start` 执行`webpack`打包

```
  "scripts": {
    "start": "webpack"      
  },
```



#### 5. 初始化 src 目录，测试文件
新建`src`源代码目录，目录下新建 `index.html、index.js`

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../dist/main.js"></script>
</head>
<body>
    <div style="height: 100px;">666</div>
</body>
</html>
```

```
import $ from "jquery";

$(function () {
    $("div").css('background-color', 'yellow');
});
```


#### 6. 使用 webpack 打包项目
![](https://fgq233.github.io/imgs/vue/webpack1.png)


* `npm run start`
* 打包成功后，会生成一个 `dist` 清单目录

* 在 `webpack 4.x、5.x` 版本， 默认打包入口文件 `src/index.js`， 输出文件为 `dist/main.js`
  
* `index.html`中引用 `dist/main.js`，然后在浏览器中运行 `index.html`



### 二、webpack.config.js 其他配置
`webpack` 打包前，会先读取配置文件 `webpack.config.js`，基于相关配置对项目进行打包 

#### 1. 打包入口、输出文件
* `entry ` 修改打包入口默认配置
* `output` 修改输出文件默认配置 

```
const path = require('path');

module.exports = {
  entry: path.join(__dirname, './src/index.js'),  // 指定要处理哪个文件
  output: {
    path: path.join(__dirname, './dist/js'),     // 输出的目录
    filename: 'index.js'                         // 输出的文件名
  }
};
```

在模块中除了 `require、exports` 等模块`API`之外，还有两个特殊的变量
* `__dirname` 当前文件所属目录的绝对路径
* `__filename` 当前文件的绝对路径


#### 2. 热更新
* 安装 `npm install webpack-dev-server@3.11.2 -D`
* 修改 `scripts`，在 `webpack` 打包后面添加 `serve`

```
  "scripts": {
    "start": "webpack serve"
  },
```

* `npm run start` 重新打包，访问地址：`http://localhost:8080`，点击 `src` 可访问 `index.html`
* 打包后的 `js` 存储在内存中，路径为项目根目录，需要修改`html`中`js`路径


![](https://fgq233.github.io/imgs/vue/webpack2.png)



#### 3. 自动引入js插件 html-webpack-plugin 
* 安装 `npm install html-webpack-plugin@5.3.2 -D`
* `webpack.config.js` 中配置该插件

```
// 1、导入该插件
const HtmlPlugin = require('html-webpack-plugin');

// 2、实例化该插件
const p = new HtmlPlugin({
  template: './src/index.html',   // 指定要复制哪个html页面
  filename: './index.html'        // 指定复制出来的存放路径、文件名
})

// 3、通过 webpack 的 plugins 属性让插件生效
module.exports = {
  plugins: [p]
};
```

该插件有2个作用
* 在项目根目录生成 `index.html`
* `index.html` 中自动引入打包后的`js`文件




#### 4. devServer 配置
```
module.exports = {
  devServer: {  
    open: true,         // 首次打包成功后，自动打开浏览器
    host: '127.0.0.1',  // 指定运行的主机地址
    port: 80            // 指定运行的端口
  }
};
```


#### 5. Source Map 配置
* 开发环境下，`webpack.config.js` 中添加如下配置，可保证控制台提示的行数与源代码的行数保持一致
* 正式发布时，为了安全需关闭该配置，或者配置值为 `nosources-source-map`，这样报错的话只提示行号

```
module.exports = {
  devtool: 'eval-source-map'
};
```

#### 6. @配置
定义别名，`@`符号表示 `src` 源代码这层目录，方便 `import` 导入

```
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@' : path.join(__dirname, './src')
    }
  }
};
```


#### 7. 加载器配置
* `webpack` 默认只能打包处理以 `.js` 后缀名结尾的模块，其他的处理不了，需要新增加载器
* ① 安装加载器

```
// .css 格式加载器，可以打包处理 `.css` 文件
npm install style-loader@3.0.0 -D
npm install css-loader@5.2.6 -D

// .less 格式加载器，可以打包处理 `.less` 文件
npm install less@4.1.1 -D
npm install less-loader@10.0.1 -D

// url 路径加载器，可以打包处理 src 路径文件
npm install url-loader@4.1.1 -D
npm install file-loader@6.2.0 -D

// babel 相关包，可以处理高级 JS 语法
npm install babel-loader@8.2.2 -D
npm install @babel/core@7.14.6 -D
npm install @babel/plugin-proposal-decorators@7.14.5 -D
```

* ② `webpack.config.js` 配置加载器
  * `test` 表示匹配的文件类型
  * `use` 表示要调用的加载器，多个加载器调用顺序为：从后往前
  * `?` 之后为加载器参数
    * `limit` 指定文件大小，单位是字节` byte`，`<= limit`大小的图片会被转为`base64`
    * `outputPath` 指定文件构建时，在 `dist` 中的输出路径
  * `exclude` 指定排除项

```
module.exports = {
  module:{
    rules: [
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {test: /\..jpg|png|gif$/, use: 'url-loader?limit=4096&outputPath=images'},
      {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/}
    ]
  }
};
```


* ③ 根目录新增`babel` 配置文件 `babel.config.js`

```
module.exports = {
  plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
};
```


* ④ 使用

```
import './css/index.css';
import '@/css/index.less';
import logo from '@/images/vs.png';

$(function () {
    $("img").attr("src", logo);
});
```

`


### 三、webpack 正式打包
* 在 `package.json` 文件的 `scripts` 节点下，新增 `bulid` 命令
* `--mode=production` 指定构建模式，会覆盖 `webpack.config.js` 中 `mode` 配置
* `npm run bulid` 执行打包

```
"scripts": {
  "start": "webpack serve",
  "bulid": "webpack --mode=production"
}
```
  

