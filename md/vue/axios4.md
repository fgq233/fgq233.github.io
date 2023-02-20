### axios 取消请求
#### 1. 方式1：使用AbortController
从 v0.22.0 版本开始， Axios 支持使用 AbortController 取消请求

```js
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {

});
// 取消请求
controller.abort()
```


#### 2. 方式2：使用 CancelToken
此API自 v0.22.0 起已弃用，不推荐在项目中使用

* 方式①：使用 `axios.CancelToken.source()` ---→ 取消所有 `cancelToken` 一样的请求

```js
const source = axios.CancelToken.source();

axios.get('/user', {
  cancelToken: source.token     // 取消请求的令牌
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) { // 判断是取消请求，还是发生请求异常
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

axios.post('/user', {name: 'fgq'}, {
  cancelToken: source.token
});
// 取消请求，可以传递一个参数，该参数可以在 catch() 中通过 thrown.message 拿到
source.cancel();
// source.cancel('请求被取消了~~~');
```

*  方式②：使用 `CancelToken` 构造函数 ----→ 取消单个请求

```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  })
});
cancel();
```
