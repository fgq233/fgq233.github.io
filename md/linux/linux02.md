### 命令基础
### 一、命令格式
在Linux中命令的通用格式：`command [-options] [parameter]`
* `command`： 命令本身
* `-options`：可选项，控制命令的行为细节
* `parameter`：可选项，命令的参数，多数用于命令的指向目标


### 二、Linux 目录结构
![](https://fgq233.github.io/imgs/linux/linux01.png)

* `Windows` 系统有多个顶级目录，即各个盘符
* `Linux` 中没有盘符的概念，只有一个顶级目录：根目录 `/`
* 打开命令行，默认定位到当前用户的所在路径：`/home/用户名`，这和`Windows`是一样的
  * `Windows`：`C:\Users\fgq>`
  * `Linux`： `/home/fgq233`


### 三、基础命令
#### 1. ls 
* 列出目录下的内容
* 语法：`ls [-a -l -h] [路径参数]`
    * `-a`：即`all`，列出全部文件（`包含隐藏的文件夹/文件`）
    * `-l`：即`list`，以列表的形式展示更详细的内容
    * `-h`：一般搭配`-l` 一起使用，给大小带上单位
* 可选项可以组合使用，下面4种写法效果是一样的
    * `ls -l -a`
    * `ls -a -l`
    * `ls -la`
    * `ls -al`

#### 2. cd 
* 作用：来自英文`Change Directory`，用于更改当前所在的工作目录
* 语法： `cd [路径参数]`
  * 不带路径，表示切换到用户所在目录  
  * 携带路径，表示切换到指定目录       

```
cd 
cd Desktop
cd /home/fgq233/Desktop
```

#### 3. pwd 
* 作用：来自英文`Print Work Directory`，用于查看当前工作目录
* 语法： `pwd`

 