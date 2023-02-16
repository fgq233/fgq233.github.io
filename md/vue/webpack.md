### webpack 前端工程化
* 主要功能：前端模块化开发，代码压缩混淆、处理浏览器端JavaScript兼容性等
* `Vue、React `都是基于 webpack 进行工程化开发的

### 一、模块化项目案例
* 开发工具：`Visual Studio Code`
* 环境：`Node.js`

#### 1. 初始化 package.json
新建一个空白文件夹，运行 `npm init -y` 命令，初始化包管理的配置文件 `package.json`

#### 2. 安装 Jquery、webpack
* `-S`是`--save`缩写，依赖会放在`package.json`的`dependencies下面`
* `-D`是`--save-dev`缩写，依赖会放在`package.json`的`devDependencies`下面 
* `devDependencies` 中依赖仅仅是编译时期使用，打包后的源码不存在

```
npm install jquery -S       
npm install webpack@5.41.1 webpack-cli@4.7.2 -D
```

#### 3. 配置 webpack
* 项目根目录下新增 `webpack.config.js`
* 使用`Node.js`导出语法，向外导出一个`webpack`的配置对象

```
module.exports = {
  mode: "development"
};
```

`mode` 是构建模式
* `development`  测试模式，打包快，不压缩代码
* `production`   生产模式，打包慢，压缩代码


#### 4. package.json 配置 scripts
`"start": "webpack"` 表示可通过 `npm run` 执行该脚本，如：`npm run start`

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
* 新建 `src` 源代码目录，
* `src` 目录下新建 `index.html、index.js`，内容如下

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
    </ul>
</body>
</html>
```

```
import $ from "jquery";

$(function () {
    $("li:odd").css('background-color', 'blue');
    $("li:even").css('background-color', 'yellow');
});
```

此处使用 `ES6` 模块化方式导入 `jquery`


#### 6. 使用 webpack 打包项目
`npm run start`

![](https://fgq233.github.io/imgs/vue/webpack.png)

