### axios
`axios` 是一个专注于网络请求的库

[https://www.npmjs.com/package/axios](https://www.npmjs.com/package/axios)

### 一、使用
#### 1. 步骤
* 导入 `axios`
* 调用方法发出请求，处理结果
  * `axios.get(url, configs)`
  * `axios.post(url, configs)`
  * `axios(configs)`
  
#### 2. 说明
`axios` 请求返回的结果是`ES6`中的`Promise`对象，因此可以使用其 `then、catch、finally`等方法


### 一、GET请求
```
// 直接在 url 中传递参数
axios.get('/user?ID=12345').then(function (response) {

}).catch(function (error) {

}).finally(function () {

});

// 通过 params 传递参数
axios.get('/user', {
    params: {
        ID: 12345
    }
}).then(function (response) {

}).catch(function (error) {

}).finally(function () {

});

// 通用方法，使用 params 传参
axios({
    method: 'get',
    url: '/user',
    params: {
        ID: 12345
    }
}).then(function (response) {

}).catch(function (error) {

}).finally(function () {

});
```

![](https://fgq233.github.io/imgs/vue/axios.png)





