### axios 实例方法
### 一、使用
* 创建实例
* 使用实例发出请求
  * `axios.get(url, configs)`
  * `axios.post(url, data, configs)`
  * 通用 `axios(configs)`
  * 通用 `axios.request(config)`

```js
// 创建实例
const instance = axios.create();

// get
instance.get(url, configs).then(function (response) {
    console.log(response)
});
// post
instance.post(url, data, configs).then(function (response) {
    console.log(response)
});

// 通用
var configs = {
  url: 'https://api.github.com/users/fgq233',
  method: 'get'
}
instance(configs).then(function (response) {
  console.log(response)
});
instance.request(configs).then(function (response) {
    console.log(response)
});
```


### 二. 配置优先级
```js
// 1、全局配置 
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 2、通过实例配置
var instance = axios.create({
  baseURL: "https://api.example.com"
});
// 在实例已创建后：修改默认值
instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;

// 3、请求参数 configs 配置
const configs = {
  baseURL: "https://api.example.com",
  headers:{
    Authorization: AUTH_TOKEN
  }
};
instance.get(url, configs);
```

优先级：请求的 `configs` > 实例`instance`配置 > 全局配置



### 三、axios 的 config 配置详解
只有 `url` 是必需的，如果没有指定 `method`，请求将默认使用 `get` 方法

```
{
  // 请求地址
  url: '/user',

  // 请求方法，默认get
  method: 'get', 

  // 将拼接在 url 前面，除非 url 是一个绝对 URL
  baseURL: 'https://some-domain.com/api/',

  // 允许在向服务器发送前，修改请求数据，只能用在 "PUT", "POST" 和 "PATCH" 这几个请求方法中
  // 后面数组中的函数必须返回一个string，或Buffer、ArrayBuffer、FormData、Stream
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
  }],

   // 在返回数据传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // headers 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // params 是即将与请求一起发送的 URL 参数，必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

  // 是一个负责 params 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: "brackets"})
  },
  
  // data 是作为请求主体被发送的数据，只适用于 "PUT", "POST", "PATCH" 请求方法
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属: FormData, File, Blob
  // - Node 专属: Stream, Buffer, FormData (form-data package)
  data: {
    firstName: 'Fred'
  },
  
  // 指定请求超时前的毫秒数，如果请求的时间超过 timeout，则请求将被中止，默认 0无超时时间
  timeout: 1000, 

  // 表示跨域请求时是否需要使用证书，默认 false
  withCredentials: false, 

  // 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应
  adapter: function (config) {
     
  },

  // 在使用 Basic Auth 基本身份验证中用到，会在请求头中生成 Authorization，并覆盖任何现有的
  // 对于 Bearer tokens，需要自定义“Authorization”，而不是使用这个配置
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // 服务器响应的数据类型，可以是 arraybuffer、document、json、text、stream
  // 浏览器专属: 'blob'
  responseType: 'json', // 默认

  // 表示用于解码响应的编码 (仅在 Node.js 使用)
  // 注意：对于“stream”或客户端请求的“responseType”忽略
  responseEncoding: 'utf8', // 默认

  // 用作xsrf令牌值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认

  // 承载xsrf令牌值的http请求头的名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认

  // 允许处理上传的进度事件（browser & node.js）
  onUploadProgress: function ({loaded, total, progress, bytes, estimated, rate, upload = true}) {
    
  },

  // 允许处理下载的进度事件（browser & node.js）
  onDownloadProgress: function ({loaded, total, progress, bytes, estimated, rate, download = true}) {
    // Do whatever you want with the Axios progress event
  },

  // 定义node.js中允许的http响应内容的最大大小（单位为字节）
  maxContentLength: 2000,

  // 定义node.js中http请求内容的最大大小（单位为字节）
  maxBodyLength: 2000,

  // 返回true、null、undefined，Promise 状态变更为 resolve; 其他的变更为 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认
  },

  // 定义在 node.js 中最大重定向数目，设置为0 将不会进行任何重定向
  maxRedirects: 21, // default

  // 在重定向之前调用的函数
  beforeRedirect: (options, { headers }) => {
    if (options.hostname === "example.com") {
      options.auth = "user:password";
    }
  },

  // 在执行 http 和 https 请求时使用的自定义代理
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 定义代理服务器的 ip、端口
  // auth 表示使用 HTTP Basic auth 连接代理，会生成一个 Proxy-Authorization 凭据，并覆盖任何现有的
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    // hostname: '127.0.0.1' // Takes precedence over 'host' if both are defined
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // 指定用于取消请求的 cancel token
  cancelToken: new CancelToken(function (cancel) {
  }),

  // 取消Axios请求的另一种方法：使用AbortController
  signal: new AbortController().signal,

  // 用于将一个 FormData 载体数据自动序列化为FormData对象
  env: {
    FormData: window?.FormData || global?.FormData
  }
}
```





