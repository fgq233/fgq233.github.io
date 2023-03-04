### Rewrite 功能
* `Rewrite` 主要的作用是用来实现`URL`的重写
* 地址重写 `VS` 地址转发
  * 地址重写浏览器`地址`会发生变化，地址转发则不变
  * 一次地址重写会产生`两次请求`，一次地址转发只会产生`一次请求`
  * 地址重写到的页面必须是`一个完整的路径`，而地址转发则不需要
  * 地址重写因为是两次请求所以request范围内属性不能传递给新页面，而地址转发因为是一次请求所以可以`传递值`
  * 地址转发`速度`快于地址重写

### 一、相关指令
#### 1. set 指令
用来设置一个新的变量
  * 位置 `server、location、if`
  * 变量名要用 `$` 开始，且不能与`Nginx`预设的全局变量一样
  
```
location /abc {
    default_type text/plain;
    set $name fgq;
    set $age 18;
    return 200 $name今年$age;
}
```

#### 2. if 指令
* 用来条件判断
  * 位置 `server、location`
  * `if` 与 `(` 之间一定要加空格
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
* 位置 `server、location、if`


















