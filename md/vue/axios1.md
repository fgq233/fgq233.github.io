### axios
`axios` 是一个专注于网络请求的库

[https://www.npmjs.com/package/axios](https://www.npmjs.com/package/axios)

### 一、使用
#### 1. 使用步骤
* 导入 `axios`
* 调用方法发出请求，处理结果
  * `axios.get(url, configs)`
  * `axios.post(url, configs)`
  * `axios(configs)`
  
#### 2. 说明
* `axios` 请求返回的结果是`ES6`中的`Promise`对象，因此可以使用其 `then、catch、finally`等方法
* `axios`对请求返回的数据做了一层封装，`then`中的`response.data`才是真正返回的数据

![](https://fgq233.github.io/imgs/vue/axios.png)

#### 3. GET请求
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



#### 4. POST请求
```
// 在第二个参数对象 {} 中传递参数
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
}).then(function (response) {
    
}).catch(function (error) {
   
});

// 配置中 data 参数对象传参
axios({
    method: 'post',
    url: '/user/12345',
    data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
}).then(function (response) {

}).catch(function (error) {

});
```


### 二、搭配 ES7 中 aysnc、await
* 因为 axios 返回的结果是`Promise`对象，因此可以在前面加 `await` 直接获取`then()`中的 `response`
* `await` 只能用在 `async` 修饰的方法中
 
```
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

```
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

```
Promise.race([getUser(), getStarred()])
    .then(function (response) {

    }).catch(function (error) {

    });
```