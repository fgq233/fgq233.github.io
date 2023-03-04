### gzip 静态资源压缩

#### 1. 压缩相关指令
* `gzip`   开启后，静态资源文件在传输时会进行压缩，提高访问速度

* `gzip_types`  根据响应资源`mime`类型选择性地开启压缩功能，配置值参考同目录 `mime.types` 文件
  * 默认只会压缩 `text/html`
  * 可以配置多个值，以空格分割
  * `*`表示所有`mime`类型
  
* `gzip_comp_level` 压缩级别，范围 1~9，值越大表示压缩程度越高，但是也越费时间

* `gzip_min_length`  针对传输数据的大小`Content-Length`，低于配置大小则不压缩

* `gzip_buffers`  压缩的缓冲区数量和大小

* `gzip_http_version`  针对不同的`HTTP`协议版本，选择性地开启和关闭`gzip`压缩

* `gzip_vary`  开启后，压缩的资源添加了一个`响应头 Vary:Accept-Encoding`

* `gzip_disable`  用于排除一些不支持`gzip`的浏览器

* `gzip_proxied`  设置是否对服务端返回的结果进行`gzip`压缩


#### 2. 示例
``` 
http {
    gzip on;
    gzip_types text/css application/javascript application/json;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_buffers 4 16K;
    gzip_http_version 1.1;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";
    gzip_proxied off;
}
```

可以将这些配置单独抽取到一个配置文件`nginx_gzip.conf`，然后通过`include nginx_gzip.conf`加载


#### 3. gzip和sendfile共存问题
`gzip` 和 `sendfile` 默认是冲突的，需要使用`ngx_http_gzip_static_module`模块的`gzip_static`指令来解决




 