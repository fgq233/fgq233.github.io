### axios 发送 get、post 请求
`axios` 是一个专注于网络请求的库

[https://www.npmjs.com/package/axios](https://www.npmjs.com/package/axios)

### 一、使用
#### 1. 使用步骤
* 导入 `axios`
* 调用方法发出请求
  * `axios.get(url, configs)`
  * `axios.post(url, data, configs)`
  * 通用 `axios(configs)`
  * 通用 `axios.request(config)`
* 处理结果


#### 2. 说明
`axios` 的请求方法返回的结果是`ES6`中的`Promise`对象， 因此可以使用`then、catch、finally`方法


#### 3. GET请求
```js
// 直接在 url 中传递参数
axios.get('/user?ID=12345').then(function (response) {

});

// configs 中通过 params 传递参数
axios.get('/user', {
    params: {
        ID: 12345
    }
}).then(function (response) {

});

// 通用方法，configs 中使用 params 传参
axios({
    method: 'get',
    url: '/user',
    params: {
        ID: 12345
    }
}).then(function (response) {
    
});
```



#### 4. POST请求
```js
// 第二个参数 data 传参
axios.post('/user', {ID: 12345}).then(function (response) {

});

// 通用方法，configs 中使用 data 传参
axios({
  method: 'post',
  url: '/user/12345',
  data: {ID: 12345}
}).then(function (response) {

});
```


#### 5. 响应数据
* `axios`对请求返回的数据做了一层封装，`data`才是真正返回的数据

![](https://fgq233.github.io/imgs/vue/axios.png)

```
{
  data: {},         // 服务器的响应数据
  status: 200,      // HTTP 状态码
  statusText: "OK", // 来自服务器响应的 HTTP 状态信息
  headers: {},      // 服务器响应头
  config: {}        // 为请求提供的配置信息
}
```

#### 6. 捕获异常
```
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // 请求已发出，但服务器响应码不在 2xx范围内
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 已提出请求，但未收到响应
      console.log(error.request);
    } else {
      // 请求时触发了错误，请求未能发出去
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```



### 二、搭配 ES7 中 aysnc、await
`await` 只能用在 `async` 修饰的方法中
 
```js
async function init() {
    try {
        var response = await axios.get('https://api.github.com/users/fgq233');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    };
}

// 使用 ES6 解构赋值直接获取 data
async function init() {
    try {
        var { data } = await axios.get('https://api.github.com/users/fgq233');
        console.log(data);
    } catch (error) {
        console.error(error);
    };
}
```




### 三、Promise.all() 执行多个并发请求 
`Promise.all()` 方法用于将多个 `Promise` 实例包装成一个新的 `Promise` 实例
* 全部实例都成功，状态变为`fulfilled`，才算成功，回调 `then()`
* 只要有一个异常，状态变为`rejected`，就算失败，回调 `catch()`

```js
function getUser() {
    return axios.get('https://api.github.com/users/fgq233');
}

function getStarred() {
    return axios.get('https://api.github.com/users/fgq233/starred');
}

Promise.all([getUser(), getStarred()])
    .then(function (results) {
        // 两个请求现在都执行完成
        let user = results[0];
        let started = results[1];
    }).catch(err => console.log(err));
```


### 四、Promise.race() 获取最快返回结果
* `Promise.race()` 也可以将多个 `Promise` 实例包装成一个新的 `Promise` 实例
* race比赛，哪个实例获取结果最快，就返回该结果，不管结果本身是成功还是失败

```js
Promise.race([getUser(), getStarred()])
    .then(function (response) {

    }).catch(function (error) {

    });
```
