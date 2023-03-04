### Nginx 制作下载站点
`Nginx` 使用`ngx_http_autoindex_module`模块来实现下载站点
* 该模块处理以斜杠 `/` 结尾的请求，并生成目录列表
* 该模块默认是关闭的

 
#### 1. 资源
![](https://fgq233.github.io/imgs/java/nginx5.png)


#### 2. 相关指令
* `autoindex on | off;` 启用或禁用目录列表输出，默认为`off`
* `autoindex_exact_size on | off;` 指定是否展示文件的详细大小
  * 默认为`on`，显示出文件的详细大小，单位是`bytes`
  * 改为`off`后，显示出文件的大概大小，单位是`kB`或`MB`或`GB`

* `autoindex_format html | xml | json | jsonp;` 设置目录列表的格式，默认为`html`

* `autoindex_localtime on | off;` 是否在目录列表上显示时间
  * 默认为`off`，显示的文件时间为`GMT`时间
  * 改为`on`后，显示的文件时间为文件的服务器时间

```
http {
    server {
        listen       80;
        server_name  localhost;

         location /download/ {
            root html;
            autoindex on;
            autoindex_exact_size off;
            autoindex_format html;
            autoindex_localtime on;
        }
    }
}
```


#### 3. 访问下载站点
访问 `http://localhost/download/`，显示如下

![](https://fgq233.github.io/imgs/java/nginx6.png)