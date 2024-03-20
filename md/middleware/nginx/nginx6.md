### rewrite 功能
`Rewrite` 主要的作用是重写`URL`

### 一、相关指令
#### 1. set 指令
用来设置一个新的变量
  
```
location /abc {
    default_type text/plain;
    set $name fgq;
    set $age 18;
    return 200 $name今年$age;
}
```

#### 2. if 指令
* 用来条件判断，注意：`if` 与 `(` 之间一定要加空格
* 判断条件 
  * 变量名
  * 使用 `=` 和 `!=` 比较变量和字符串，字符串不需要添加引号，并且`=` 和 `!=` 前后需要加空格
  * 使用正则表达式对变量进行匹配，`~  ~*  !~  !~*`
  * 判断请求的文件是否存在 `-f`、`!-f`
  * 判断请求的目录是否存在 `-d`、`!-d`
  * 判断请求的目录或者文件是否存在 `-e`、`!-e`
  * 判断请求的文件是否可执行 `-x`、`!-x`


```
location /abc {
    default_type text/plain;
    if ($args){
        return 200 $args;
    }	
    if ($request_method = POST){
        return 404;
    }
    if ($http_user_agent ~ MSIE){
        return 200  IE浏览器;
    }
    if (!-f $request_filename){
        return 200  资源文件不存在;
    }
    if (!-d $request_filename){
       return 200  目录不存在;
    }
    return 200;
}
```


#### 3. break 指令
* 作用1：用于中断相同作用域中的其他语句，`break`前面的语句生效，`break`后面的语句无效
* 作用2：终止当前的匹配并把当前的`URI`在本`location`进行重定向访问处理


#### 4. return 指令
* 作用：用于完成对请求的处理，在`return`后的所有语句都是无效的
* 语法
  * `return code [text];` 状态码`code`，响应体内容`text`
  * `return code URL;`    重定向到一个新`URL`地址
  * `return URL;`         重定向到一个新`URL`地址


```
location /abc {
    return 200 success;
}
location /abc {
    return 302 https://fgq233.github.io/md/blog;
}
location /abc {
    return https://fgq233.github.io/md/blog;
}
```



#### 5. rewrite 指令
* 作用：通过正则表达式匹配URI，重写为一个新的URI，然后返回
* 语法：`rewrite regex replacement [flag]`
  * `regex` 用来匹配`URI`的正则表达式
  * `replacement`  匹配成功后，用于替换URI中被截取内容的字符串
  * `flag` 用来设置`rewrite`对`URI`的处理行为，默认`last`
    * `last`       将重写的URI重新匹配`localtion`进行处理
    * `break`      将重写的URI继续在`当前location块`中进行处理    
    * `redirect`   重写的URI返回，进行状态码为302的临时重定向  
    * `permanent`  重写的URI返回，进行状态码为301的永久重定向   

```
访问 localhost/abc/demo
访问 localhost/abc/test1
访问 localhost/abc/test2
访问 localhost/abc/test3
访问 localhost/abc/test4

# $1表示第1个括号内容，$2表示第2个括号内容......
location /abc {
    rewrite ^/abc/demo*$   https://www.baidu.com; 
    rewrite ^/abc/(test1)*$  /$1  last;             # localhost/abc/test1 地址不变，重写的URI匹配到 /test  
    rewrite ^/abc/(test2)*$  /imgs/404.png  break;  # localhost/abc/test2 地址不变，重写的URI继续在当前location块处理，寻找html/imgs/404.png
    rewrite ^/abc/(test3)*$  /$1  redirect;         # 地址改变，临时重定向到 localhost/test
    rewrite ^/abc/(test4)*$  /$1  permanent;        # 地址改变，永久重定向到 localhost/test
}

location /test{
    default_type text/plain;
    return 200 success;
}
```


#### 6. rewrite_log 指令
* 作用：用于开启URL重写日志的输出功能
* 语法：`rewrite_log on|off;`



### 二、rewrite 案例
#### 1. 域名跳转
访问 [www.jd.com]()、[www.360buy.com]()、[127.0.0.1]() 最终都跳转到 [www.jd.com]()

```
server {
  listen  80;
  server_name  www.360buy.com  127.0.0.1;
  rewrite ^(.*) http://www.jd.com$1;
}
```


#### 2. 独立域名
一个完整的项目包含多个模块，为每一个模块设置独立的域名
* 登录模块 [https://login.taobao.com]() 
* 搜索模块 [https://s.taobao.com]()     
* 异常模块 [https://error.taobao.com]() 

```
正则中  . 表示任意字符，* 表示出现0或者任意次

server{
    listen 80;  
    server_name login.taobao.com;
    rewrite ^(.*) http://www.taobao.com/login$1;
}
server{
    listen 80;
    server_name s.taobao.com;
    rewrite ^(.*) http://www.taobao.com/search$1;
}
server{
    listen 80;
    server_name error.taobao.com;
    rewrite ^(.*) http://www.taobao.com/error$1;
}
```


#### 3. 防盗链
当检测到防盗链时，使用`rewrite`提供更好的提示，如指定一个图片

```
location /imgs {  
    valid_referers  none  blocked  127.0.0.1  www.github.com
    if ($invalid_referer){
        rewrite ^/  /imgs/404.png break;
    }
}
```
 