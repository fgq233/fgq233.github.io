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
此API自 v0.22.0 起已弃用，不应在项目中使用

* 方式①：直接使用 axios.CancelToken --- 取消所有 source.token 一样的请求

```js
const source = axios.CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});
// 取消请求
source.cancel();

axios.post('/user/12345', {name: 'fgq'}, {
  cancelToken: source.token
});
// 取消请求
source.cancel();
```

*  方式②：使用 CancelToken 构造函数 --- 取消单个请求

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
