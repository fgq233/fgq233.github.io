### webpack 前端工程化
* 主要功能：前端模块化开发，代码压缩、处理浏览器端`JavaScript`兼容性
* `Vue、React `都是基于 `webpack` 进行工程化开发的

### 一、模块化项目案例
* 开发工具：`Visual Studio Code`
* 环境：`Node.js`

#### 1. 初始化 package.json
运行 `npm init -y` 命令，初始化包管理的配置文件 `package.json`

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

* 根目录下新增配置文件 `webpack.config.js`，向外导出一个`webpack`的配置对象
* `mode` 是构建模式
  * `development`  测试模式，打包快，不压缩代码
  * `production`   生产模式，打包慢，压缩代码


#### 4. package.json 配置 scripts
添加 `"start": "webpack"`，之后可通过 `npm run start` 执行`webpack`打包

```
{
  "name": "webpack-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack"      
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "jquery": "^3.6.3"
  },
  "devDependencies": {
    "webpack": "^5.41.1",
    "webpack-cli": "^4.7.2"
  }
}
```



#### 5. 初始化 src 目录，测试文件
新建 `src` 源代码目录，目录下新建 `index.html、index.js`

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
    <div style="height: 100px;"></div>
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
`npm run start`

![](https://fgq233.github.io/imgs/vue/webpack1.png)

* 打包成功后，会生成一个 `dist` 清单目录

* 在 `webpack 4.x、5.x` 版本
  * 默认打包入口文件 `src/index.js`
  * 默认的输出文件为 `dist/main.js`
  
* `index.html`中引用 `dist/main.js`，然后在浏览器中运行 `index.html`



### 二、webpack 其他配置
`webpack` 打包前，会先读取配置文件 `webpack.config.js`，基于相关配置对项目进行打包 

#### 1. 打包入口、输出文件
* `entry ` 修改打包入口默认配置
* `output` 修改输出文件默认配置 

```
const path = require('path');

module.exports = {
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'main.js'
  },
  mode: "development"
};
```

在模块中除了 `require、exports` 等模块`API`之外，还有两个特殊的变量
* `__dirname`：当前文件模块所属目录的绝对路径
* `__filename`：当前文件的绝对路径


#### 2. webpack-dev-server 自动打包
* 安装 `npm install webpack-dev-server@3.11.2 -D`
* 修改 `scripts`，在 `webpack` 打包后面添加 `serve`
* `npm run start` 重新打包，访问地址：`http://localhost:8080`

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve"
  },
```

* 注意1：若打包报错，可能是 `webpack-cli` 原因，重新安装一下`webpack-cli`
* 注意2：打包后的 `js` 存储在内存中，路径为项目根目录，需要修改`html`中`js`路径


![](https://fgq233.github.io/imgs/vue/webpack2.png)




















































