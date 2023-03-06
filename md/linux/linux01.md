### 一、命令格式
在Linux中命令的通用格式：`command [-options] [parameter]`
* `command`： 命令本身
* `-options`：可选项，控制命令的行为细节
* `parameter`：可选项，命令的参数，多数用于命令的指向目标


### 二、Linux 目录结构
![](https://fgq233.github.io/imgs/linux/linux01.png)


* `Windows` 系统有多个顶级目录，即各个盘符

* `Linux` 中没有盘符的概念，只有一个顶级目录：根目录 `/`

* 打开命令行，默认定位到当前用户的`Home`，路径：`/home/用户名`，这和`Windows`是一样的
  * `Windows`：`C:\Users\fgq>`
  * `Linux`： `/home/fgq233`


 
### 三、ls 命令
#### 1. 格式
* 格式：`ls [-a -l -h] [路径]`：用于列出目录下的内容

* 不使用可选项和参数，表示：以平铺形式，列出**当前工作目录下**的内容

* 可选项
  * `-a`：即`all`，列出全部文件（`包含隐藏的文件夹/文件`）
  * `-l`：即`list`，以列表的形式展示更详细的内容（`权限、用户组和用户、大小、创建时间、文件夹/文件名`）
  * `-h`：一般搭配 `-l` 一起使用，给大小带上单位
  
* 可选项可以组合使用，下面4种写法效果是一样的
  * `ls -l -a`
  * `ls -a -l`
  * `ls -la`
  * `ls -al`

#### 2. 示例
![](https://fgq233.github.io/imgs/linux/linux02.png)

 