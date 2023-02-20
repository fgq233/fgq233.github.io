### axios 拦截器 Interceptors 
axios 拦截器分为请求拦截器、响应拦截器
#### 1. 请求拦截器
用于在`请求发出之前`做一些操作

```js
// 语法 
axios.interceptors.request.use(function (config) {
    // 在请求发出之前做些什么
    return config;
  }, function (error) {
    // 处理请求错误 
    return Promise.reject(error);
  });

// 示例：添加了一个请求头，所有请求都会附带这个请求头
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = "Bearer xxxxxx";
    return config;
}, function (error) {
    return Promise.reject(error);
});
```



#### 2. 响应拦截器
在响应数据被 `then()` 或 `catch()` 处理前做一些操作

```js
// 语法 
axios.interceptors.response.use(function (response) {
    // 对响应数据做些什么 (在2xx范围内的任何状态代码都会触发此函数）
    return response;
  }, function (error) {
    // 处理响应错误  (任何超出2xx范围的状态代码都会触发此函数)
    return Promise.reject(error);
  });

// 示例：后端接口返回 401 Unauthorized(用户未授权), 跳转登录页，重新认证
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && error.response.status && error.response.status === 401) {
        // 跳转登录页，重新认证
    }
    return Promise.reject(error);
});
```



#### 3. 取消拦截器
添加拦截器的方法会返回一个值，用于取消拦截器

```js
const myInterceptor1 = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor1);

const myInterceptor2 = axios.interceptors.response.use(function () {/*...*/});
axios.interceptors.response.eject(myInterceptor2);
```




#### 4. axios 实例添加拦截器

```js
const instance = axios.create();

// 添加请求拦截器
instance.interceptors.request.use(function () {/*...*/});
// 清除所有请求拦截器
instance.interceptors.request.clear(); 

// 添加响应拦截器
instance.interceptors.response.use(function () {/*...*/});
// 清除所有响应拦截器
instance.interceptors.response.clear(); 
```



#### 5. 拦截器扩展选项 synchronous
`synchronous` 设置为true，则请求变成同步请求，默认 false

```js
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = "Bearer xxxxxx";
    return config;
}, null, { synchronous: true });
```




#### 6. 拦截器扩展选项 runWhen 筛选函数
`runWhen` 筛选函数，默认null，当返回false时，跳过当前拦截器

```js
function onGetCall(config) {
    return config.method === 'get';
}
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = "Bearer xxxxxx";
    return config;
}, null, { runWhen: onGetCall });


// 源码中：判断是否存在runWhen函数，通过runWhen执行返回值，判断是否跳过当前拦截器
if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
  return;
}
```
